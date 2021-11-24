/*
 * import du ficher .env
 * doit etre importer au premier
 */
require("dotenv").config({ path: "./.env" });

/*
 * mongoDb config.
 * doit etre importer après le dotenv
 */
require("./config/db_conf");

const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/auth.routes");
const welcome = require("./routes/welcome.routes");

/* initialisation de l'express */
const app = express();

/*
 * middleware qui convertis les requetes en json,
 * pour que req.body ne soit pas undefined
 */
app.use(express.json());

/* les routes */
app.use("/api/auth", authRoutes);
app.use("/api/welcome", welcome);

/*
 * middleware erreur, renvoi les messages d'erreurs et le status code
 * doit etre placer au dessous de tout les routes
 */
app.use(errorHandler);

/* lancement du serveur */
const server = app.listen(process.env.PORT, () => {
  console.log("Le serveur démmare sur le port", process.env.PORT);
});

/* déclanche lorsqu'il y a un ou plusieurs erreurs */
process.on("unhandledRejection", (err, promess) => {
  console.error("Error log:", err);
  server.close(() => {
    process.exit(1);
  });
});
