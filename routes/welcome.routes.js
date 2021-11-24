const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth");
const { welcome } = require("../controllers/welcome");

router.route("/").get(protect, welcome);

module.exports = router;
