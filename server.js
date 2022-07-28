const express = require("express");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Permet de récupérer les variables d'env
require("dotenv").config({ path: "./config/.env" });
require("./config/db");

//Miidleware
const { checkUser, requireAuth } = require("./middleware/auth.middleware");

const app = express();

//Autorise les requêtes extérieur

const corsOptions={
  origin: process.env.CLIENT_URL,
  credentials: true,
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId', 'Content-Type'],
  'methods': 'GET, POST, PUT, PATCH, DELETE, HEAD',
  'preflightContinue': false
}
app.use(cors(corsOptions));

// Body parser pour traiter les bodys
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//jwt
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// Serveur
app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
