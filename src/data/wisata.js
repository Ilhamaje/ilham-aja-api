const pool = require('../db');

module.exports = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM wisata ORDER BY nama');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM wisata WHERE id = ?', [id]);
    return rows[0] || null;
  },

  search: async (q) => {
    const like = `%${q}%`;
    const [rows] = await pool.query(
      'SELECT * FROM wisata WHERE nama LIKE ? OR lokasi LIKE ? OR kategori LIKE ?',
      [like, like, like]
    );
    return rows;
  },

  filterByKategori: async (kategori) => {
    const [rows] = await pool.query(
      'SELECT * FROM wisata WHERE LOWER(kategori) = LOWER(?)',
      [kategori]
    );
    return rows;
  },

  getKategori: async () => {
    const [rows] = await pool.query('SELECT DISTINCT kategori FROM wisata');
    return rows.map((r) => r.kategori);
  },

  create: async (data) => {
  const { nama, lokasi, kategori, deskripsi, gambar, rating, harga } = data;

  console.log('DATA MAU DISIMPAN:', data);

  const [result] = await pool.query(
    'INSERT INTO wisata (nama, lokasi, kategori, deskripsi, gambar, rating, harga) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [nama, lokasi, kategori, deskripsi, gambar, rating, harga]
  );

  console.log('HASIL INSERT:', result);

  return { id: result.insertId, ...data };
},

  update: async (id, data) => {
    const fields = [];
    const values = [];
    for (const [k, v] of Object.entries(data)) {
      fields.push(`${k} = ?`);
      values.push(v);
    }
    if (!fields.length) return null;
    values.push(id);
    await pool.query(`UPDATE wisata SET ${fields.join(', ')} WHERE id = ?`, values);
    const [rows] = await pool.query('SELECT * FROM wisata WHERE id = ?', [id]);
    return rows[0] || null;
  },

  remove: async (id) => {
    const [result] = await pool.query('DELETE FROM wisata WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};
