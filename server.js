/* import du ficher .env */
require("dotenv").config({ path: "./.env" });

const express = require("express");
const authRoutes = require("./routes/auth.routes");

/* middleware qui convertissent les requetes en json */
const app = express(express.json());

/* les routes */
app.use("/api/auth", authRoutes);

/* lancement du serveur */
const server = app.listen(process.env.PORT, () => {
  console.log("Le serveur démmare sur le port", process.env.PORT);
});

/* déclanche lorsqu'il y a un ou plusieurs erreurs */
process.on("unhandledRejection", (err, promess) => {
  console.log("Il y a ces erreurs:", err);
  server.close(() => {
    process.exit(1);
  });
});
