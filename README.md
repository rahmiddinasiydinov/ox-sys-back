# OX Backend

OX-SYS bilan integratsiya qilingan NestJS backend topshirig'i.

## 📋 Talablar

- Node.js 18+
- npm yoki yarn
- Docker (production uchun)

## ⚙️ Environmental Variables

`.env` faylini yarating:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
PORT = 3001
```

> ⚠️ **Muhim**: `JWT_SECRET` ni production uchun kuchli parol ishlating.

---

## 🚀 Lokal ishga tushirish

### 1. "Dependencies"ni o'rnatish"

```bash
npm install
```

### 2. DB ni sozlash

```bash
npx prisma generate
npx prisma db push
```

### 3. Dasturni ishga tushirish

```bash
# Development rejimida
npm run start:dev

# Production rejimida
npm run build
npm run start:prod
```

Dastur **http://localhost:3001** portida ishlaydi.

---

## 🐳 Docker orqali ishga tushirish (Production)

## ⚙️ Environmental Variables

`.env` faylini yarating (root direktoriyaga):

```env
JWT_SECRET="your-super-secret-jwt-key"
```

### 1. Docker image yaratish va ishga tushirish

```bash
docker-compose up -d --build
```

### 2. Loglarni ko'rish

```bash
docker-compose logs -f
```

### 3. To'xtatish

```bash
docker-compose down
```

Ilova **http://localhost:5000** portida ishlaydi.


## 🔐 API Endpointlar

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/auth/login` | Email orqali OTP olish |
| POST | `/auth/verify` | OTP tasdiqlash va token olish |
| POST | `/company/register` | Kompaniyani ro'yxatdan o'tkazish |
| DELETE | `/company/:id` | Kompaniyani o'chirish (faqat admin) |
| GET | `/products` | Mahsulotlar ro'yxati (faqat manager) |

---

## 👥 Rollar

- **admin** - Yangi kompaniya yaratgan foydalanuvchi
- **manager** - Mavjud kompaniyaga qo'shilgan foydalanuvchi

