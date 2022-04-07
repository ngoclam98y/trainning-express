const dotenv = require("dotenv");
const { HTTP_STATUS } = require('../Constants');
const userRepository = require('../repositories/userRepository');
const { checkInfoUser } = require("../untils/checkInfoUser");
const { generatorJwt } = require("../untils/generatorJwt");
const { sendMail } = require("../config/mail");
dotenv.config();

const tokenList = {};

class userController {
    constructor() { }

    goToDashboard(req, res) {
        return res.send(`<h1>Welcome to dashboard</h1>`);
    }

    loginFaild(req, res) {
        return res.send(`<h1>Login faild</h1>`);
    }

    async findAllUser(req, res) {
        try {
            const users = await userRepository.allUsers();
            return res.status(HTTP_STATUS.STATUS_OK).json({
                success: true,
                users
            })
        } catch (error) {
            return res.status(HTTP_STATUS.STATUS_OK).json({
                success: false,
                error
            })
        }
    }

    async updateUser(req, res) {
        try {
            const { user } = req.body;
            await userRepository.updateUser(user);
            return res.status(HTTP_STATUS.STATUS_OK).json({
                success: true,
                message: 'update user is success'
            })
        } catch (error) {
            return res.status(HTTP_STATUS.STATUS_OK).json({
                success: false,
                error
            })
        }
    }


    async deleteUserById(req, res) {
        try {
            const { id } = req.params;
            await userRepository.deleteUser(id);
            return res.status(HTTP_STATUS.STATUS_OK).json({
                success: true,
                message: 'delete user is success'
            })
        } catch (error) {
            return res.status(HTTP_STATUS.STATUS_OK).json({
                success: false,
                error
            })
        }
    }

    async createUser(req, res) {
        try {
            const { password, email } = req.body;
            const passwordHash = userRepository.hashPassword(password);
            const isSuccess = await userRepository.saveUser({ email, password: passwordHash });
            if (!isSuccess) {
                return res.status(HTTP_STATUS.CREATED).json({
                    success: false,
                    message: 'create new user faild!'
                })
            }
            return res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: 'create new user success!'
            })
        } catch (error) {
            return res.status(HTTP_STATUS.STATUS_OK).json({
                success: false,
                user: error
            })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await checkInfoUser({ res, password, email });

            const filterUser = {
                email: user.email,
                _id: user._id,
                role: user.role,
                inActive: user.inActive
            }

            const { token, refreshToken } = generatorJwt(filterUser);

            tokenList[refreshToken] = filterUser;

            return res.status(HTTP_STATUS.STATUS_OK).json({
                success: true,
                user: filterUser,
                token, refreshToken
            })
        } catch (error) {
            return res.status(HTTP_STATUS.STATUS_OK).json({
                success: false,
                user: error
            })
        }
    }


    async changePassword(req, res) {
        try {
            const { passwordOld, passwordNew } = req.body;
            const { email } = req.user;
            checkInfoUser({ res, password: passwordOld, email });
            const isDone = await userRepository.changePassword(email, userRepository.hashPassword(passwordNew));
            return res.status(HTTP_STATUS.STATUS_OK).json({
                success: isDone,
                message: "update password succcess"
            })
        } catch (error) {
            return res.status(HTTP_STATUS.STATUS_OK).json({
                success: false,
                user: error
            })
        }
    }

    async requestResetPassword(req, res) {
        const { email } = req.body;
        try {
            const user = await userRepository.requestResetPassword(email);
            if (!user) {
                return res.status(HTTP_STATUS.CREATED).json({
                    success: false,
                    message: "user is not exits!"
                })
            }

            let link = "http://" + req.headers.host + "/reset-password/" + user.resetPasswordToken;

            const mailOptions = {
                to: email,
                subject: "Password change request",
                html: ` <p>Hi <b>${email}</b> </p> 
                        <p>Please click on the following <a href=${link}>link</a> to reset your password</p>
                        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                `,
            }

            try {
                await sendMail({ ...mailOptions });
                return res.status(HTTP_STATUS.STATUS_OK).json({
                    success: true,
                    message: 'A reset email has been sent to ' + email
                })
            } catch (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
        } catch (error) {
            return res.status(HTTP_STATUS.STATUS_OK).json({
                success: false,
                user: error
            })
        }

    }

    async checkTimeResetPassword(req, res) {
        try {
            const { tokenParams } = req.params;
            const user = await userRepository.checkTimeResetPassword(tokenParams);
            if (!user) return res.status(401).json({ message: 'Password reset token is invalid or has expired.' });
            return res.status(HTTP_STATUS.STATUS_OK).json({
                success: true,
                user
            })
        } catch (error) {
            return res.status(HTTP_STATUS.STATUS_OK).json({
                success: false,
                user: error
            })
        }
    }

    async resetPassword(req, res) {
        try {
            const { password } = req.body;
            const { tokenParams } = req.params;
            const isSuccess = await userRepository.resetPassword(tokenParams, userRepository.hashPassword(password));
            if (!isSuccess) {
                return res.status(HTTP_STATUS.STATUS_OK).json({
                    success: false,
                    message: "update password is not success!"
                })
            }

            const mailOptions = {
                to: user.email,
                subject: "Your password has been changed",
                html: `
                <p>Hi <b>${user.email}</b></p> 
                <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>
                `
            }

            try {
                await sendMail({ ...mailOptions });
                return res.status(HTTP_STATUS.STATUS_OK).json({
                    success: true,
                    message: 'A reset email has been sent to ' + email
                })
            } catch (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
        } catch (error) {
            return res.status(HTTP_STATUS.STATUS_OK).json({
                success: false,
                user: error
            })
        }
    }

    async loginSocialSuccess(req, res) {
        const { token, refreshToken } = generatorJwt(req.user);
        tokenList[refreshToken] = req.user;

        return res.status(HTTP_STATUS.STATUS_OK).json({
            success: true,
            user: req.user,
            token, refreshToken
        })
    }

}

module.exports = new userController();