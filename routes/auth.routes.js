const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  forgotpassword,
  resetpassword,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.route("/forgotpassword").post(forgotpassword);
router.route("/resetpassword/:resetToken").put(resetpassword);
router.route("/logout").get(logout);

module.exports = router;
