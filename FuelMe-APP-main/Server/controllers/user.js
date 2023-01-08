const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("config");
const secretOrkey = config.get("secretOrkey");
const RESET_PWD_KEY = config.get("RESET_PWD_KEY");
const Client_URL = config.get("Client_URL");

//MAILGUN
const MAILGUN_APIKEY = config.get("MAILGUN_APIKEY");
const mailgun = require("mailgun-js");
const Kiosques = require("../models/Kiosques.js");
const DOMAIN = "sandboxeb36adf6840d4394aa95d65c4a41a24e.mailgun.org";
const mg = mailgun({ apiKey: MAILGUN_APIKEY, domain: DOMAIN });

//Upload Image
const cloudinary = require("../uploads/cloudinary");
const multer = require("multer");
const fs = require("fs");
const uploader = require("../uploads/multer");
const Services = require("../models/Services.js");
const Produits = require("../models/Produits.js");
exports.getUser = async (req, res) => {
  try {
    const UserMessages = await UserMessage.find();
    console.log(UserMessages);
    res.status(200).json(UserMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.addUser = async (req, res) => {
  const user = req.body;
  const newUser = new UserMessage(user);
  try {
    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
//Get User with id
exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      succes: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Get User with email
exports.getSingleUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.status(200).json({
      succes: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Register User
exports.register = async (req, res) => {
  const { name, email, password, CIN, role } = req.body;

  try {
    const searchRes = await User.findOne({ email });
    if (searchRes)
      return res
        .status(401)
        .json({ msg: `Utilisateur existant , utiliser un autre E-mail` });

    const data = {
      from: "noreply@hello.com",
      to: email,
      subject: "Hello",
      html: `<h2>Welcome ${name}</h2>
      <h4><p>Your email is :</h4> ${email}</br><h4>National Identity :</h4> ${CIN}</p>`,
    };
    mg.messages().send(data, function (error, body) {
      console.log(body);
    });

    const newUser = new User({
      name,
      email,
      password,
      CIN,
      role,
    });

    //const salt = await bcrypt.genSalt(10);
    //const hash = await bcrypt.hash(password, salt);
    //newUser.password = hash;

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};

// Login User

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ msg: `Email ou mot de passe incorrect` });
    const isMatch = await (password == user.password);
    if (!isMatch)
      return res.status(401).json({ msg: `Email ou mot de passe incorrect` });

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    const token = await jwt.sign(payload, secretOrkey);
    return res.status(200).json({ token: `Bearer ${token}`, user });
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};
// Update User
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, CIN, image } = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      name,
      email,
      phoneNumber,
      CIN,
      image,
    });

    return res.status(201).json({
      msg: "L'utilisateur a été modifié avec succès",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Handle user roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const user = User.findById(req.params.id);
    if (!roles.includes(user.role)) {
      return next(
        res.status(403).json({
          msg: `Role (${user.role}) is not allowed to acces this resource`,
        })
      );
    }
  };
};

// Get all users
exports.allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      users,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "utilisateur supprimé avec succès" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: "user with this email doesnot exist" });
    }
    const token = jwt.sign({ _id: user._id }, RESET_PWD_KEY, {
      expiresIn: "20m",
    });
    const data = {
      from: "noreply@activation-key.com",
      to: email,
      subject: "Account Activation link",
      html: `<h2>Please click on given link to reset your account</h2>
      <link><p>${Client_URL}/resetpassword/${token}</p></link>`,
    };
    return user.updateOne({ resetLink: token }, function (err, success) {
      if (err) {
        return res.status(400).json({ error: "reset password link error" });
      } else {
        mg.messages().send(data, function (error, body) {
          if (error) {
            return res.json({ error: err.message });
          }
          return res.json({
            message: "Email has been sent , kindly activate your account",
          });
        });
      }
    });
  });
};

exports.resetPassword = async (req, res) => {
  const { resetLink, newPass } = req.body;
  if (resetLink) {
    jwt.verify(resetLink, RESET_PWD_KEY, function (err, decodedData) {
      if (err) {
        return res.status(401).json({ err: "Incorrect token/expired" });
      }
      User.findOne({ resetLink }, (err, user) => {
        if (err || !user) {
          return res
            .status(400)
            .json({ error: "User with this token does not exist" });
        }

        const obj = { password: newPass, resetLink: "" };
        user = _.extend(user, obj);

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({ error: "reset password error" });
          } else {
            return res.status(200).json({
              message: "Your password has been changed",
            });
          }
        });
      });
    });
  } else {
    return res.status(401).json({ error: "Authentication error" });
  }
};

