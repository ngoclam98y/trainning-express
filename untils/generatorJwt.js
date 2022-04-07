const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const { TOKEN_LIFE } = require("../Constants");
dotenv.config();

module.exports.generatorJwt = function (user) {
    const token = jwt.sign(user, process.env.CREATE_TOKEN, { expiresIn: TOKEN_LIFE.TOKEN });
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN, { expiresIn: TOKEN_LIFE.REFRESH_TOKEN });
    return { token, refreshToken }
}