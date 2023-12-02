const Router = require("express")
const router = new Router()
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const commentController = require("../controllers/comment.controller")
const jsonParser = bodyParser.json()
const authMiddleware = require('../middlewares/auth.middelewares');
const isActive = require('../middlewares/isActive.middlewares')
const adminCheck = require('../middlewares/adminCheck.middlewares')

router.post("/add", urlencodedParser, jsonParser, authMiddleware, commentController.addComment)
router.delete("/delete/:id", urlencodedParser, jsonParser, authMiddleware, commentController.deleteComment)
router.put("/edit/:id", urlencodedParser, jsonParser, authMiddleware, commentController.editComment)
router.post("/all", urlencodedParser, jsonParser, commentController.getComment)

module.exports = router;