//Add kiosque by admin
exports.addKiosque = async (req, res) => {
  const { name, adresse, coordenation } = req.body;
  try {
    const newKiosq = new Kiosques({
      name,
      adresse,
      coordenation,
      usersID: req.user,
    });
    await newKiosq.save();
    res.status(201).json(newKiosq);
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};

//Change Kiosque status (Accepted/Denied)
exports.updateKiosque = async (req, res) => {
  try {
    const { Status } = req.body;
    const updatedKiosque = await Kiosques.findByIdAndUpdate(req.params.id, {
      Status,
    });
    return res.status(201).json({
      msg: "Le kiosque a été modifié avec succès",
      kiosque: updatedKiosque,
    });
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};

//Add Kiosque to a User
exports.addMyKiosque = async (req, res) => {
  const userId = req.params.id;
  const { kiosqueId } = req.body;
  console.log("🚀  kiosqueId", kiosqueId);

  try {
    const searchedUser = await User.findOne({ _id: userId });
    //console.log(searchedUser);
    searchedUser.myKiosque.push(kiosqueId);
    const user = await User.findByIdAndUpdate(userId, searchedUser, {
      strictPopulate: false,
      new: true,
      useFindAndModify: false,
    }).populate({ path: "myKiosque", model: Kiosques });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: error.message });
  }
};
//Get all kiosques
exports.seeKiosques = async (req, res) => {
  try {
    const allKiosques = await Kiosques.find();
    res.send(allKiosques);
  } catch (error) {
    res.status(500).json({ errors: error.message });
  }
};
//Get 3 kiosques
exports.seeKiosques3 = async (req, res) => {
  try {
    const allKiosques = await Kiosques.find().limit(3);
    res.send(allKiosques);
  } catch (error) {
    res.status(500).json({ errors: error.message });
  }
};

//Get kiosque with status 1
exports.seeKiosque1 = async (req, res) => {
  try {
    const allKiosques = await Kiosques.find({ Status: 1 });
    res.send(allKiosques);
  } catch (error) {
    res.status(500).json({ errors: error.message });
  }
};
//Get with status 0
exports.seeKiosque0 = async (req, res) => {
  try {
    const allKiosques = await Kiosques.find({ Status: 0 });
    res.send(allKiosques);
  } catch (error) {
    res.status(500).json({ errors: error.message });
  }
};
//Delete kiosque
exports.deleteKiosque = async (req, res) => {
  try {
    await Kiosques.findByIdAndDelete(req.params.id);
    console.log(req.params.id);
    res.json({ msg: "kiosque supprimé avec succès" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Get Kiosque by ID
exports.getSingleKiosque = async (req, res) => {
  try {
    const kiosque = await Kiosques.findById(req.params.id)
      .populate({
        path: "myService",
      })
      .populate({ path: "myProduit" });
    res.status(200).json({
      succes: true,
      kiosque,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//upload to user
exports.uploadphoto = async (req, res) => {
  try {
    const image = await cloudinary.v2.uploader.upload(req.file.path);
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      image,
    });
    res.json({
      success: true,
      file: image.secure_url,
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//upload to kiosque
exports.uploadphotok = async (req, res) => {
  try {
    const image = await cloudinary.v2.uploader.upload(req.file.path);
    const updatedKiosque = await Kiosques.findByIdAndUpdate(req.params.id, {
      image,
    });
    res.json({
      success: true,
      file: image.secure_url,
      kiosque: updatedKiosque,
    });
    // console.log(image);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Create Service
exports.createService = async (req, res) => {
  const { name, price, status, image } = req.body;
  try {
    const newService = new Services({
      name,
      price,
      status,
      image,
    });
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};
//Create Produit
exports.createProduit = async (req, res) => {
  const { name, price, status, image } = req.body;
  try {
    const newProduit = new Produits({
      name,
      price,
      status,
      image,
    });
    await newProduit.save();
    res.status(201).json(newProduit);
  } catch (error) {
    res.status(500).json({ errors: error });
  }
};

//upload image to service
exports.uploadphotoService = async (req, res) => {
  try {
    const image = await cloudinary.v2.uploader.upload(req.file.path);
    const updatedService = await Services.findByIdAndUpdate(req.params._id, {
      image,
    });
    res.json({
      success: true,
      file: image.secure_url,
      service: updatedService,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//upload image to produit
exports.uploadphotoProduit = async (req, res) => {
  try {
    const image = await cloudinary.v2.uploader.upload(req.file.path);
    const updatedProduit = await Produits.findByIdAndUpdate(req.params._id, {
      image,
    });
    res.json({
      success: true,
      file: image.secure_url,
      updatedProduit,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

//Add Service to a Kiosque
exports.addMyService = async (req, res) => {
  const kiosqueId = req.params.id;
  const { serviceId } = req.body;
  console.log("🚀  ServiceIdd", serviceId);

  try {
    const searchedKiosque = await Kiosques.findByIdAndUpdate(kiosqueId, {
      $push: { myService: serviceId },
    })
      .populate({
        path: "myService",
      })
      .populate({ path: "myProduit" });

    return res.status(200).json(searchedKiosque);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: error.message });
  }
};

//Add Produit to a Kiosque
exports.addMyProduit = async (req, res) => {
  const kiosqueId = req.params.id;
  const { produitId } = req.body;
  console.log("🚀  ProduitId", produitId);

  try {
    const searchedKiosque = await Kiosques.findByIdAndUpdate(kiosqueId, {
      $push: { myProduit: produitId },
    })
      .populate({
        path: "myProduit",
      })
      .populate({ path: "myService" });

    return res.status(200).json(searchedKiosque);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: error.message });
  }
};
