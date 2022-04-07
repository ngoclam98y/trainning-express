const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const dotenv = require('dotenv');
dotenv.config();

module.exports.passportConfig = function () {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });


    passport.use(new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
        function (_, __, profile, done) {
            const user = {
                githubId: profile.id,
                username: profile.username,
                avatar: profile.photos[0].value
            }
            done(null, user);
        }
    ));

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
        function (_, __, profile, done) {
            const user = {
                googleId: profile.id,
                username: profile.displayName,
                avatar: profile.photos[0].value
            }

            return done(null, user);
        }
    ));
}