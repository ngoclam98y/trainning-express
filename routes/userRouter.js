const passport = require('passport');
const userController = require('../controllers/userController');
const { checkAuthenticator, checkRole } = require('../middleware');

module.exports = function (app) {
    app.get('/dashboard', checkAuthenticator, userController.goToDashboard);
    app.get('/login-faild', userController.loginFaild);

    app.delete('/users/:id', checkAuthenticator, checkRole, userController.deleteUserById);
    app.put('/users', checkAuthenticator, checkRole, userController.updateUser);

    app.get('/users', checkAuthenticator, checkRole, userController.findAllUser);
    app.post('/forget-password', userController.requestResetPassword);
    app.get('/reset-password/:tokenParams', userController.checkTimeResetPassword)
    app.post('/createUser', userController.createUser);
    app.post('/login', userController.login);
    app.put('/change-password', checkAuthenticator, userController.changePassword);
    app.put('/reset-password/:tokenParams', userController.resetPassword);


    /*auth*/


    app.get('/login-github', (req, res) => {
        return res.send('<p>Login with <a href="/auth/github"><button>Login Github</button></a></p>')
    })

    app.get('/login-google', (req, res) => {
        return res.send('<p>Login with <a href="/auth/google"><button>Login Google</button></a></p>')
    })

    app.get('/auth/github', passport.authenticate('github', { scope: ["user"] }));
    app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login-faild' }), userController.loginSocialSuccess);

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login-faild' }), userController.loginSocialSuccess);
};