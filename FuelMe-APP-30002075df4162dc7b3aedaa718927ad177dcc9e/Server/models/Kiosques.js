const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const KiosquesSchema = mongoose.Schema({
  name: String,
  adresse: String,
  coordenation: String,
  image: String,
  Service: [
    {
      name: String,
      price: Number,
      status: Boolean,
      image: String,
    },
  ],
  Produit: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  usersID: [
    {
      type: ObjectId,
      ref: "user",
    },
  ],
});

module.exports = Kiosques = mongoose.model("kiosques", KiosquesSchema);
