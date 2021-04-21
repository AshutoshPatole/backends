import User from '../models/user'
import bcrypt from 'bcryptjs'
import passport from 'passport';
import { generateAccessToken, generateRefreshToken } from './controller'
import STATUS_CODES from '../constants/statusCode'
import SERVER from '../constants/message'
import jwt from 'jsonwebtoken'

const register = async (req, res) => {
    const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) return res.status(STATUS_CODES.BAD_REQUEST).send("Email already exists")
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        ip: req.connection.remoteAddress,
        source: req.headers['user-agent']
    })
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)
    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)
    user.refreshToken = refreshToken
    try {
        await user.save()
        return res.status(STATUS_CODES.CREATED).json({
            _id: user._id,
            accessToken: accessToken,
            refreshToken: refreshToken,
        })
    }
    catch (e) {
        return res.send("Could not add users")
    }
}


const login = async (req, res, next) => {
    passport.authenticate(
        'local',
        (err, user, info) => {
            if (err) {
                return res.sendStatus(
                    STATUS_CODES.INTERNAL_SERVER_ERROR,
                    SERVER.INTERNAL_ERROR
                );
            }
            if (!user && info) {
                return res.status(STATUS_CODES.UNAUTHORIZED).send(info);
            }
            req.logIn(user, async (error) => {
                if (error) {
                    return next(error);
                }
                const accessToken = generateAccessToken(user._id)
                const refreshToken = generateRefreshToken(user._id)
                user.refreshToken = refreshToken
                try {
                    await user.save()
                    return res.status(200).json({
                        _id: user._id,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    })
                }
                catch (e) {
                    return res.send("ERROR")
                }
            });
        },
        {
            successRedirect: '/',
        }
    )(req, res, next);
};

const refreshToken = async (req, res) => {
    const bearerToken = req.headers['authorization']
    if (!bearerToken) return res.status(STATUS_CODES.FORBIDDEN).send("Access Denied")

    const refreshToken = bearerToken.split(' ')[1]
    jwt.verify(refreshToken, process.env.AUTHORIZATION_SECRET_KEY, (err, payload) => {
        if (err) return res.status(STATUS_CODES.FORBIDDEN).json(err)

        if (payload.type != 'REFRESH_TOKEN')
            return res.status(STATUS_CODES.FORBIDDEN).json(
                {
                    status: "Error",
                    error: {
                        name: 'InvalidTokenError',
                        message: 'Not a refresh token.'
                    }
                }
            )
        User.findById(payload.id, (err, user) => {
            if (err) return res.status(STATUS_CODES.NOT_FOUND).send("user not found")
            if (user && user.refreshToken == refreshToken) {
                const newAccessToken = generateAccessToken(payload.id)
                return res.json({
                    status: "Success",
                    accessToken: newAccessToken
                })
            }
            return res.status(STATUS_CODES.FORBIDDEN).json(
                {
                    status: "Error",
                    error: {
                        name: 'InvalidTokenError',
                        message: 'Wrong token.'
                    }
                }
            )

        })
    })
}


export { register, login, refreshToken }