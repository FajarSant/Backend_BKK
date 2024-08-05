const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const { authenticateToken, authorizeRole } = require('./middleware/authmiddleware'); // Sesuaikan path

// Konfigurasi dotenv di awal
dotenv.config();

const PORT = process.env.PORT || 2000;

const app = express();

// Middleware untuk parsing JSON dan URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Middleware untuk CORS
app.use(cors());

// Middleware untuk menyajikan file statis dari direktori uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Import controller
const userController = require("./user/user.controller");
const applicationController = require("./application/application.controller");
const saveJobsController = require("./savejobs/savejobs.controllers");
const jobsController = require("./Jobs/Jobs.controller");
const pelatihanController = require("./pelatihan/pelatihan.controllers");
const authController = require("./auth/auth.controller");

// Route tanpa otorisasi
app.use('/users', userController);
app.use('/application', applicationController);
app.use('/savejobs', saveJobsController);
app.use('/jobs', jobsController);
app.use('/pelatihan', pelatihanController);
app.use('/auth', authController);

// Route dengan otorisasi
app.use('/dashboard', authenticateToken, authorizeRole('ADMIN'), (req, res) => {
  res.send("Welcome to the Admin Dashboard");
});

// Route umum
app.get("/api", (req, res) => {
    res.send("API Sedang Berjalan....");
});

// Jalankan server
app.listen(PORT, () => {
    console.log("Express is running on port:", PORT);
});
