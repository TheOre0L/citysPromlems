const bd = require('../bd')
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const ApiError = require('../exceptions/api-error');
const tokenService = require('./tokens.controller');
const mailService = require("./mail.controller")
const {validationResult} = require('express-validator');
const {userValidation} = require("../validate/registrationValid")
class UserController {

    async registration (req, res){
        try{
            function validateEmail(email) {
                let re = /\S+@\S+\.\S+/;
                return re.test(email);
            }
            let {
                login,
                password,
                name,
                surname,
                email,
                city} = req.body;
            const {error} = userValidation(req.body);
            console.log(login.length >= 3 && login.length <= 255)
            if(login.length == 0) login = null;
            if(password.length == 0) password = null;
            if(name.length == 0) name = null;
            if(surname.length == 0) surname = null;
            if(city.length == 0) city = null;
            if(!validateEmail(email)) return res.status(400).json({message: "Указанное значение не является электронной почтой!"});
            const hashPassword = await bcrypt.hash(password, 3);
            const activationLink = uuid.v4();
            const candidate = await bd.query("INSERT INTO person (login, password, name, surname, date_for_regist, email, active_link, city) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
                [login, hashPassword, name, surname, new Date(), email, activationLink, city])
            await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`, login);
            const tokens = await tokenService.generateTokens({id: candidate.rows[0].id, email: candidate.rows[0].email, role: candidate.rows[0].role});
            const userDto = candidate.rows[0];
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json({message:"Успешная регистрация!", ...tokens, userDto})
        } catch (e) {
            console.log(e)
            if(e.code == '23505'){
                return res.status(400).json({message: "Пользователь с таким логином уже есть!"})
            }
            if(e.column == 'surname'){
                return res.status(400).json({message: "Укажите фамилию!"})
            }
            if(e.column == 'name'){
                return res.status(400).json({message: "Укажите имя!"})
            }
            if(e.column == 'login'){
                return res.status(400).json({message: "Укажите логин!"})
            }
            if(e.column == 'password'){
                return res.status(400).json({message: "Укажите логин!"})
            }
            if(e.column == 'city'){
                return res.status(400).json({message: "Укажите город!"})
            } else {
                return res.status(400).json({message: "Непредвиденная ошибка!"})
            }
        }

    }
    async login (req, res){
        try {
            const {
                login,
                password} = req.body;
            const user = await bd.query("SELECT * FROM person WHERE login = $1", [login])
            const userDto = user.rows[0];
            if (user.rowCount == 0) {
                return res.status(400).json({message:"Неверный логин или пароль"})
            }
            const isPassEquals = await bcrypt.compare(password, userDto.password);
            if (!isPassEquals) {
                return res.status(400).json({message:"Неверный логин или пароль"})
            }
            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.status(200).json({message:"Успешный вход в аккаунт!", tokens, userDto})
        } catch (e) {
            return res.json(e)
        }
    }
    async activation (req, res){
        try {
            const user = await bd.query("SELECT * FROM person WHERE active_link = $1", [req.params.activation_link])
            if (user.rowCount == 0) {
                return res.status(404).json({message:"Некорректная ссылка активации"})
            }
            await bd.query("UPDATE person set is_activated = $1 where id = $2 RETURNING *",
                [true, user.rows[0].id])
            return res.json({message:"Успешная активация аккаунта!"})
        } catch (e) {
            return res.json(e)
        }
    }
    async getUsers (req, res){
        try {
            const allUsers = await bd.query("Select * From person")
            res.json(allUsers.rows)
        } catch (e) {
            return res.json(e)
        }
    }
    async getOneUser(req, res){
        try{

            const id = req.params.id;
            const userDto = await bd.query("Select * From person where id = $1", [id])
            const user = userDto.rows[0];
            return res.json({message:"Пользователь найден!", user})
        } catch (e) {
            return res.json(e)
        }
    }
    async updateUser(req, res){
        try {
            const {
                id,
                name,
                image,
                surname} = req.body;
            const updateUser = await bd.query("UPDATE person set name = $1, surname = $2, avatarurl = $3 where id = $4 RETURNING *",
                [name, surname, image, id])
            res.json(updateUser.rows[0])
        } catch (e) {
            console.log(e)
            return res.json(e)
        }
    }
    async deleteUser(req, res){
        try{
            const id = req.params.id;
            const deleteUsers = await bd.query("Delete From person where id = $1", [id])
            res.json(deleteUsers.rows[0])
        }catch (e) {
            return res.json(e)
        }
    }
    async logout(req, res) {
        try {
            const {refreshToken} = req.cookies;
            if (!refreshToken) {
                throw ApiError.UnauthorizedError();
            }
            const userData = tokenService.validateRefreshToken(refreshToken);
            if (!userData) {
                throw ApiError.UnauthorizedError();
            }
            const token = await tokenService.removeToken(userData.id);
            res.clearCookie("refreshToken");
            return res.json(token)
        } catch (e) {   
            return res.json(e)
        }
    }

    async refresh(req, res) {
        try {
            const {refreshToken} = req.cookies;
            console.log(refreshToken)
            if (!refreshToken) {
                throw ApiError.UnauthorizedError();
            }
            const user = tokenService.validateRefreshToken(refreshToken);
            if (!user) {
                throw ApiError.UnauthorizedError();
            }
            const tokens = tokenService.generateTokens({user});
            await tokenService.saveToken(user.id, tokens.refreshToken);
            return res.json({...tokens, user})
        } catch (e) {
            console.log(e)
            return res.json(e)
        }
    }
}

module.exports = new UserController();