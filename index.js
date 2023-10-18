const express = require("express");
require('dotenv').config()
const PORT = process.env.PORT || 3001
const app = express();
const cors = require('cors');
const multer = require("multer")
const cookieParser = require('cookie-parser')
const userRouter = require("./routers/user.routers")
const postRouter = require("./routers/post.routers")
const commentRouter = require("./routers/comment.router")
const authMiddleware = require("./middlewares/auth.middelewares");
const isActive = require('./middlewares/isActive.middlewares')

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/uploads', express.static('uploads'));

app.use("/api", userRouter)
app.use("/post", postRouter)
app.use("/comment", commentRouter)

const storage = multer.diskStorage({
    destination: (_, __, cd) => {
        cd(null, "uploads");
    },
    filename: (_, file, cd) => {
        cd(null, file.originalname)
    }
})
const upload = multer({storage})
app.post("/upload", authMiddleware, isActive, upload.single("image"), (req,res) => {
    res.status(200).json({
        url: `/uploads/${req.file.originalname}`
    })
})
const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()