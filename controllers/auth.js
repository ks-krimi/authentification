/* route pour le register */
module.exports.register = (req, res, next) => {
  res.send("register route");
};

/* route pour le login */
module.exports.login = (req, res, next) => {
  res.send("login route");
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
