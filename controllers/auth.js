const userModel = require("../models/User");

/* route pour le register */
module.exports.register = async (req, res, next) => {
  const { nom, prenom, email, password } = req.body;
  try {
    const user = await userModel.create({ nom, prenom, email, password });
    res.status(201).json({ succes: true, user });
  } catch (error) {
    res.status(500).json({ succes: false, error: error.message });
  }
};

/* route pour le login */
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ succes: false, error: "email ou password sont requis" });
  } else {
    try {
      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        res
          .status(404)
          .json({ succes: false, error: "Utilisateur n'existe pas" });
      } else {
        const isMatched = await user.matchPassword(password);
        if (!isMatched) {
          res
            .status(404)
            .json({ success: false, error: "Mot de passe incorrect" });
        } else {
          res.status(200).json({ success: true, user: user._id });
        }
      }
    } catch (error) {
      res.status(500).json({ succes: false, error: error.message });
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
