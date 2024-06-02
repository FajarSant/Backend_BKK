const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");

const PORT = process.env.PORT || 2000;

const app = express();


app.use(cors());
app.use(express.json());

dotenv.config();

const usercontroller = require("./user/user.controller");
app.use('/users', usercontroller);

const Jobscontroller = require("./Jobs/Jobs.controller");
app.use('/jobs', Jobscontroller);

const postcontrollers = require("./post/post.controller");
app.use('/posts', postcontrollers);

const authController = require("./auth/auth.controller");
app.use('/auth', authController);

app.get("/api", (req, res) => {
    res.send("API Sedang Berjalan....");
});

app.listen(PORT, () => {
    console.log("Express is running on port:", PORT);
});
