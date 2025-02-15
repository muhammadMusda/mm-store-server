const mongoose = require("mongoose");

const nominalSchema = mongoose.Schema(
  {
    coinName: {
      type: String,
      require: [true, "Nama koin harus diisi"],
    },

    coinQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nominal", nominalSchema);
