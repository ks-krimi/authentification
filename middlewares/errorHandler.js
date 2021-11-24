const CustomError = require("../utils/CustomError");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  /* console.log(err); */

  if (err.code === 11000) {
    const keyValue = Object.values(err.keyValue).map((value) => value);
    const message = JSON.stringify({
      value: keyValue,
      message: `${keyValue} exist déjà dans la base de données`,
    });
    error = new CustomError(message, 400);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((error) =>
      JSON.stringify({
        champ: error.path,
        message: `Le champ ${error.path} est invalide`,
      })
    );
    error = new CustomError(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Erreur du serveur" });
};

module.exports = errorHandler;
