const express = require('express');
const passport = require('passport');
const app = express();

const consign = require('consign');
const bodyParser = require('body-parser');
const { passportConfig } = require('./passport');

app.use(bodyParser.json());


passportConfig();

app.use(passport.initialize())
// app.use(passport.session())

consign().include('./routes')
    .into(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Resource Not Found');
    err.status = 404;
    next(err);
});

// error handlers

app.use(function (e, req, res, next) {
    let status = e.status || 500;
    let error = { message: e.message };

    if (app.get('env') === 'development') {
        error.message = status + ' ' + e;
        res.status(status).send(e.stack);
    } else {
        res.status(status).json(error);
    }
});

module.exports = function () {
    return app;
};