const router = require('express').Router();
const trips = require('../data/trips');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const result = await trips.getByUser(req.user.id);
    res.json({ success: true, total: result.length, data: result });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const trip = await trips.create(req.user.id, req.body.nama);
    res.status(201).json({ success: true, message: 'Trip berhasil dibuat', data: trip });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const trip = await trips.getById(req.params.id, req.user.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip tidak ditemukan' });
    res.json({ success: true, data: trip });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.body;
    const updated = await trips.update(req.params.id, req.user.id, {
      ...(nama !== undefined && { nama }),
      ...(tanggalMulai !== undefined && { tanggalMulai }),
      ...(tanggalSelesai !== undefined && { tanggalSelesai }),
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Trip tidak ditemukan' });
    res.json({ success: true, message: 'Trip berhasil diupdate', data: updated });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const ok = await trips.remove(req.params.id, req.user.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Trip tidak ditemukan' });
    res.json({ success: true, message: 'Trip berhasil dihapus' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/:id/destinasi', async (req, res) => {
  try {
    const { id: destId, nama, lokasi, provinsi, icon, gambar } = req.body;
    if (!destId || !nama)
      return res.status(400).json({ success: false, message: 'id dan nama destinasi wajib diisi' });
    const updated = await trips.addDestination(req.params.id, req.user.id, {
      id: Number(destId), nama, lokasi: lokasi || '', provinsi: provinsi || '', icon: icon || '', gambar: gambar || '',
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Trip tidak ditemukan' });
    res.json({ success: true, message: 'Destinasi ditambahkan', data: updated });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id/destinasi/:destId', async (req, res) => {
  try {
    const updated = await trips.removeDestination(req.params.id, req.user.id, req.params.destId);
    if (!updated) return res.status(404).json({ success: false, message: 'Trip atau destinasi tidak ditemukan' });
    res.json({ success: true, message: 'Destinasi dihapus', data: updated });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.patch('/:id/destinasi/:destId', async (req, res) => {
  try {
    const { tanggal, catatan } = req.body;
    const updated = await trips.updateDestination(req.params.id, req.user.id, req.params.destId, {
      ...(tanggal !== undefined && { tanggal }),
      ...(catatan !== undefined && { catatan }),
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Trip atau destinasi tidak ditemukan' });
    res.json({ success: true, message: 'Destinasi diupdate', data: updated });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
