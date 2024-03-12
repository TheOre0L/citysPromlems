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
            if(type == '' || type == null || type == undefined) return res.status(400).json({message: "Укажите тип жалобы!"});
            if(text == '' || text == null || text == undefined) return res.status(400).json({message: "Укажите текст жалобы!"});
            const FindPostThisUser = await bd.query("SELECT date_create_last_complaints FROM person WHERE id = $1", [id_author]);
            if (FindPostThisUser.rows[0]  || !FindPostThisUser.rows[0].date_create_last_complaints) {
                if (FindPostThisUser.rows[0].date_create_last_complaints !== null && 1800000 - (Date.now() - FindPostThisUser.rows[0].date_create_last_complaints) > 0) {
                    return res.status(400).json({
                        message: `Вы уже жаловались на пост! Следующая жалоба будет доступна через ${humanize(1800000 - (Date.now() - FindPostThisUser.rows[0].date_create_last_complaints), {language: 'ru'})}`
                    });
                }
            }
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
        const updateCreateDate = await bd.query("UPDATE person SET date_create_last_complaints = $1 WHERE id = $2", [Date.now(), id_author]);
        //date_create_last_complaints

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