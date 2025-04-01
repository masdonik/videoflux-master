
# VideoFlux - Aplikasi Streaming Video

Aplikasi yang efisien untuk mengunduh video dari Google Drive dan melakukan streaming ke Facebook/YouTube menggunakan FFmpeg tanpa encoding.

## Fitur

- Pemantauan sumber daya sistem (CPU, Memori, Penggunaan Disk)
- Pengunduhan video dari Google Drive
- Streaming ke platform Facebook/YouTube
- Penjadwalan streaming dengan durasi yang dapat dikonfigurasi atau perulangan tak terbatas
- Manajemen video (ganti nama, hapus)
- Desain responsif untuk semua perangkat

## Pengembangan Lokal

**Persyaratan:**
- Node.js & npm - [Instal dengan nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# Kloning repositori
git clone https://github.com/masdonik/videoflux-master.git

# Pindah ke direktori proyek
cd videoflux

# Instal dependensi
npm install

# Jalankan server pengembangan
npm run dev
```

## Deployment ke VPS Ubuntu

### Prasyarat

- VPS Ubuntu (direkomendasikan 18.04 LTS atau lebih baru)
- Akses SSH ke VPS Anda
- Nama domain (opsional tetapi direkomendasikan)

### Langkah 1: Pengaturan Server Awal

Hubungkan ke VPS Anda:

```sh
ssh username@alamat_ip_server_anda
```

Perbarui sistem:

```sh
sudo apt update
sudo apt upgrade -y
```

Instal paket-paket penting:

```sh
sudo apt install -y build-essential curl git
```

### Langkah 2: Instal Node.js menggunakan NVM

```sh
# Instal NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Muat NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$HOME/.nvm/nvm.sh" ] && \. "$HOME/.nvm/nvm.sh"

# Instal versi LTS terbaru Node.js
nvm install --lts

# Verifikasi instalasi
node --version
npm --version
```

### Langkah 3: Instal FFmpeg

```sh
sudo apt install -y ffmpeg

# Verifikasi instalasi
ffmpeg -version
```

### Langkah 4: Kloning dan Persiapan Aplikasi

```sh
# Kloning repositori
git clone https://github.com/masdonik/videoflux.git
cd videoflux

# Instal dependencies
npm install

# Build aplikasi
npm run build
```

### Langkah 5: Instal dan Konfigurasi PM2 (Process Manager)

```sh
# Instal PM2 secara global
npm install -g pm2

# Jalankan aplikasi dengan PM2
pm2 start npm --name "videoflux" -- start

# Konfigurasi PM2 untuk memulai saat boot
pm2 startup
pm2 save
```

### Langkah 6: Setup Nginx sebagai Reverse Proxy (Opsional tetapi direkomendasikan)

```sh
# Instal Nginx
sudo apt install -y nginx

# Konfigurasi firewall untuk mengizinkan Nginx
sudo ufw allow 'Nginx Full'

# Buat konfigurasi Nginx
sudo nano /etc/nginx/sites-available/videoflux
```

Tambahkan konfigurasi berikut (ganti dengan domain Anda jika tersedia):

```nginx
server {
    listen 80;
    server_name domain-anda.com www.domain-anda.com;  # Atau IP server jika tidak ada domain

    location / {
        proxy_pass http://localhost:3000;  # Sesuaikan jika aplikasi berjalan pada port yang berbeda
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan situs dan restart Nginx:

```sh
sudo ln -s /etc/nginx/sites-available/videoflux /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Langkah 7: Setup SSL dengan Let's Encrypt (Opsional tetapi direkomendasikan)

```sh
# Instal Certbot
sudo apt install -y certbot python3-certbot-nginx

# Dapatkan sertifikat SSL
sudo certbot --nginx -d domain-anda.com -d www.domain-anda.com

# Verifikasi auto-renewal
sudo certbot renew --dry-run
```

### Langkah 8: Konfigurasi Variabel Lingkungan (jika diperlukan)

```sh
# Buat file lingkungan
nano .env
```

Tambahkan variabel lingkungan yang diperlukan ke file.

### Langkah 9: Verifikasi Instalasi

Kunjungi domain atau IP server Anda di browser web untuk memastikan aplikasi berfungsi dengan benar.

## Petunjuk Penggunaan

1. **Unduh Video**: Navigasi ke bagian Unduh untuk mengambil video dari Google Drive.
2. **Streaming Video**: Buka bagian Live Streaming untuk mengkonfigurasi dan memulai streaming ke Facebook/YouTube.
3. **Pantau Sumber Daya Sistem**: Lihat penggunaan CPU, memori, dan disk di bagian atas aplikasi.

## Pemecahan Masalah

- **Masalah Streaming**: Verifikasi FFmpeg terinstal dengan benar menggunakan `ffmpeg -version`.
- **Aplikasi Tidak Berjalan**: Periksa log PM2 dengan `pm2 logs videoflux`.
- **Error Izin**: Pastikan izin file yang benar dengan `chmod -R 755 /path/to/videoflux`.

## Struktur Proyek

- `/src` - Kode sumber aplikasi
- `/public` - Aset statis
- `/dist` - File build produksi (setelah menjalankan `npm run build`)

## Kontribusi

1. Fork repositori
2. Buat branch fitur Anda (`git checkout -b fitur/fitur-keren`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan beberapa fitur keren'`)
4. Push ke branch (`git push origin fitur/fitur-keren`)
5. Buka Pull Request

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file LICENSE untuk detail.
