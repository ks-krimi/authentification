const userModel = require("../models/User");
const CustomError = require("../utils/CustomError");

/* route pour le register */
module.exports.register = async (req, res, next) => {
  const { nom, prenom, email, password } = req.body;
  try {
    const user = await userModel.create({ nom, prenom, email, password });
    res.status(201).json({ succes: true, user });
  } catch (error) {
    next(error);
  }
};

/* route pour le login */
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new CustomError(
      "l'email et le mot de passe sont requis",
      400
    );
    next(error);
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
          res.status(200).json({ success: true, user: user._id });
        }
      }
    } catch (error) {
      next(error);
    }
  }
};

/* route pour le mot de passe oublier */
module.exports.forgotpassword = (req, res, next) => {
  res.send("forgot password route");
};

/* route pour le changement mot de passe */
module.exports.resetpassword = (req, res, next) => {
  res.send("reset password route");
};

/* route pour la deconnexion */
module.exports.logout = (req, res, next) => {
  res.send("logout route");
};
