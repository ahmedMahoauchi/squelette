const express = require("express");

const router = express.Router();
const { registerRules, validator } = require("../middleware/validator.js");
const {
  register,
  login,
  updateUser,
  allUsers,
  getSingleUser,
  deleteUser,
  getSingleUserByEmail,
  authorizeRoles,
} = require("./controllers/user.js");
const isAuth = require("../middleware/passport-setup.js");

const Router = express.Router();

Router.post("/register", registerRules(), validator, register);
Router.post("/login", login, authorizeRoles);

Router.get("/current", isAuth(), (req, res) => {
  console.log("req", req);
  res.json(req.user);
});
Router.put("/profile/:id", updateUser);
Router.delete("/delete/:id", deleteUser);

Router.get("/users", allUsers);
Router.get("/user/:id", getSingleUser);
Router.get("/usere/:email", getSingleUserByEmail);

module.exports = Router;
