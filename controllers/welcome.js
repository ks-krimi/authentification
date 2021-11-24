module.exports.welcome = (req, res, next) => {
  res.send({
    success: true,
    message: "Bienvenu sur le page d'acceuil",
  });
};
