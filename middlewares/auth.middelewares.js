const tokenService = require('../controllers/tokens.controller');
module.exports = function (req, res, next) {
    try {
        console.log(req.headers)
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(res.json("Не авторизован!"));
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(res.json("Не авторизован!"));
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(res.json("Не авторизован!"));
        }
        req.user = userData;
        next();
    } catch (e) {
        return next(res.json("Не авторизован!"));
    }
};
