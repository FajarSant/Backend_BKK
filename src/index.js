const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 2000;

const bodyParser = require('body-parser');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use(cors());
app.use(express.json());

dotenv.config();

// Middleware untuk parsing JSON dan URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk menyajikan file statis dari direktori uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const usercontroller = require("./user/user.controller");
app.use('/users', usercontroller);

const applicationcontroller = require("./application/application.controller");
app.use('/application', applicationcontroller)

const savejobscontroller = require("./savejobs/savejobs.controllers");
app.use('/savejobs', savejobscontroller)

const Jobscontroller = require("./Jobs/Jobs.controller");
app.use('/jobs', Jobscontroller);

const pelatihancontroller = require("./pelatihan/pelatihan.controllers");
app.use('/pelatihan', pelatihancontroller);

const authController = require("./auth/auth.controller");
app.use('/auth', authController);

app.get("/api", (req, res) => {
    res.send("API Sedang Berjalan....");
});

app.listen(PORT, () => {
    console.log("Express is running on port:", PORT);
});
