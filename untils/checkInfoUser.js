const { HTTP_STATUS } = require("../Constants");
const userRepository = require("../repositories/userRepository");

module.exports.checkInfoUser = async function ({ res, password, email }) {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
        return res.status(HTTP_STATUS.CREATED).json({
            success: false,
            message: "user is not exits!"
        })
    }
    const isPassword = userRepository.checkPassword(password, user.password);
    if (!isPassword) {
        return res.status(HTTP_STATUS.STATUS_OK).json({
            success: false,
            message: "password is not match"
        })
    }
    return user;
}