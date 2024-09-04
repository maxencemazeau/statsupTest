// authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const verifyJWT = (req, reply, done) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return reply.status(401).send({ error: 'Unauthorized' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }
        req.user = decoded; // Attach decoded token data to req.user
        done();
    });
};

module.exports = verifyJWT;
