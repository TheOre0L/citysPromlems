const express = require("express");
require('dotenv').config()
const PORT = process.env.PORT || 3001
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser')
const userRouter = require("./routers/user.routers")

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use("/api", userRouter)

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()