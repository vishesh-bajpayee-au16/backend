require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Import Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
// connect to DB
const { DATABASE_URL } = process.env;

mongoose.connect(
  DATABASE_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Mongoose connected")
);

// MiddleWare
app.use(express.json());

// Route Middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(3000, () => console.log("Server Started"));
