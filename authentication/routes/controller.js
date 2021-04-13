import jwt from 'jsonwebtoken'

const generateToken = (_id, tokenType = 'A') => {
    let TOKEN_TYPE = tokenType == 'R' ? 'REFRESH_TOKEN' : 'ACCESS_TOKEN'

    let ACCESS_TOKEN_EXPIRY = '1h'

    let payload = {
        id: _id,
        type: TOKEN_TYPE,
    }
    if (tokenType == 'R') {
        let signedJWT = jwt.sign(payload, process.env.AUTHORIZATION_SECRET_KEY)
        return signedJWT
    }
    let signedJWT = jwt.sign(payload, process.env.AUTHORIZATION_SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRY })
    return signedJWT
}

const generateAccessToken = (object_id) => {
    let tokenType = 'A'
    return generateToken(object_id, tokenType)
}


const generateRefreshToken = (object_id) => {
    let tokenType = 'R'
    return generateToken(object_id, tokenType)
}

export {
    generateAccessToken,
    generateRefreshToken
}
