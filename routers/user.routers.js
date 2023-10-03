const Router = require("express")
const router = new Router()
const userController = require('../controllers/user.controller')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json()
const authMiddleware = require('../middlewares/auth.middelewares');

router.post('/registration',
    urlencodedParser,
    jsonParser,
    userController.registration);
router.post('/login', urlencodedParser ,jsonParser, userController.login)
router.get('/users', authMiddleware,userController.getUsers)
router.get('/activate/:activation_link', userController.activation)
router.get('/user/:id', userController.getOneUser)
router.put('/user', urlencodedParser ,jsonParser, userController.updateUser)
router.delete('/user/:id', urlencodedParser ,jsonParser, userController.deleteUser)

module.exports = router;