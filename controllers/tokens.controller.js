const jwt = require('jsonwebtoken');
const bd = require('../bd')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30d'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async validateRefreshToken(token) {
        try {
            const tokenData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return tokenData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await bd.query("SELECT * FROM person WHERE id = $1", [userId])
        console.log(tokenData)
        if (tokenData.rows[0].refreshtoken != null) {
            const token = await bd.query("UPDATE person SET refreshtoken = $1 WHERE id = $2", [refreshToken, userId])
            return token;
        }
        const token = await bd.query("UPDATE person SET refreshtoken = $1 WHERE id = $2", [refreshToken, userId])
        return token;
    }

    async removeToken(userId) {
        const tokenData = await bd.query("UPDATE person SET refreshtoken = NULL WHERE id = $1", [userId])
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await bd.query("SELECT * FROM person WHERE refreshtoken = $1", [refreshToken])
        return tokenData;
    }
}

module.exports = new TokenService();