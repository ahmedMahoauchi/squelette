const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  CIN: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  role: {
    type: Number,
    default: 0,
  },
  myKiosque: [
    {
      type: ObjectId,
      ref: "kiosques",
    },
  ],
});

module.exports = User = mongoose.model("user", userSchema);
