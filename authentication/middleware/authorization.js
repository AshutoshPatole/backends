import jwt from 'jsonwebtoken'

const validateToken = (req, res, next) => {
    let token = req.headers['authorization']
    if (!token) return res.status(403).send("Access Denied")
    token = token.split(' ')[1]
    jwt.verify(token, process.env.AUTHORIZATION_SECRET_KEY, (err, _payload) => {
        if (err) return res.status(403).send("Could not verify token")
        next()
    })
}

export default validateToken