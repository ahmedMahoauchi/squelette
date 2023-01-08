const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
mongoose.set("strictQuery", false);

const KiosquesSchema = mongoose.Schema({
  name: String,
  adresse: String,
  coordenation: String,
  image: {
    public_id: { type: String },
    url: { type: String },
  },
  Status: {
    type: Number,
    default: 0,
  },
  usersID: [
    {
      type: ObjectId,
      ref: "user",
    },
  ],
  myService: [
    {
      type: ObjectId,
      ref: "services",
    },
  ],
  myProduit: [
    {
      type: ObjectId,
      ref: "produits",
    },
  ],
});

module.exports = Kiosques = mongoose.model("kiosques", KiosquesSchema);
