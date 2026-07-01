const pool = require('./db');

async function migrate() {
  const conn = await pool.getConnection();
  try {
    // Users
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        nama       VARCHAR(100) NOT NULL,
        email      VARCHAR(100) NOT NULL UNIQUE,
        password   VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Wisata
    await conn.query(`
      CREATE TABLE IF NOT EXISTS wisata (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        nama       VARCHAR(150) NOT NULL,
        lokasi     VARCHAR(150) NOT NULL,
        kategori   VARCHAR(50)  NOT NULL,
        deskripsi  TEXT,
        gambar     TEXT,
        rating     FLOAT DEFAULT 0,
        harga      VARCHAR(50) DEFAULT 'Gratis',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed wisata default kalau masih kosong
    const [rows] = await conn.query('SELECT COUNT(*) AS total FROM wisata');
    if (rows[0].total === 0) {
      await conn.query(`
        INSERT INTO wisata (nama, lokasi, kategori, deskripsi, gambar, rating, harga) VALUES
        ('Gunung Bromo',    'Jawa Timur',            'Gunung',  'Destinasi pegunungan ikonik dengan pemandangan sunrise terbaik di Indonesia.', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800', 4.9, 'Rp25.000'),
        ('Pantai Kuta Bali','Bali',                   'Pantai',  'Pantai legendaris dengan pasir putih, ombak surfing, dan sunset memukau.',     'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', 4.7, 'Rp15.000'),
        ('Ranca Upas',      'Bandung, Jawa Barat',   'Camping', 'Tempat camping populer dengan suasana hutan pinus yang sejuk dan rusa liar.',  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800', 4.5, 'Rp35.000'),
        ('Kota Tua Jakarta','Jakarta',                'Kota',    'Kawasan bersejarah dengan gedung-gedung kolonial dan museum seni budaya.',     'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800', 4.3, 'Gratis'),
        ('Candi Borobudur', 'Magelang, Jawa Tengah', 'Budaya',  'Candi Buddha terbesar di dunia, warisan budaya UNESCO yang menakjubkan.',      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 4.8, 'Rp50.000')
      `);
      console.log('✅ Seed 5 wisata default berhasil');
    }

    // Trips
    await conn.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id              VARCHAR(50) PRIMARY KEY,
        user_id         INT NOT NULL,
        nama            VARCHAR(150) NOT NULL,
        tanggal_mulai   DATE,
        tanggal_selesai DATE,
        created_at      BIGINT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Trip destinations
    await conn.query(`
      CREATE TABLE IF NOT EXISTS trip_destinasi (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        trip_id    VARCHAR(50) NOT NULL,
        wisata_id  INT NOT NULL,
        nama       VARCHAR(150),
        lokasi     VARCHAR(150),
        provinsi   VARCHAR(100),
        icon       VARCHAR(10),
        gambar     TEXT,
        tanggal    DATE,
        catatan    TEXT,
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Migrasi database selesai');
  } finally {
    conn.release();
  }
}

module.exports = migrate;
