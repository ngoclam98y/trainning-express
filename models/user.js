const mongoose = require('mongoose');
const { ROLE } = require('../Constants');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        index: {
            unique: true
        },
        validate: {
            validator: function (value) {
                var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return pattern.test(value);
            },
            message: '{VALUE} is not a valid email'
        },
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        validate: {
            validator: function (value) {
                return value.length >= 3;
            },
            message: 'Password must have at least 3 characters'
        },
        required: [true, 'Password is required']
    },
    githubId: {
        type: String,
        require: false,
    },
    googleId: {
        type: String,
        require: false,
    },
    inActive: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: ROLE.MEMBER,
        enum: [ROLE.MEMBER, ROLE.ADMIN],
    },
    resetPasswordToken: {
        type: String,
        default: ''
    },
    resetPasswordExpires: {
        type: Date,
        default: ''
    }
});

module.exports = mongoose.model('User', userSchema);