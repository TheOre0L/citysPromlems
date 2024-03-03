const bd = require('../bd');
const humanize = require("humanize-duration");
const uuid = require("uuid");
class adminController{
    async adminAdd(req, res) {
        try{
            const {uid} = req.body;
            console.log(req.body)
            const updateUser = await bd.query("UPDATE person set role = 'ADMIN' where id = $1 RETURNING *", [uid]);
            const user = updateUser.rows[0];
            res.status(200).json({message:`Пользователь #${uid} успешно назначен администратором!`, user: user})
        } catch (e) {
            console.log(e)
            return res.json(e)
        }
    }
    async adminDelete(req, res) {
        try{
            const {uid} = req.body;
            const updateUser = await bd.query("UPDATE person set role = 'USER' where id = $1 RETURNING *", [uid]);
            const user = updateUser.rows[0];
            res.status(200).json({message:`Пользователь #${uid} успешно разжалован!`, user: user})
        } catch (e) {
            console.log(e)
            return res.json(e)
        }
    }
    async userBan(req, res) {
        try{
            const {uid} = req.body;
            console.log(req.body)
            const updateUser = await bd.query("UPDATE person set ban = true where id = $1 RETURNING *", [uid]);
            const user = updateUser.rows[0];
            res.status(200).json({message:`Пользователь #${uid} успешно забанен!`, user: user})
        } catch (e) {
            console.log(e)
            return res.json(e)
        }
    }
    async userUnban(req, res) {
        try{
            const {uid} = req.body;
            const updateUser = await bd.query("UPDATE person set ban = false where id = $1 RETURNING *", [uid]);
            const user = updateUser.rows[0];
            res.status(200).json({message:`Пользователь #${uid} успешно разбанен!`, user: user})
        } catch (e) {
            console.log(e)
            return res.json(e)
        }
    }
}

module.exports = new adminController();