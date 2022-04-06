const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const { ROLE } = require("../Constants");

dotenv.config();

module.exports.checkAuthenticator = async (req, res, next) => {
    if (!req.headers.authorization || (req.headers.authorization && !req.headers.authorization.split(' ')[0] === 'Bearer')) {
        return res.status(403).json({ message: 'Token is not exit in headers' });
    }
    const token = req.headers.authorization.split(' ')[1] || null;
    try {
        const user = await jwt.verify(token, process.env.CREATE_TOKEN);
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access.',
        });
    }
}

module.exports.checkRole = function (req, res, next) {
    if (req && req.user) {
        if (req.user.role === ROLE.ADMIN) {
            next();
        }
        return res.status(403).json({
            success: false,
            message: 'Unauthorized access.',
        });
    }
}