const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'ilham_aja_secret_dev';

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak ada' });
  }
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token tidak valid / expired' });
  }
};
