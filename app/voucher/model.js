const Mongoose = require("mongoose");

const voucherSchema = Mongoose.Schema({
  name: {
    type: String,
    require: [true, "Nama game harus diisi"],
  },

  status: {
    type: String,
    enum: ["Y", "N"],
    default: "Y",
  },

  thumbnail: {
    type: String,
  },

  category: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  nominals: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Nominal",
    },
  ],

  user: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Mongoose.model("Voucher", voucherSchema);
