import User from '../models/user'
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from './controller'

const register = async (req, res) => {
    // TODO Change hardcoded response to JSON in this function
    const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) return res.send("Email already exists")
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
        return res.status(201).json({
            _id: user._id,
            accessToken: accessToken,
            refreshToken: refreshToken,
        })
    }
    catch (e) {
        return res.send("Could not add users")
    }
}

const login = async (req, res) => {
    // TODO Change hardcoded response to JSON in this function
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.send("No user found")
    const isValidPassword = bcrypt.compareSync(req.body.password, user.password)
    if (!isValidPassword) return res.send("Invalid credentials")
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
}

export { register, login }