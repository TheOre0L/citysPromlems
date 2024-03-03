const Router = require("express")
const router = new Router()
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const complaintController = require("../controllers/complaint.controller")
const jsonParser = bodyParser.json()
const authMiddleware = require('../middlewares/auth.middelewares');
const isActive = require('../middlewares/isActive.middlewares')
const adminCheck = require('../middlewares/adminCheck.middlewares')

router.post("/add", urlencodedParser, jsonParser, authMiddleware, isActive, complaintController.addComplaint)
router.get("/:id", jsonParser, complaintController.getComplaint)

module.exports = router;    