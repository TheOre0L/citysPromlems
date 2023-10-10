const bd = require('../bd');
const humanize = require("humanize-duration");
const fileUpload = require("express-fileupload");
const uuid = require("uuid");
class PostController {
    async addPost(req, res) {
        try{
            let {
                title,
                context,
                author_id,
                city_post,
                image_url,
                tags
            } = req.body;
            if(title.length == 0) title = null;
            if(context.length == 0) context = null;
            if(image_url.length == 0) image_url = null;
            if(author_id.length == 0) author_id = null;
            if(tags.length == 0) tags = null;
            const FindPostThisUser = await bd.query("SELECT date_for_create FROM post WHERE author_id = $1", [author_id]);
            if(FindPostThisUser.rowCount != 0){
                if(FindPostThisUser.rows[0].date_for_create !== null && 10800000 - (Date.now() - FindPostThisUser.rows[0].date_for_create) > 0){
                    return res.status(400).json({
                        message: `Вы уже публиковали пост! Следующий можно будет опубликовать через ${humanize(10800000 - (Date.now() - FindPostThisUser.rows[0].date_for_create), { language: 'ru' })}`
                    });
                }
            }
            console.log(tags.split(","))
            const NewPost = await bd.query("INSERT INTO post (title, context, date_for_create, author_id, city_post, image, tags, likes, comments, createdat) VALUES" +
                "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *", [title, context, Date.now(), author_id, city_post, image_url, tags.split(","), [], [], new Date()]);
            const post = NewPost.rows[0]
            return res.status(200).json({message: "Пост успешно создан!", post: post});
        }
        catch (error) {
            //console.log(error);
            if(error.column == 'title'){
                return res.status(400).json({message: "Укажите заголовок!"})
            }
            if(error.column == 'context'){
                return res.status(400).json({message: "Укажите описание!"})
            }
            if(error.column == 'image_url'){
                return res.status(400).json({message: "Загрузите картинку!"})
            }
            if(error.column == 'city_post'){
                return res.status(400).json({message: "Укажите город!"})
            } else {
                console.log(error)
                return res.status(400).json({message: "Непредвиденная ошибка!"})
            }
            return res.status(400).json({message: error})
        }
    }
    async updatePost(req,res) {
        try{
            let {
                title,
                context,
                city,
                imageUrl,
                tags
            } = req.body;
            if(title.length == 0) title = null;
            if(context.length == 0) context = null;
            if(imageUrl.length == 0) imageUrl = null;
            if(tags.length == 0) tags = null;
            const UpdatePost = await bd.query("UPDATE post SET title = $1, context = $2, image = $3, city_post = $4, tags = $5 WHERE id = $6 RETURNING *", [
                    title,
                    context,
                    imageUrl,
                    city,
                    tags.split(","),
                    req.params.id
                ]);
            return res.status(200).json({post: UpdatePost.rows[0]})
        }
        catch (error) {
            console.log(error);
            if(error.column == 'title'){
                return res.status(400).json({message: "Укажите заголовок!"})
            }
            if(error.column == 'context'){
                return res.status(400).json({message: "Укажите описание!"})
            }
            if(error.column == 'image'){
                return res.status(400).json({message: "Загрузите картинку!"})
            }
            if(error.column == 'city_post'){
                return res.status(400).json({message: "Укажите город!"})
            } else {
                console.log(error)
                return res.status(400).json({message: "Непредвиденная ошибка!"})
            }
            return res.status(400).json({message: "Непредвиденная ошибка!"})
        }
    }
    async deletePost(req,res) {
        try{
            const DeletePost = await bd.query("DELETE FROM post WHERE id = $1", [req.params.id])
            res.status(200).json(DeletePost)
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({message: "Непредвиденная ошибка!"})
        }
    }
    async findPost(req,res){
        try{
            const Post = await bd.query("SELECT * FROM post WHERE id = $1", [req.params.id]);
            const query = await bd.query("UPDATE post SET viewcount = viewcount + 1 WHERE id = $1", [req.params.id])
            const Author = await bd.query("SELECT * FROM person WHERE id = $1", [Post.rows[0].author_id])
            if(Post.rows[0].likes){
                for(let i = 0; i < Post.rows[0].likes.length; i++){
                    if(Post.rows[0].likes[i].user == req.body.userId) return res.status(200).json({post: Post.rows[0], author: Author.rows[0], isLiked: true});
                }
            }
            return res.status(200).json({post: Post.rows[0], author: Author.rows[0], isLiked:false});
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({result: "Непредвиденная ошибка!"})
        }
    }
    async getPosts(req,res){
        try{
            const Post = await bd.query("SELECT * FROM post");
            return res.status(200).json(Post.rows);
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({message: "Непредвиденная ошибка!"})
        }
    }
    async LikePost(req, res){
        try{
            const Post = await bd.query("SELECT * FROM post WHERE id = $1", [req.params.id]);
            console.log(Post.rows[0].likes)
            if(Post.rows[0].likes){
                for(let i = 0; i < Post.rows[0].likes.length; i++){
                    if(Post.rows[0].likes[i].user == req.body.id){
                        const UpdatePost = await bd.query("UPDATE post SET likes = array_remove(likes, $1) WHERE id = $2 RETURNING *", [
                            {"user": req.body.id},
                            req.params.id
                        ]);
                        return res.status(200).json({isLiked: false, likeCount: UpdatePost.rows[0].likes.length})
                    }
                }
            }
            const UpdatePost = await bd.query("UPDATE post SET likes = array_append(likes, $1) WHERE id = $2 RETURNING *", [
                {user: req.body.id},
                req.params.id
            ]);
            return res.status(200).json({isLiked: true, likeCount: UpdatePost.rows[0].likes.length})
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({message: "Непредвиденная ошибка!"})
        }
    }

    async addComment(req,res) {
        try{
            const Post = await bd.query("SELECT * FROM post WHERE id = $1", [req.params.id]);
            const UpdatePost = await bd.query("UPDATE post SET comments = array_append(comments, $1) WHERE id = $2 RETURNING *", [
                {
                    id_comment: uuid.v4(),
                    user: {
                        id: req.body.id,
                        fullName: `${req.body.name} ${req.body.surname}`,
                        avatarUrl: `${req.body.avatarUrl}`
                    },
                    createdAt: new Date(),
                    text: `${req.body.commentText}`
                },
                req.params.id
            ]);
        } catch (error) {
            console.log(error);
            return res.status(400).json({message: "Непредвиденная ошибка!"})
        }
    }
}

module.exports = new PostController();