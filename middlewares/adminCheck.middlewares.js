const ApiError = require('../exceptions/api-error');
const tokenService = require('../controllers/tokens.controller');
const bd = require("../bd");

module.exports = async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }
        const user = await bd.query("SELECT * FROM person WHERE id = $1", [userData.user.id])
        if(user.rows[0].role != 'ADMIN') return next(ApiError.UnPermissionError());
        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};
