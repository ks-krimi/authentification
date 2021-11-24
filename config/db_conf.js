const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) {
      console.log(
        "Le serveur est maintenant connecté à la base de données: " +
          process.env.MONGO_URI.split("/")[3]
      );
    } else console.log("MongoDb error : " + err);
  }
);
