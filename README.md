# Sistem Informasi Pendidikan

Aplikasi Sistem Informasi Pendidikan dengan fitur CRUD untuk data siswa, guru, dan mata pelajaran. Aplikasi ini dikembangkan menggunakan Laravel untuk backend dan React JS untuk frontend.

## Fitur

- Autentikasi Admin
- Manajemen Data Siswa
- Manajemen Data Guru
- Manajemen Data Mata Pelajaran
- Dashboard dengan statistik

## Teknologi yang Digunakan

### Backend
- Laravel 12
- MySQL
- Laravel Sanctum untuk autentikasi API

### Frontend
- React JS
- React Router
- Axios
- Bootstrap

## Struktur Proyek

```
Komputasi Awan Website/
├── backend/              # Backend Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       └── API/   # API Controllers
│   │   └── Models/        # Model Database
│   ├── routes/
│   │   └── api.php        # API Routes
│   └── ...
└── frontend/             # Frontend React
    ├── public/
    └── src/
        ├── components/    # Komponen React
        │   ├── auth/      # Komponen Autentikasi
        │   ├── siswa/     # Komponen Siswa
        │   ├── guru/      # Komponen Guru
        │   └── mapel/     # Komponen Mata Pelajaran
        ├── services/      # Service API
        └── utils/         # Utilitas
```

## Instalasi

### Backend

1. Masuk ke direktori backend:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   composer install
   ```

3. Salin file .env.example menjadi .env dan konfigurasi database:
   ```
   cp .env.example .env
   ```

4. Generate application key:
   ```
   php artisan key:generate
   ```

5. Jalankan migrasi dan seeder:
   ```
   php artisan migrate --seed
   ```

6. Buat symbolic link untuk storage:
   ```
   php artisan storage:link
   ```

7. Jalankan server:
   ```
   php artisan serve
   ```

### Frontend

1. Masuk ke direktori frontend:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Jalankan aplikasi:
   ```
   npm start
   ```

## Akses Admin

- Email: admin@pendidikan.com
- Password: admin123

## Pengembang

Dibuat untuk memenuhi tugas mata kuliah Komputasi Awan. 