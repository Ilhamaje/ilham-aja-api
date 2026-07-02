const express = require('express');
const cors = require('cors');
const migrate = require('./src/migrate');

const authRoutes    = require('./src/routes/auth');
const wisataRoutes  = require('./src/routes/wisata');
const tripRoutes    = require('./src/routes/trips');
const profileRoutes = require('./src/routes/profile');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth',    authRoutes);
app.use('/api/wisata',  wisataRoutes);
app.use('/api/trips',   tripRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '🌍 Ilham Aja API (MySQL) aktif!',
    version: '2.0.0',
    endpoints: [
      'POST   /api/auth/register',
      'POST   /api/auth/login',
      'GET    /api/wisata',
      'GET    /api/wisata/kategori',
      'GET    /api/wisata/:id',
      'POST   /api/wisata          (🔒)',
      'PUT    /api/wisata/:id      (🔒)',
      'DELETE /api/wisata/:id      (🔒)',
      'GET    /api/trips            (🔒)',
      'POST   /api/trips            (🔒)',
      'GET    /api/trips/:id        (🔒)',
      'PUT    /api/trips/:id        (🔒)',
      'DELETE /api/trips/:id        (🔒)',
      'POST   /api/trips/:id/destinasi       (🔒)',
      'DELETE /api/trips/:id/destinasi/:dId  (🔒)',
      'PATCH  /api/trips/:id/destinasi/:dId  (🔒)',
      'GET    /api/profile          (🔒)',
      'PUT    /api/profile          (🔒)',
    ],
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} tidak ditemukan` });
});

// Jalankan migrasi dulu, baru start server
migrate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Ilham Aja API (MySQL) berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
  console.error('❌ Gagal koneksi ke database:');
  console.error(err);
  process.exit(1);
});
