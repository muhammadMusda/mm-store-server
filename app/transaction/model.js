const Mongoose = require("mongoose");

const transactionSchema = Mongoose.Schema(
  {
    tax: {
      type: Number,
      dafault: 0,
    },

    value: {
      type: Number,
      dafault: 0,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    historyVoucherTopup: {
      gameName: { type: String, require: [true, "nama game harus diisi."] },
      category: {
        type: String,
        require: [true, "kategori harus diisi."],
      },
      thumbnail: { type: String },
      coinName: { type: String, require: [true, "nama koin harus diisi."] },
      coinQuantity: {
        type: String,
        require: [true, "jumlah koin harus diisi."],
      },
      price: { type: Number },
    },

    historyPayment: {
      type: { type: String, require: [true, "tipe pembayaran harus diisi."] },
      bankName: { type: String, require: [true, "nama bank harus diisi."] },
      name: { type: String, require: [true, "nama harus diisi."] },
      noRekening: {
        type: String,
        require: [true, "nomor rekening harus diisi."],
      },
    },

    user: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    historyUser: {
      name: { type: String, require: [true, "nama player harus diisi."] },
      phoneNumber: {
        type: Number,
        require: [true, "nomor telpon harus diisi."],
        maxLength: [13, "panjang nama harus antara 9 - 13 karakter"],
        minLength: [9, "panjang nama harus antara 9 - 13 karakter"],
      },
    },

    category: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    name: {
      type: String,
      require: [true, "nama harus diisi."],
      maxLength: [225, "panjang nama harus antara 3 - 225 karakter."],
      minLength: [3, "panjang nama harus antara 3 - 225 karakter."],
    },

    accountUser: {
      type: String,
      require: [true, "nama akun harus diisi."],
      maxLength: [225, "panjang nama harus antara 3 - 225 karakter."],
      minLength: [3, "panjang nama harus antara 3 - 225 karakter."],
    },

    player: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Transaction", transactionSchema);
