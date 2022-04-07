const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../models/user');

class UserRepository {
    constructor() { }

    hashPassword(password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        return hash;
    }

    checkPassword(password, passwordDb) {
        return bcrypt.compareSync(password, passwordDb);
    }

    allUsers() {
        return User.find().exec();
    }

    deleteUser(id) {
        return User.findByIdAndDelete(id).exec();
    }

    async updateUser(user) {
        const userUpdate = await User.findOneAndUpdate({ email }, { $set: user }, { new: true });
        return !!userUpdate;
    }

    async saveUser(user) {
        await new User(user).save();
        return !!user;
    }

    async getUserByEmail(email) {
        const user = await User.findOne({ email }).exec();
        return user;
    }

    async changePassword(email, password) {
        await User.findOneAndUpdate({ email }, { password });
        return true;
    }

    async requestResetPassword(email) {
        const update = {
            resetPasswordToken: crypto.randomBytes(20).toString('hex'),
            resetPasswordExpires: Date.now() + 60 * 60 * 60
        }
        const user = await User.findOneAndUpdate({ email }, { $set: update }, { new: true });
        return user;
    }

    async checkTimeResetPassword(tokenParams) {
        const user = await User.findOne({ resetPasswordToken: tokenParams, resetPasswordExpires: { $gt: Date.now() } });
        return user;
    }

    async resetPassword(tokenParams, passwordHash) {
        const updates = {
            password: passwordHash,
            resetPasswordToken: '',
            resetPasswordExpires: null
        }
        const user = await User.findOneAndUpdate({ resetPasswordToken: tokenParams, resetPasswordExpires: { $gt: Date.now() } }, { $set: updates }, { new: true });
        return !!user;
    }

}

module.exports = new UserRepository();