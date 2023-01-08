const express = require("express");
//Upload Image
const cloudinary = require("../uploads/cloudinary");
const multer = require("multer");
const fs = require("fs");
const uploader = require("../uploads/multer");

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
  forgotPassword,
  resetPassword,
  addKiosque,
  addMyKiosque,
  seeKiosques,
  deleteKiosque,
  uploadphoto,
  updateKiosque,
  getSingleKiosque,
  uploadphotok,
  seeKiosque0,
  seeKiosque1,
  seeKiosques3,
  addMyService,
  createService,
  addMyProduit,
  createProduit,
  uploadphotoService,
  uploadphotoProduit,
} = require("../controllers/user.js");
const isAuth = require("../middleware/passport-setup.js");
const { application } = require("express");
const upload = require("../uploads/multer.js");

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
Router.put("/forgot-password", forgotPassword);
Router.put("/reset-password", resetPassword);
Router.post("/kiosques/add", addKiosque);
Router.put("/mykiosque/:id", addMyKiosque);
Router.get("/kiosques", seeKiosques);
Router.get("/kiosque1", seeKiosque1);
Router.get("/kiosque0", seeKiosque0);
Router.delete("/deletek/:id", deleteKiosque);
Router.put("/uploadphoto/:id", uploader.single("image"), uploadphoto);
Router.put("/kiosque/:id", updateKiosque);
Router.get("/kiosque/:id", getSingleKiosque);
Router.put("/uploadphotok/:id", uploader.single("image"), uploadphotok);
Router.get("/kiosques3", seeKiosques3);
Router.post("/service/add", uploader.single("image"), createService);
Router.post("/produit/add", createProduit);
Router.put(
  "/uploadphotoService/:_id",
  uploader.single("image"),
  uploadphotoService
);
Router.put(
  "/uploadphotoProduit/:_id",
  uploader.single("image"),
  uploadphotoProduit
);

Router.put("/MyService/:id", addMyService);
Router.put("/MyProduit/:id", addMyProduit);

module.exports = Router;
