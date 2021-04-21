import passport from 'passport';
const LocalStatergy = require('passport-local').Strategy;
import User from '../models/user';
import bcrypt from 'bcryptjs';
import SERVER from '../constants/message';

const valueField = {
    // by default passport uses [username] in `usernameField` so we override it with [email]
    usernameField: 'email',
};

const callbackValue = async (username, password, done) => {
    try {
        const user = await User.findOne({ email: username });
        if (!user)
            return done(null, false, { message: SERVER.INVALID_CREDENTIALS });
        const validatePassword = await bcrypt.compare(password, user.password);
        if (!validatePassword)
            return done(null, false, { message: SERVER.INVALID_CREDENTIALS });
        return done(null, user);
    } catch (error) {
        return done(error);
    }
};

const initialize = () => {
    passport.use(new LocalStatergy(valueField, callbackValue));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user._id);
        });
    });
};

module.exports = initialize;
