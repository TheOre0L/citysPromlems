const ApiError = require('../exceptions/api-error');
const tokenService = require('../controllers/tokens.controller');
const bd = require("../bd");

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
        if (!userData) {
            return next(res.status(400).json({message: "Пользователь не авторизован"}));
        }
        const user = await bd.query("SELECT * FROM person WHERE id = $1", [userData.user.id])
        if(user.rows[0].role != 'ADMIN') return next(res.status(400).json({message: "У вас недостаточно прав"}));
        req.user = userData;
        next();
    } catch (e) {
        return next(res.status(400).json({message: "Пользователь не авторизован"}));
    }
};
