const Mongoose = require("mongoose");

const bankSchema = Mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Nama pemilik harus diisi"],
    },

    bankName: {
      type: String,
      require: [true, "Nama bank harus diisi"],
    },

    noRekening: {
      type: String,
      require: [true, "Nomor rekening harus diisi"],
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Bank", bankSchema);
