const router = require("express").Router();
const UserModel = require("../models/Users");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  // LETS VALIDATE A DATA BEFORE WE MAKE A USER
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // CHECKING IF USER IS ALREADY IN DATABASE
  const emailExist = await UserModel.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  // HASG THE PASSWORD

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  // VALIDATE DATA BEFORE WE LOGIN USER
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // CHECKING IF EMAIL EXISTS IN DATABASE
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is not found ");
  //  PASSWORD IS CORRECT
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password");

  // CREATE AND ASSIGN A TOKIN

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);

  // res.send("Logged in! ");
});
module.exports = router;
