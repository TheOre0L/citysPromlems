const Router = require("express")
const router = new Router()
const userController = require('../controllers/user.controller')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const jsonParser = bodyParser.json()
const authMiddleware = require('../middlewares/auth.middelewares');
const adminCheck = require('../middlewares/adminCheck.middlewares');
router.post('/registration',
    urlencodedParser,
    jsonParser,
    userController.registration);
router.post('/login', urlencodedParser ,jsonParser, userController.login)
router.get('/users', authMiddleware,userController.getUsers)
router.post('/activate', urlencodedParser, jsonParser, authMiddleware, userController.activation)
router.post('/activate/get', urlencodedParser, jsonParser, authMiddleware, userController.getActivationLink)
router.get('/user/:id', userController.getOneUser)
router.get('/refresh', userController.refresh)
router.get('/logout', userController.logout)
router.put('/update', urlencodedParser ,jsonParser, userController.updateUser)
router.delete('/user/:id', urlencodedParser ,jsonParser, userController.deleteUser)

module.exports = router;