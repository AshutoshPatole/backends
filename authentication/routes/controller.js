import User from '../models/user'

const login = (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        ip: req.connection.remoteAddress,
        source: req.headers['user-agent']
    })
    try {
        user.save()
        return res.send(user)
    }
    catch (e) {
        return res.send("Could not add users")
    }
}

export default login