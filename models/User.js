const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isAlpha, isEmail } = require("validator");

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
  const salt = bycript.genSalt();
  this.password = bcrypt.hash(this.password, salt);
  next();
});

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;