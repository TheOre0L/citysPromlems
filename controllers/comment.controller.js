const bd = require('../bd');
const humanize = require("humanize-duration");
const uuid = require("uuid");
class CommentController{
    async addComment(req,res) {
        try {
            const {
                idpost,
                author_com_id,
                text
            } = req.body;
            console.log(idpost, author_com_id, text)
            const addedComment = await bd.query("INSERT INTO comment(idpost, author_com_id, text, createdat) VALUES ($1, $2, $3, $4)" +
                "RETURNING *",
                [
                    idpost,
                    author_com_id,
                    text,
                    new Date()
                ]
            );
            return res.status(200).json(addedComment.rows[0])
        } catch (error) {
            console.log(error)
            res.status(400).json({message: "Произошла непредвиденная ошибка!"})
        }
    }
    async deleteComment(req,res) {
        try {
            const deleteComment = await bd.query("DELETE FROM comment WHERE idcomment = $1", [req.params.id])
            return res.status(200).json({message: "Комментарий удален!"})
        } catch (error) {
            console.log(error)
            res.status(400).json({message: "Произошла непредвиденная ошибка!"})
        }
    }
    async editComment(req,res) {
        try {

        } catch (error) {
            console.log(error)
            res.status(400).json({message: "Произошла непредвиденная ошибка!"})
        }
    }
    async getComment(req,res) {
        try {
            const {
                idpost
            } = req.body;
            const commentsPost = await bd.query("SELECT comment.*, person.name, person.surname, person.id, person.avatarurl " +
                "FROM comment, person WHERE comment.idpost = $1 AND comment.author_com_id = person.id",
                [
                    idpost
                ]
            );
            return res.status(200).json(commentsPost.rows)
        } catch (error) {
            console.log(error)
            res.status(400).json({message: "Произошла непредвиденная ошибка!"})
        }
    }
}

module.exports = new CommentController();