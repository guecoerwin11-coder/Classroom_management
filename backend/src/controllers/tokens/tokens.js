const jwt = require('jsonwebtoken')

const token = (user) => {
    return jwt.sign(
        {   id: user.id, firstName: user.firstName,
            lastName: user.lastName, email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '2d' }
    )
}

module.exports = token