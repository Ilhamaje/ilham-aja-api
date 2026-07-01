# 🌍 Ilham Aja API — MySQL Edition

Backend REST API untuk aplikasi **ilham_aja** dengan **MySQL** sebagai database.  
Data tersimpan permanen — tidak hilang saat server restart.

---

## 🛠️ Setup MySQL

### Langkah 1 — Install MySQL
Download dan install MySQL di: https://dev.mysql.com/downloads/installer/  
Atau pakai **XAMPP** (sudah include MySQL): https://www.apachefriends.org

### Langkah 2 — Buat Database
Buka **MySQL Workbench** atau **phpMyAdmin** (kalau pakai XAMPP), lalu jalankan:

```sql
CREATE DATABASE ilham_aja;
```

> Tabel akan dibuat **otomatis** saat server pertama kali dijalankan.

### Langkah 3 — Buat file `.env`
```bash
cp .env.example .env
```

Edit `.env` sesuai konfigurasi MySQL kamu:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=        ← isi password MySQL kamu (kosong jika tidak ada)
DB_NAME=ilham_aja
```

---

## 🚀 Cara Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Pastikan MySQL sudah berjalan

# 3. Jalankan server
npm run dev
```

Saat pertama jalan, server otomatis:
- Membuat semua tabel (`users`, `wisata`, `trips`, `trip_destinasi`)
- Mengisi **5 data wisata default**

---

## 🗄️ Struktur Database

```
users
├── id            INT AUTO_INCREMENT PK
├── nama          VARCHAR(100)
├── email         VARCHAR(100) UNIQUE
├── password      VARCHAR(255)  ← bcrypt hash
└── created_at    TIMESTAMP

wisata
├── id            INT AUTO_INCREMENT PK
├── nama          VARCHAR(150)
├── lokasi        VARCHAR(150)
├── kategori      VARCHAR(50)
├── deskripsi     TEXT
├── gambar        TEXT
├── rating        FLOAT
├── harga         VARCHAR(50)
└── created_at    TIMESTAMP

trips
├── id            VARCHAR(50) PK
├── user_id       INT FK → users.id
├── nama          VARCHAR(150)
├── tanggal_mulai DATE
├── tanggal_selesai DATE
└── created_at    BIGINT

trip_destinasi
├── id            INT AUTO_INCREMENT PK
├── trip_id       VARCHAR(50) FK → trips.id
├── wisata_id     INT
├── nama          VARCHAR(150)
├── lokasi        VARCHAR(150)
├── provinsi      VARCHAR(100)
├── icon          VARCHAR(10)
├── gambar        TEXT
├── tanggal       DATE
└── catatan       TEXT
```

---

## 📦 Struktur Project

```
ilham-aja-api-mysql/
├── server.js              ← Entry point + jalankan migrasi
├── package.json
├── .env.example
└── src/
    ├── db.js              ← Koneksi MySQL pool
    ├── migrate.js         ← Buat tabel + seed data otomatis
    ├── middleware/
    │   └── auth.js
    ├── data/
    │   ├── users.js       ← Query ke tabel users
    │   ├── wisata.js      ← Query ke tabel wisata
    │   └── trips.js       ← Query ke tabel trips & trip_destinasi
    └── routes/
        ├── auth.js
        ├── wisata.js
        ├── trips.js
        └── profile.js
```

---

## ⚠️ Koneksi dari HP Android (Expo Go)

Ganti IP di `constants/api.ts` app kamu:
```ts
export const API_BASE_URL = 'http://192.168.x.x:3000/api';
```
Cek IP lokal PC: `ipconfig` (Windows) → IPv4 di adapter WiFi.  
Pastikan HP & PC terhubung ke WiFi yang sama.
