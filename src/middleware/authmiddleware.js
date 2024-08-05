const jwt = require('jsonwebtoken');
const prisma = require('../db'); // Sesuaikan dengan path ke file prismaClient Anda

// Middleware untuk autentikasi token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401); // Unauthorized
  
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    
    // Simpan data pengguna di req.user
    const foundUser = await prisma.pengguna.findUnique({
      where: { id: user.id },
    });
    
    if (!foundUser) return res.sendStatus(403); // Forbidden

    req.user = foundUser;
    next();
  });
};

// Middleware untuk otorisasi peran
const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.peran !== role) return res.sendStatus(403); // Forbidden
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
