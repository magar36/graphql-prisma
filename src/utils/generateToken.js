import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    return jwt.sign({ userId }, 'secret')
}

export { generateToken as default}