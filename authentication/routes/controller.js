import User from '../models/user'
import bcrypt from 'bcryptjs'

const login = async (req, res) => {
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
    try {
        await user.save()
        return res.send(user)
    }
    catch (e) {
        return res.send("Could not add users")
    }
}

export default login