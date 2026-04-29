# 📚 BookStore Web App / Kitob Do‘koni Web Ilovasi

## English 🇬🇧

A full-stack online bookstore web application built entirely with JavaScript/TypeScript.
The frontend is powered by **React + Vite**, the backend runs on **Node.js**, served behind **Nginx**, and uses **MySQL** as the database.

This project allows users to browse books, filter by genres, and purchase books.
It also includes an admin system for managing books and genres.

---

## 🚀 Features

### User Features

* User registration and login
* Browse all available books
* View book details
* Filter books by genre
* Purchase books
* Purchase history tracking

### Admin Features

* Add / edit / delete books
* Manage genres
* Mark books as sold or available
* View sold books history

---

## 🛠️ Tech Stack

### Frontend

* **React**
* **TypeScript**
* **Vite**
* **CSS**

### Backend

* **Node.js**
* **Express.js** (if used)
* **TypeScript / JavaScript**

### Database

* **MySQL**

### Deployment / Infrastructure

* **Nginx**
* **Docker**
* **Docker Compose**

---

## 📂 Project Structure

```bash
backend/            # Backend source code
components/         # React components
contexts/           # React contexts
docker/             # Docker-related files
lib/                # Utilities / helper functions
pages/              # Website pages
App.tsx             # Main app component
constants.tsx       # Constants
index.tsx           # React entry point
server.ts           # Backend/server entry point
styles.css          # Global styles
docker-compose.yml  # Docker services config
vite.config.ts      # Vite config
```

---

## 🗄️ Database Schema

### users

Stores user account information.

| Column   | Type    | Description     |
| -------- | ------- | --------------- |
| id       | BIGINT  | Primary Key     |
| name     | VARCHAR | User name       |
| password | VARCHAR | Hashed password |
| email    | VARCHAR | Unique email    |
| admin    | BOOLEAN | Admin role      |

### genres

Stores book genres/categories.

| Column | Type    | Description     |
| ------ | ------- | --------------- |
| id     | BIGINT  | Primary Key     |
| name   | VARCHAR | Genre name      |
| number | BIGINT  | Number of books |

### books

Stores books information.

| Column      | Type    | Description      |
| ----------- | ------- | ---------------- |
| id          | INT     | Primary Key      |
| name        | VARCHAR | Book name        |
| author      | VARCHAR | Author           |
| description | TEXT    | Book description |
| price       | FLOAT   | Price            |
| cover       | VARCHAR | Cover image      |
| status      | BOOLEAN | Sold/available   |
| id_genre    | BIGINT  | Genre ID         |

### sold

Stores purchase history.

| Column   | Type   | Description   |
| -------- | ------ | ------------- |
| id       | BIGINT | Primary Key   |
| id_users | BIGINT | User ID       |
| id_books | INT    | Book ID       |
| date     | DATE   | Purchase date |

---

## ⚙️ Installation

### Clone repository

```bash
git clone git@github.com:akbarsalyev03/lokallib.git
cd lokallib
```

### Install dependencies

### Run with Docker

```bash
docker-compose up --build
```

---

## 📌 Future Improvements

* JWT Authentication
* Payment integration
* Search functionality
* Dark mode UI
* Reviews and ratings

---

## 📄 License

This project is licensed under the MIT License.

---

# O‘zbekcha 🇺🇿

JavaScript/TypeScript’da yozilgan to‘liq **online kitob do‘koni** web ilovasi.
Frontend qismi **React + Vite**, backend qismi **Node.js**, **Nginx** orqali servis qilinadi va **MySQL** ma’lumotlar bazasidan foydalanadi.

Bu loyiha foydalanuvchilarga kitoblarni ko‘rish, janr bo‘yicha filtrlash va sotib olish imkonini beradi.
Admin panel orqali kitob va janrlarni boshqarish mumkin.

---

## 🚀 Imkoniyatlari

### Oddiy foydalanuvchi uchun

* Ro‘yxatdan o‘tish va tizimga kirish
* Barcha kitoblarni ko‘rish
* Kitob haqida batafsil ma’lumot olish
* Janr bo‘yicha saralash
* Kitob sotib olish
* Xaridlar tarixini ko‘rish

### Admin uchun

* Kitob qo‘shish / tahrirlash / o‘chirish
* Janrlarni boshqarish
* Kitobni sotilgan yoki mavjud deb belgilash
* Sotilgan kitoblar tarixini ko‘rish

---

## 🛠️ Texnologiyalar

### Frontend

* **React**
* **TypeScript**
* **Vite**
* **CSS**

### Backend

* **Node.js**
* **Express.js** (agar ishlatilgan bo‘lsa)
* **JavaScript / TypeScript**

### Database

* **MySQL**

### Deploy / Infratuzilma

* **Nginx**
* **Docker**
* **Docker Compose**

---

## ⚙️ O‘rnatish

```bash
git clone git@github.com:akbarsalyev03/lokallib.git
cd lokallib
```

Docker bilan ishga tushirish:

```bash
docker-compose up --build
```

---

## 📄 Litsenziya

MIT License asosida.
