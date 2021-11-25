const userModel = require("../models/User");
const CustomError = require("../utils/CustomError");
const { sendEmailWithSgMail } = require("../utils/sendEmail");
const crypto = require("crypto");

/* route pour le register */
module.exports.register = async (req, res, next) => {
  const { nom, prenom, email, password } = req.body;
  try {
    const user = await userModel.create({ nom, prenom, email, password });
    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/* route pour le login */
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new CustomError("l'email et le mot de passe sont requis", 400));
  } else {
    try {
      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        const error = new CustomError("l'utilisateur n'existe pas", 404);
        next(error);
      } else {
        const isMatched = await user.matchPassword(password);
        if (!isMatched) {
          const error = new CustomError("le mot de passe est incorrect", 400);
          next(error);
        } else {
          sendToken(user, 200, res);
        }
      }
    } catch (error) {
      next(error);
    }
  }
};

/* route pour le mot de passe oublier */
module.exports.forgotpassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      next(new CustomError("l'email ne peut pas etre envoyer", 404));
    } else {
      const resetToken = user.getRestPasswordToken();
      await user.save();
      const resetUrl = `${process.env.ORIGIN}/resetpassword/${resetToken}`;

      const message = `
        <h1>Vous avez demandé de réinitialiser votre mot de passe</h1>
        <p>S'il vous plait, veuiller suivre ce lien pour réinitialiser votre mot de passe.</p>
        <p>Ce lien sera expirer dans 15 minutes.</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
      `;

      sendEmailWithSgMail({
        to: user.email,
        subject: "Réinitialisation de mot de passe",
        html: message,
      })
        .then(() => {
          res
            .status(200)
            .json({ success: true, message: "l'email est envoyé" });
        })
        .catch(async (error) => {
          user.restPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          await user.save();
          next(new CustomError("l'email ne peut pas etre envoyer", 500));
        });
    }
  } catch (error) {
    next(error);
  }
};

/* route pour réinitialiser le mot de passe */
module.exports.resetpassword = async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
    const user = await userModel.findOne({
      restPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      next(new CustomError("Token invalide ou expirer", 400));
    } else {
      user.password = req.body.password;
      user.restPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res
        .status(201)
        .json({ success: true, message: "mot de passe réinitialiser" });
    }
  } catch (error) {
    next(error);
  }
};

/* route pour la deconnexion */
module.exports.logout = (req, res, next) => {
  res.send("logout route");
};

const sendToken = (user, statusCode, res) => {
  const token = user.createToken();
  res.status(statusCode).json({ success: true, token });
};
