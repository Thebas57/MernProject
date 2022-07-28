const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://"+process.env.DB_USER_PATH+"@cluster0.xbu8cpo.mongodb.net/mern-project",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("Connected to MongDb"))
  .catch((error) => console.log("Failed to connect to MongDb", error));
