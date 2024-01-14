const bd = require('../bd');
const humanize = require("humanize-duration");
const fileUpload = require("express-fileupload");
const uuid = require("uuid");
class PostController {
    async addPost(req, res) {
        try {
            let {
                title,
                context,
                author_id,
                city_post,
                image_url,
            } = req.body;
            if (title.length == 0) title = null;
            if (context.length == 0) context = null;
            if (image_url.length == 0) image_url = null;
            if (author_id.length == 0) author_id = null;
            const FindPostThisUser = await bd.query("SELECT date_for_create FROM post WHERE author_id = $1", [author_id]);
            if (FindPostThisUser.rowCount != 0) {
                if (FindPostThisUser.rows[0].date_for_create !== null && 10800000 - (Date.now() - FindPostThisUser.rows[0].date_for_create) > 0) {
                    return res.status(400).json({
                        message: `Вы уже публиковали пост! Следующий можно будет опубликовать через ${humanize(10800000 - (Date.now() - FindPostThisUser.rows[0].date_for_create), {language: 'ru'})}`
                    });
                }
            }
            const NewPost = await bd.query("INSERT INTO post (title, context, date_for_create, author_id, city_post, image, likes, createdat) VALUES" +
                "($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [title, context, Date.now(), author_id, city_post, image_url, [], new Date()]);
            const post = NewPost.rows[0]
            return res.status(200).json({message: "Пост успешно создан!", post: post});
        } catch (error) {
            //console.log(error);
            if (error.column == 'title') {
                return res.status(400).json({message: "Укажите заголовок!"})
            }
            if (error.column == 'context') {
                return res.status(400).json({message: "Укажите описание!"})
            }
            if (error.column == 'image_url') {
                return res.status(400).json({message: "Загрузите картинку!"})
            }
            if (error.column == 'city_post') {
                return res.status(400).json({message: "Укажите город!"})
            } else {
                console.log(error)
                return res.status(400).json({message: "Непредвиденная ошибка!"})
            }
            return res.status(400).json({message: error})
        }
    }

    async updatePost(req, res) {
        try {
            let {
                title,
                context,
                city,
                imageUrl,
            } = req.body;
            if (title.length == 0) title = null;
            if (context.length == 0) context = null;
            if (imageUrl.length == 0) imageUrl = null;
            const UpdatePost = await bd.query("UPDATE post SET title = $1, context = $2, image = $3, city_post = $4 WHERE idPost = $5 RETURNING *", [
                title,
                context,
                imageUrl,
                city,
                req.params.id
            ]);
            return res.status(200).json({post: UpdatePost.rows[0]})
        } catch (error) {
            console.log(error);
            if (error.column == 'title') {
                return res.status(400).json({message: "Укажите заголовок!"})
            }
            if (error.column == 'context') {
                return res.status(400).json({message: "Укажите описание!"})
            }
            if (error.column == 'image') {
                return res.status(400).json({message: "Загрузите картинку!"})
            }
            if (error.column == 'city_post') {
                return res.status(400).json({message: "Укажите город!"})
            } else {
                console.log(error)
                return res.status(400).json({message: "Непредвиденная ошибка!"})
            }
            return res.status(400).json({message: "Непредвиденная ошибка!"})
        }
    }

    async deletePost(req, res) {
        try {
            const DeletePost = await bd.query("DELETE FROM post WHERE idPost = $1", [req.params.id])
            res.status(200).json(DeletePost)
        } catch (error) {
            console.log(error);
            return res.status(400).json({message: "Непредвиденная ошибка!"})
        }
    }

    async findPost(req, res) {
        try {
            const Post = await bd.query("SELECT post.*, COUNT(comment.*), person.* FROM post JOIN person ON post.author_id = person.id" +
                " LEFT JOIN comment ON comment.idpost = post.idpost WHERE post.idpost = $1 GROUP BY post.idpost, person.id;", [req.params.id]);
            const query = await bd.query("UPDATE post SET viewcount = viewcount + 1 WHERE idPost = $1", [req.params.id])
            if (Post.rows[0].likes) {
                for (let i = 0; i < Post.rows[0].likes.length; i++) {
                    if (Post.rows[0].likes[i].user == req.body.userId) return res.status(200).json({
                        post: Post.rows[0],
                        isLiked: true
                    });
                }
            }
            return res.status(200).json({post: Post.rows[0], isLiked: false});
        } catch (error) {
            console.log(error);
            return res.status(400).json({result: "Непредвиденная ошибка!"})
        }
    }

    async getToUpbatePost(req, res) {
        try {
            const Post = await bd.query("SELECT * FROM post WHERE idpost = $1", [req.params.id]);
            const Author = await bd.query("SELECT * FROM person WHERE id = $1", [Post.rows[0].author_id])
            return res.status(200).json({post: Post.rows[0], author: Author.rows[0]});
        } catch (error) {
            console.log(error);
            return res.status(400).json({result: "Непредвиденная ошибка!"})
        }
    }

    async getPosts(req, res) {
        try {
            const Post = await bd.query("SELECT post.*, person.*, COUNT(comment.*) AS commentcount FROM post JOIN person ON post.author_id = person.id LEFT JOIN comment ON comment.idpost = post.idpost GROUP BY post.idpost, person.id;");

            return res.status(200).json(Post.rows);
        } catch (error) {
            console.log(error);
            return res.status(400).json({message: "Непредвиденная ошибка!"})
        }
    }

    async LikePost(req, res) {
        try {
            const Post = await bd.query("SELECT * FROM post WHERE idPost = $1", [req.params.id]);
            console.log(Post.rows[0].likes)
            if (Post.rows[0].likes) {
                for (let i = 0; i < Post.rows[0].likes.length; i++) {
                    if (Post.rows[0].likes[i].user == req.body.id) {
                        const UpdatePost = await bd.query("UPDATE post SET likes = array_remove(likes, $1) WHERE idPost = $2 RETURNING *", [
                            {"user": req.body.id},
                            req.params.id
                        ]);
                        return res.status(200).json({isLiked: false, likeCount: UpdatePost.rows[0].likes.length})
                    }
                }
            }
            const UpdatePost = await bd.query("UPDATE post SET likes = array_append(likes, $1) WHERE idPost = $2 RETURNING *", [
                {user: req.body.id},
                req.params.id
            ]);
            return res.status(200).json({isLiked: true, likeCount: UpdatePost.rows[0].likes.length})
        } catch (error) {
            console.log(error);
            return res.status(400).json({message: "Непредвиденная ошибка!"})
        }
    }
    async findCity(req, res){
        try {
            const Post = await bd.query("SELECT post.*, person.*, COUNT(comment.*) AS commentcount FROM post JOIN person" +
                " ON post.author_id = person.id LEFT JOIN comment ON comment.idpost = post.idpost WHERE city_post = $1 GROUP BY post.idpost, person.id;", [req.params.id]);
            return res.status(200).json(Post.rows);
        } catch (e) {
            console.log(e);
            return res.status(400).json({message: "Непредвиденная ошибка!"})
        }
    }
}

module.exports = new PostController();