// auth.middleware.js
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }
    jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.userId = decoded.userId;
      next();
    });
  };

  const validateLoginInput = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    next();
  };

  
module.exports = { verifyToken, validateLoginInput };