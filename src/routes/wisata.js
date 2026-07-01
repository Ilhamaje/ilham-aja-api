const router = require('express').Router();
const wisata = require('../data/wisata');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { kategori, q } = req.query;
    let result;
    if (q) {
      result = await wisata.search(q);
      if (kategori) result = result.filter((w) => w.kategori.toLowerCase() === kategori.toLowerCase());
    } else if (kategori) {
      result = await wisata.filterByKategori(kategori);
    } else {
      result = await wisata.getAll();
    }
    res.json({ success: true, total: result.length, data: result });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.get('/kategori', async (req, res) => {
  try {
    const data = await wisata.getKategori();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await wisata.getById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Wisata tidak ditemukan' });
    res.json({ success: true, data: item });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('BODY:', req.body);

    const { nama, lokasi, kategori, deskripsi, gambar, rating, harga } = req.body;

    const newItem = await wisata.create({
      nama,
      lokasi,
      kategori,
      deskripsi: deskripsi || '',
      gambar: gambar || '',
      rating: Number(rating) || 0,
      harga: harga || 'Gratis'
    });

    console.log('DATA TERSIMPAN:', newItem);

    res.status(201).json({
      success: true,
      message: 'Wisata berhasil ditambahkan',
      data: newItem
    });
  } catch (e) {
    console.error('ERROR:', e);
    res.status(500).json({
      success: false,
      message: e.message
    });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const updated = await wisata.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Wisata tidak ditemukan' });
    res.json({ success: true, message: 'Wisata berhasil diupdate', data: updated });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const ok = await wisata.remove(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Wisata tidak ditemukan' });
    res.json({ success: true, message: 'Wisata berhasil dihapus' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
