const bd = require('../bd');
const humanize = require("humanize-duration");
const uuid = require("uuid");
class complaintController{
    async addComplaint(req,res) {
        try {
            const {
                id_post,
                id_author,
                type,
                text
            } = req.body;
            const addedComplaint = await bd.query("INSERT INTO complaints(idpost, id_author, text, type, createdat) VALUES ($1, $2, $3, $4, $5)" +
            "RETURNING *",
            [
                id_post,
                id_author,
                text,
                type,
                new Date()
            ]
        );
        return res.status(200).json({message: "Жалоба успешно отправлена!"});
        } catch (error) {
            console.log(error)
            res.status(400).json({message: "Произошла непредвиденная ошибка!"})
        }
    }
    async getComplaint(req,res) {
        try {
            const ComplaintsPost = await bd.query(`SELECT * FROM complaints WHERE complaints.idpost = $1`, [req.params.id]);
            return res.status(200).json(ComplaintsPost.rows)
        } catch (error) {
            console.log(error)
            res.status(400).json({message: "Произошла непредвиденная ошибка!"})
        }
    }
}

module.exports = new complaintController();