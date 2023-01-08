const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
mongoose.set("strictQuery", false);

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  CIN: String,
  image: {
    public_id: { type: String },
    url: { type: String },
  },
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
  resetLink: {
    data: String,
    default: "",
  },
});

module.exports = User = mongoose.model("user", userSchema);
