const router = require('express').Router();
const jwt = require('jsonwebtoken');
const users = require('../data/users');

const SECRET = process.env.JWT_SECRET || 'ilham_aja_secret_dev';
const TOKEN_EXPIRE = '7d';

router.post('/register', async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    if (!nama || !email || !password)
      return res.status(400).json({ success: false, message: 'nama, email, password wajib diisi' });
    const existing = await users.findByEmail(email);
    if (existing) return res.status(409).json({ success: false, message: 'Email sudah terdaftar' });
    const newUser = await users.create(nama, email, password);
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET, { expiresIn: TOKEN_EXPIRE });
    res.status(201).json({ success: true, message: 'Registrasi berhasil', data: { user: users.safeUser(newUser), token } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'email dan password wajib diisi' });
    const user = await users.findByEmail(email);
    if (!user) return res.status(401).json({ success: false, message: 'Email atau password salah' });
    const valid = await users.verifyPassword(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Email atau password salah' });
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: TOKEN_EXPIRE });
    res.json({ success: true, message: 'Login berhasil', data: { user: users.safeUser(user), token } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
