const userController = require('../controllers/userController');
const { checkAuthenticator, checkRole } = require('../middleware');

module.exports = function (app) {
    app.get('/users', checkAuthenticator, checkRole, userController.findAllUser);
    app.get('/forget-password', checkAuthenticator, userController.requestResetPassword);
    app.get('/reset-password/:tokenParams', userController.checkTimeResetPassword)
    app.post('/createUser', userController.createUser);
    app.post('/login', userController.login);
    app.put('/change-password', checkAuthenticator, userController.changePassword);
    app.put('/reset-password/:tokenParams', userController.resetPassword);
};