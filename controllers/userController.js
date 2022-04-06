const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sgMail = require('@sendgrid/mail');
const { HTTP_STATUS, TOKEN_LIFE, customMail } = require('../Constants');
const userRepository = require('../repositories/userRepository');
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const tokenList = {};

class userController {
    constructor() { }

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

    async createUser(req, res) {
        try {
            const { password, email } = req.body;
            const passwordHash = userRepository.hashPassword(password);
            const newUser = await userRepository.saveUser({ email, password: passwordHash });
            return res.status(HTTP_STATUS.CREATED).json({
                success: true,
                user: newUser
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

            const filterUser = {
                email: user.email,
                _id: user._id,
                role: user.role,
                inActive: user.inActive
            }

            const token = jwt.sign(filterUser, process.env.CREATE_TOKEN, { expiresIn: TOKEN_LIFE.TOKEN });
            const refreshToken = jwt.sign(filterUser, process.env.REFRESH_TOKEN, { expiresIn: TOKEN_LIFE.REFRESH_TOKEN });
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
            const user = await userRepository.getUserByEmail(email);
            if (!user) {
                return res.status(HTTP_STATUS.CREATED).json({
                    success: false,
                    message: "user is not exits!"
                })
            }
            const isPassword = userRepository.checkPassword(passwordOld, user.password);
            if (!isPassword) {
                return res.status(HTTP_STATUS.STATUS_OK).json({
                    success: false,
                    message: "password is not match"
                })
            }
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
        const { email } = req.user;
        try {
            const user = await userRepository.requestResetPassword(email);

            if (!user) {
                return res.status(HTTP_STATUS.CREATED).json({
                    success: false,
                    message: "user is not exits!"
                })
            }
            let link = "http://" + req.headers.host + "/reset-password/" + user.resetPasswordToken;
            const mailOptions = customMail({
                to: email,
                subject: "Password change request",
                text: `Hi ${email} \n 
                        Please click on the following link ${link} to reset your password. \n\n 
                        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            });

            sgMail.send(mailOptions, (error, result) => {
                if (error) return res.status(500).json({ success: false, message: error.message });
                return res.status(HTTP_STATUS.STATUS_OK).json({
                    success: true,
                    message: 'A reset email has been sent to ' + email + '.'
                })
            });

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
            const user = await userRepository.resetPassword(tokenParams, userRepository.hashPassword(password));
            if (!user) {
                return res.status(HTTP_STATUS.STATUS_OK).json({
                    success: false,
                    message: "user is not exits!"
                })
            }

            const mailOptions = customMail({
                to: user.email,
                subject: "Your password has been changed",
                text: `Hi ${user.email} \n 
                This is a confirmation that the password for your account ${user.email} has just been changed.\n`
            });

            sgMail.send(mailOptions, (error, result) => {
                if (error) return res.status(500).json({ message: error.message });
                res.status(200).json({ message: 'Your password has been updated.' });
            });
        } catch (error) {
            return res.status(HTTP_STATUS.STATUS_OK).json({
                success: false,
                user: error
            })
        }
    }

}

module.exports = new userController();