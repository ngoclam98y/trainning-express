const dotenv = require("dotenv");

dotenv.config();

module.exports.HTTP_STATUS = {
    STATUS_OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
}
module.exports.ROLE = {
    MEMBER: 1,
    ADMIN: 0
}

module.exports.TOKEN_LIFE = {
    TOKEN: 60 * 60 * 7,
    REFRESH_TOKEN: 60 * 60 * 30
}


module.exports.customMail = function ({ to, subject, text }) {
    return {
        to,
        from: process.env.FROM_EMAIL,
        subject,
        text
    }
}