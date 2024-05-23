const Mongoose = require("mongoose");

const paymentSchema = Mongoose.Schema(
  {
    type: {
      type: String,
      require: [true, "Tipe pembayaran harus diisi"],
    },

    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },

    banks: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Bank",
      },
    ],
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Payment", paymentSchema);
