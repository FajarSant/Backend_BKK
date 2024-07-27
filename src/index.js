const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');

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
const jobsController = require("./jobs/jobs.controller");
const pelatihanController = require("./pelatihan/pelatihan.controller");
const authController = require("./auth/auth.controller");

// Route
app.use('/users', userController);
app.use('/application', applicationController);
app.use('/savejobs', saveJobsController);
app.use('/jobs', jobsController);
app.use('/pelatihan', pelatihanController);
app.use('/auth', authController);

app.get("/api", (req, res) => {
    res.send("API Sedang Berjalan....");
});

app.listen(PORT, () => {
    console.log("Express is running on port:", PORT);
});
