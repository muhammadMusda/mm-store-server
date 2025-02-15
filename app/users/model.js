const Mongoose = require("mongoose");

const userSchema = Mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Email harus diisi"],
    },

    name: {
      type: String,
      require: [true, "Nama harus diisi"],
    },

    password: {
      type: String,
      require: [true, "Password harus diisi"],
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },

    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },

    phoneNumber: {
      type: String,
      require: [true, "Nomor telpon harus diisi"],
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("User", userSchema);
