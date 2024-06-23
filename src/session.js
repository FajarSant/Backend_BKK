// session.js

const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const prisma = require("../db");

dotenv.config();

const app = express();

// Konfigurasi session
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'secret', // Secret untuk signing session ID cookie
  resave: false, // Jangan menyimpan ulang session jika tidak ada perubahan
  saveUninitialized: true, // Simpan session meskipun belum diinisialisasi
  cookie: {
    secure: false, // Set true jika menggunakan HTTPS
    maxAge: 24 * 60 * 60 * 1000, // Waktu maksimum cookie session dalam milidetik (24 jam contohnya)
  },
  store: new PrismaSessionStore({
    // Menggunakan PrismaClient untuk menyimpan session ke database
    db: prisma,
    checkPeriod: 2 * 60 * 1000, // Setiap 2 menit, periksa session yang kadaluwarsa dan hapus dari basis data
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
};

app.use(session(sessionConfig));

module.exports = app;
