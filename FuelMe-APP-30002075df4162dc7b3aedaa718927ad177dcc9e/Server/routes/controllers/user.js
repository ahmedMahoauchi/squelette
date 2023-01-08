const User = require("../../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const secretOrkey = config.get("secretOrkey");

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
    const user = await User.findOne({email:req.params.email});
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
  const { name, email, password, CIN } = req.body;

  try {
    const searchRes = await User.findOne({ email });
    if (searchRes)
      return res
        .status(401)
        .json({ msg: `Utilisateur existant , utiliser un autre E-mail` });

    const newUser = new User({
      name,
      email,
      password,
      CIN,
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    newUser.password = hash;

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
    const isMatch = await bcrypt.compare(password, user.password);
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
    const { name, email, phoneNumber, CIN } = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      name,
      email,
      phoneNumber,
      CIN,
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
    await User.findByIdAndDelete(req.params._id);
    res.json({ msg: "utilisateur supprimé avec succès" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
