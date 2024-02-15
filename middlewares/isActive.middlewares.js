const ApiError = require('../exceptions/api-error');
const tokenService = require('../controllers/tokens.controller');
const bd = require('../bd')

module.exports = async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(res.status(400).json({message: "Пользователь не авторизован"}));
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(res.status(400).json({message: "Пользователь не авторизован"}));
        }

        const userData = tokenService.validateAccessToken(accessToken);
        //console.log(userData)
        if (!userData) {
            return next(res.status(400).json({message: "Пользователь не авторизован"}));
        }
        const user = await bd.query("SELECT * FROM person WHERE id = $1", [userData.user.id])
        if(user.rows[0].is_activated == false) return next(res.status(400).json({message: "Ваш аккаунт не активирован, проверьте свою эл.почту :)"}));
        req.user = userData;
        next();
    } catch (e) {
        return next(res.status(400).json({message: "Пользователь не авторизован"}));
    }
};
