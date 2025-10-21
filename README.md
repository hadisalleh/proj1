# 🎣 FishTrip - Platform Tempahan Perjalanan Memancing

Platform web yang responsif untuk mencari dan menempah perjalanan memancing di seluruh dunia. Dibina dengan Next.js 15, TypeScript, Tailwind CSS, dan PostgreSQL.

## ✨ Ciri-ciri Utama

- 📱 **Responsif Sepenuhnya** - Dioptimumkan untuk desktop, tablet, dan mobile
- 🔐 **Sistem Pengesahan** - NextAuth.js dengan credentials dan OAuth
- 🎣 **Katalog Perjalanan** - Cari, tapis, dan layari perjalanan memancing
- ⭐ **Sistem Ulasan** - Baca dan tulis ulasan untuk perjalanan
- 📅 **Pengurusan Tempahan** - Tempah dan urus perjalanan anda
- 🌐 **Dwibahasa** - Sokongan Bahasa Melayu dan Inggeris
- 🚀 **Prestasi Tinggi** - PWA dengan caching dan optimisasi

## 🛠️ Teknologi yang Digunakan

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL dengan Prisma ORM
- **Authentication:** NextAuth.js
- **Icons:** Lucide React
- **Testing:** Jest, React Testing Library

## 📋 Keperluan Sistem

Sebelum memulakan, pastikan anda mempunyai:

- **Node.js** (versi 18 atau lebih tinggi)
- **npm** atau **yarn**
- **PostgreSQL** (versi 12 atau lebih tinggi)
- **Git**

## 🚀 Panduan Pemasangan

### 1. Clone Repository

```bash
git clone https://github.com/[username]/fishing-trip-landing.git
cd fishing-trip-landing
```

### 2. Pasang Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Setup Database PostgreSQL

#### Windows:
1. Muat turun dan pasang PostgreSQL dari [postgresql.org](https://www.postgresql.org/download/windows/)
2. Semasa pemasangan, ingat password untuk user `postgres`
3. Buka pgAdmin atau Command Prompt dan cipta database:

```sql
CREATE DATABASE proj1;
```

#### macOS:
```bash
# Menggunakan Homebrew
brew install postgresql
brew services start postgresql
createdb proj1
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb proj1
```

### 4. Setup Environment Variables

Cipta fail `.env` di root directory:

```bash
cp .env.example .env
```

Edit `.env` dengan maklumat database anda:

```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/proj1"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="fishtrip-2024-secure-secret-key-a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# API Configuration
API_BASE_URL="http://localhost:3000/api"
```

**Penting:** Gantikan `your_password` dengan password PostgreSQL anda.

### 5. Setup Database Schema

```bash
# Generate Prisma client
npm run db:generate

# Jalankan migrations
npm run db:migrate

# Seed database dengan data contoh
npm run db:seed
```

### 6. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) dalam pelayar anda.

## 👤 Akaun Ujian

Selepas menjalankan `npm run db:seed`, anda boleh log masuk dengan:

- **Email:** `test@cubaje.my`
- **Password:** `P@ssword1234`

## 📱 Ciri-ciri Mobile

Projek ini dioptimumkan sepenuhnya untuk mobile dengan:

- Touch-friendly interactions
- Swipe gestures untuk galeri imej
- Pull-to-refresh functionality
- Responsive navigation
- Mobile-first design approach

## 🧪 Menjalankan Tests

```bash
# Jalankan semua tests
npm test

# Jalankan tests dengan coverage
npm run test:coverage

# Jalankan tests dalam watch mode
npm run test:watch
```

## 🏗️ Build untuk Production

```bash
# Build aplikasi
npm run build

# Jalankan production server
npm start
```

## 📁 Struktur Projek

```
fishing-trip-landing/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── features/        # Feature-specific components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utility libraries
│   ├── hooks/               # Custom React hooks
│   └── utils/               # Helper functions
├── prisma/                  # Database schema dan migrations
├── public/                  # Static assets
└── __tests__/               # Test files
```

## 🔧 Skrip yang Tersedia

- `npm run dev` - Jalankan development server
- `npm run build` - Build untuk production
- `npm run start` - Jalankan production server
- `npm run lint` - Jalankan ESLint
- `npm test` - Jalankan tests
- `npm run db:migrate` - Jalankan database migrations
- `npm run db:seed` - Seed database dengan data contoh
- `npm run db:reset` - Reset database

## 🐛 Troubleshooting

### Database Connection Issues

1. **Pastikan PostgreSQL berjalan:**
   ```bash
   # Windows
   net start postgresql-x64-[version]
   
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

2. **Periksa DATABASE_URL dalam .env**
3. **Pastikan database `proj1` wujud**

### Port Already in Use

Jika port 3000 sudah digunakan:
```bash
npm run dev -- -p 3001
```

### Node.js Version Issues

Pastikan menggunakan Node.js versi 18+:
```bash
node --version
```

## 🤝 Contributing

1. Fork repository
2. Cipta feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buka Pull Request

## 📄 License

Projek ini dilindungi di bawah MIT License. Lihat fail `LICENSE` untuk maklumat lanjut.

## 🆘 Sokongan

Jika anda menghadapi masalah:

1. Periksa bahagian [Troubleshooting](#-troubleshooting)
2. Semak [Issues](https://github.com/[username]/fishing-trip-landing/issues) yang sedia ada
3. Cipta issue baru jika masalah belum dilaporkan

## 🎯 Ciri-ciri Akan Datang

- [ ] Integrasi pembayaran
- [ ] Notifikasi real-time
- [ ] Chat dengan pemandu
- [ ] Sistem rating pemandu
- [ ] Sokongan berbilang mata wang
- [ ] Aplikasi mobile native

---

**Dibina dengan ❤️ untuk komuniti memancing Malaysia** 🇲🇾