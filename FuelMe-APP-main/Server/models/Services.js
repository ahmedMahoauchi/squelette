const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
mongoose.set("strictQuery", false);

const ServicesSchema = mongoose.Schema({
  name: String,
  price: Number,
  status: Boolean,
  image: {
    public_id: { type: String },
    url: { type: String },
  },
  kiosquesID: {
    type: ObjectId,
    ref: "kiosques",
  },
});
module.exports = Kiosques = mongoose.model("services", ServicesSchema);
