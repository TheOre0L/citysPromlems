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
            console.log(login.length >= 3 && login.length <= 255);
            if(login.length == 0) login = null;
            if(password.length == 0) password = null;
            if(name.length == 0) name = null;
            if(surname.length == 0) surname = null;
            if(city.length == 0) city = null;
            if(!validateEmail(email)) return res.status(400).json({message: "Указанное значение не является электронной почтой!"});
            const hashPassword = await bcrypt.hash(password, 3);
            const candidate = await bd.query("INSERT INTO person (login, password, name, surname, date_for_regist, email, city) " +
             "VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [login, hashPassword, name, surname, new Date(), email, city]);
            const tokens = await tokenService.generateTokens({id: candidate.rows[0].id, email: candidate.rows[0].email, role: candidate.rows[0].role});
            const user = candidate.rows[0];
            await tokenService.saveToken(user.id, tokens.refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json({message:"Успешная регистрация!", ...tokens, user})
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
            const userDto = await bd.query("SELECT * FROM person WHERE login = $1", [login])
            const user = userDto.rows[0];
            if (!user) {
                return res.status(400).json({message:"Неверный логин или пароль"})
            }
            const isPassEquals = await bcrypt.compare(password, user.password);
            if (!isPassEquals) {
                return res.status(400).json({message:"Неверный логин или пароль"})
            }
            const tokens = tokenService.generateTokens({...user});
            await tokenService.saveToken(user.id, tokens.refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.status(200).json({message:"Успешный вход в аккаунт!", tokens, user})
        } catch (e) {
            return res.json(e)
        }
    }
    
    async getActivationLink (req, res) {
        const {
            email,
            login
        } = req.body;
        const userDto = await bd.query("SELECT * FROM person WHERE login = $1 AND email = $2", [login, email])
        const user = userDto.rows[0];
        if (!user) {
            return res.status(400).json({message:"Возникла какая-то ошибка, пожалуйста повторите попытку позже!"})
        } else {
            function generateRandomSixDigitNumber() {
                return Math.floor(100000 + Math.random() * 900000);
            }
            const activateLink = generateRandomSixDigitNumber()
            await mailService.sendActivationMail(email, `${activateLink}`, login);
            await bd.query("UPDATE person set active_link = $1 where login = $2 AND email = $3", 
            [activateLink, login, email])
            return res.json({message:"Код активации успешно отправлен!"})
        }

    }

    async activation (req, res){
        try {
            const {
                code,
                login
            } = req.body;
            const user = await bd.query("SELECT * FROM person WHERE active_link = $1 AND login = $2", [code, login])
            if (user.rowCount == 0) {
                return res.status(404).json({message:"Неверный код активации"})
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
            const userDto = await bd.query("SELECT p.id, p.name, p.surname, p.city, p.is_activated, p.avatarurl, p.role, p.ban, COUNT(DISTINCT post.idpost) AS total_posts, (SELECT COUNT(*) FROM comment WHERE comment.author_com_id = p.id) AS total_comments FROM person p LEFT JOIN post ON p.id = post.author_id WHERE p.id = $1 GROUP BY p.id, p.name, p.surname, p.city, p.is_activated, p.avatarurl, p.role;", [id])
            const user = userDto.rows[0];
            if(user){
                return res.json({message:"Пользователь найден!", user})
            } else {
                return res.status(404).json({message:"Пользователь не найден!"})
            }

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
            const userData = await tokenService.validateRefreshToken(refreshToken);
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
            if (!refreshToken) {
                throw ApiError.UnauthorizedError();
            }
            const user = await tokenService.validateRefreshToken(refreshToken);
            const userData = await bd.query("SELECT * FROM person WHERE id = $1", [user.id])
            const resultUser =  userData.rows[0];
            if (!resultUser) {
                throw ApiError.UnauthorizedError();
            }
            const tokens = tokenService.generateTokens({user});
            await tokenService.saveToken(resultUser.id, tokens.refreshToken);
            return res.json({...tokens, user: resultUser})
        } catch (e) {
            console.log(e)
            return res.json(e)
        }
    }

}

module.exports = new UserController();