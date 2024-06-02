const express = require("express");
const router = express.Router();
const { authUser, GetUserById } = require("./auth.service");
const {
  verifyToken,
  validateLoginInput,
  isAdmin,
  getUser,
} = require("../middleware/auth.middleware");

router.post("/login", validateLoginInput, async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authUser(email, password);
    if (!result) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const { user, token } = result;
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await GetUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = router;
