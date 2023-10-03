const bd = require('../bd')
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const ApiError = require('../exceptions/api-error');
const tokenService = require('./tokens.controller');
const mailService = require("./mail.controller")

class UserController {
    async registration (req, res){
        const {	
            login,
            password,
            name,
            surname,
            email,
            city} = req.body;
        const oneUser = await bd.query("Select * From person where login = $1", [login])
        if(oneUser.rowCount != 0){
            return res.json("Такой логин уже занят, выберите другой логин!")
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const candidate = await bd.query("INSERT INTO person (login, password, name, surname, date_for_regist, email, active_link, city) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [login, hashPassword, name, surname, new Date(), email, activationLink, city])
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`, login);
        const tokens = await tokenService.generateTokens({id: candidate.rows[0].id, email: candidate.rows[0].email});
        const userDto = candidate.rows[0];
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json({error: "Ok", status: 200, text:"Успешная регистрация!", ...tokens, userDto})
    }
    async login (req, res){
        const {	
            login,
            password} = req.body;
        const user = await bd.query("SELECT * FROM person WHERE login = $1", [login])
        const userDto = user.rows[0];
        if (user.rowCount == 0) {
            return res.json({error: "Ok", status: 200, text:"Неверный логин или пароль"})
        }
        const isPassEquals = await bcrypt.compare(password, userDto.password);
        if (!isPassEquals) {
            return res.json({error: "Ok", status: 200, text:"Неверный логин или пароль"})
        }
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        console.log(tokens)
        return res.json({error: "Ok", status: 200, text:"Успешный вход в аккаунт!", ...tokens, userDto})
    }
    async activation (req, res){
        const user = await bd.query("SELECT * FROM person WHERE active_link = $1", [req.params.activation_link])
        if (user.rowCount == 0) {
            return res.json({error: "Bad Request", status: 400, text:"Некорректная ссылка активации"})
        }
        await bd.query("UPDATE person set is_activated = $1 where id = $2 RETURNING *",
        [true, user.rows[0].id])
        return res.json({error: "Ok", status: 200, text:"Успешная активация аккаунта!"})
    }
    async getUsers (req, res){
        const allUsers = await bd.query("Select * From person")
        res.json(allUsers.rows)
    }
    async getOneUser(req, res){
        const id = req.params.id;
        const oneUser = await bd.query("Select * From person where id = $1", [id])
        res.json(oneUser.rows[0])
    }
    async updateUser(req, res){
        const {
            id,
            login,
            password,
            name,
            surname} = req.body;
        const updateUser = await bd.query("UPDATE person set login = $1, password = $2, name = $3, surname = $4 where id = $5 RETURNING *",
        [login, password, name, surname, id])
        res.json(updateUser.rows[0])
    }
    async deleteUser(req, res){
        const id = req.params.id;
        const deleteUsers = await bd.query("Delete From person where id = $1", [id])
        res.json(deleteUsers.rows[0])
    }
}

module.exports = new UserController();