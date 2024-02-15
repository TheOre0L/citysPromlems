const ApiError = require('../exceptions/api-error');
const tokenService = require('../controllers/tokens.controller');

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(res.status(401).json({message: "Пользователь не авторизован"}));
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(res.status(401).json({message: "Пользователь не авторизован"}));
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(res.status(401).json({message: "Пользователь не авторизован"}));
        }
        req.user = userData.user;
        next();
    } catch (e) {
        return next(res.status(401).json({message: "Пользователь не авторизован"}));
    }
};
