const router = require('express').Router();
const auth = require('../middleware/auth');
const userStore = require('../data/users');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const user = await userStore.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    res.json({ success: true, data: userStore.safeUser(user) });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const user = await userStore.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    if (req.body.nama) {
      await userStore.update(req.user.id, { nama: req.body.nama.trim() });
      user.nama = req.body.nama.trim();
    }
    res.json({ success: true, message: 'Profil diupdate', data: userStore.safeUser(user) });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
