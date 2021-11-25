const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { isAlpha, isEmail } = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      maxlength: 50,
      minlength: 3,
      trim: true,
      required: true,
      validate: [isAlpha],
    },
    prenom: {
      type: String,
      maxlength: 50,
      minlength: 3,
      trim: true,
      required: true,
      validate: [isAlpha],
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      validate: [isEmail, "L'email est invalide"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [8, "Huit caractères minimum"],
      select: false,
    },
    restPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpire: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

/* hash le mot de passe avant la sauvegarde du model */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* test si le mot de passe enter est correct ou non */
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/* création d'un nouveau token avec jwt */
userSchema.methods.createToken = function () {
  return jwt.sign({ id: this._id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN || "24h",
  });
};

/* création d'un reset password token avec crypto */
userSchema.methods.getRestPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.restPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const userModel = mongoose.model("userModel", userSchema, "users");

module.exports = userModel;
