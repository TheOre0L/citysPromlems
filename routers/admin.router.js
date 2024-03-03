const Router = require("express")
const router = new Router()
const adminController = require('../controllers/admin.controller')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json()
const authMiddleware = require('../middlewares/auth.middelewares');
const adminCheck = require('../middlewares/adminCheck.middlewares');

router.put('/add', urlencodedParser, jsonParser, authMiddleware, adminCheck, adminController.adminAdd)
router.put('/delete', urlencodedParser, jsonParser, authMiddleware, adminCheck, adminController.adminDelete)

router.put('/ban', urlencodedParser, jsonParser, authMiddleware, adminCheck, adminController.userBan)
router.put('/unban', urlencodedParser, jsonParser, authMiddleware, adminCheck, adminController.userUnban)


module.exports = router;