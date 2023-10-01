const express = require("express");
require('dotenv').config()
const PORT = process.env.PORT || 3001
const app = express();
const userRouter = require("./routers/user.routers")

app.use("/api", userRouter)

const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()