const pool = require('../db');

// Helper: ambil destinasi dari trip
async function getDestinasi(tripId) {
  const [rows] = await pool.query(
    'SELECT * FROM trip_destinasi WHERE trip_id = ? ORDER BY id',
    [tripId]
  );
  return rows.map((r) => ({
    id: r.wisata_id,
    nama: r.nama,
    lokasi: r.lokasi,
    provinsi: r.provinsi,
    icon: r.icon,
    gambar: r.gambar,
    tanggal: r.tanggal,
    catatan: r.catatan,
    _rowId: r.id,
  }));
}

// Helper: format row trip + destinasi
async function formatTrip(row) {
  const destinasi = await getDestinasi(row.id);
  return {
    id: row.id,
    userId: row.user_id,
    nama: row.nama,
    tanggalMulai: row.tanggal_mulai,
    tanggalSelesai: row.tanggal_selesai,
    createdAt: row.created_at,
    destinasi,
  };
}

function genId() {
  return `trip_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
}

module.exports = {
  getByUser: async (userId) => {
    const [rows] = await pool.query(
      'SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return Promise.all(rows.map(formatTrip));
  },

  getById: async (id, userId) => {
    const [rows] = await pool.query(
      'SELECT * FROM trips WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (!rows[0]) return null;
    return formatTrip(rows[0]);
  },

  create: async (userId, nama) => {
    const id = genId();
    const createdAt = Date.now();
    await pool.query(
      'INSERT INTO trips (id, user_id, nama, created_at) VALUES (?, ?, ?, ?)',
      [id, userId, nama?.trim() || 'Rencana Baru', createdAt]
    );
    return { id, userId, nama: nama?.trim() || 'Rencana Baru', tanggalMulai: null, tanggalSelesai: null, destinasi: [], createdAt };
  },

  update: async (id, userId, data) => {
    const sets = [];
    const vals = [];
    if (data.nama !== undefined)           { sets.push('nama = ?');            vals.push(data.nama); }
    if (data.tanggalMulai !== undefined)   { sets.push('tanggal_mulai = ?');   vals.push(data.tanggalMulai); }
    if (data.tanggalSelesai !== undefined) { sets.push('tanggal_selesai = ?'); vals.push(data.tanggalSelesai); }
    if (!sets.length) return null;
    vals.push(id, userId);
    const [result] = await pool.query(
      `UPDATE trips SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`, vals
    );
    if (!result.affectedRows) return null;
    return module.exports.getById(id, userId);
  },

  remove: async (id, userId) => {
    const [result] = await pool.query(
      'DELETE FROM trips WHERE id = ? AND user_id = ?', [id, userId]
    );
    return result.affectedRows > 0;
  },

  addDestination: async (id, userId, dest) => {
    // Cek trip milik user
    const [trips] = await pool.query('SELECT id FROM trips WHERE id = ? AND user_id = ?', [id, userId]);
    if (!trips[0]) return null;
    // Cek sudah ada
    const [existing] = await pool.query(
      'SELECT id FROM trip_destinasi WHERE trip_id = ? AND wisata_id = ?', [id, dest.id]
    );
    if (!existing[0]) {
      await pool.query(
        'INSERT INTO trip_destinasi (trip_id, wisata_id, nama, lokasi, provinsi, icon, gambar) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, dest.id, dest.nama, dest.lokasi, dest.provinsi, dest.icon, dest.gambar]
      );
    }
    return module.exports.getById(id, userId);
  },

  removeDestination: async (id, userId, destId) => {
    const [trips] = await pool.query('SELECT id FROM trips WHERE id = ? AND user_id = ?', [id, userId]);
    if (!trips[0]) return null;
    await pool.query(
      'DELETE FROM trip_destinasi WHERE trip_id = ? AND wisata_id = ?', [id, destId]
    );
    return module.exports.getById(id, userId);
  },

  updateDestination: async (id, userId, destId, patch) => {
    const [trips] = await pool.query('SELECT id FROM trips WHERE id = ? AND user_id = ?', [id, userId]);
    if (!trips[0]) return null;
    const sets = [];
    const vals = [];
    if (patch.tanggal !== undefined) { sets.push('tanggal = ?'); vals.push(patch.tanggal); }
    if (patch.catatan !== undefined) { sets.push('catatan = ?'); vals.push(patch.catatan); }
    if (sets.length) {
      vals.push(id, destId);
      await pool.query(
        `UPDATE trip_destinasi SET ${sets.join(', ')} WHERE trip_id = ? AND wisata_id = ?`, vals
      );
    }
    return module.exports.getById(id, userId);
  },
};
