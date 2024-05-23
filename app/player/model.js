const Mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const HASH_ROUND = 11;

const playerSchema = Mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Email harus diisi"],
    },

    name: {
      type: String,
      require: [true, "Nama harus diisi"],
      maxLength: [225, "panjang nama harus antara 3 - 225 karakter."],
      minLength: [3, "panjang nama harus antara 3 - 225 karakter."],
    },

    username: {
      type: String,
      require: [true, "Password harus diisi"],
      maxLength: [225, "panjang username harus antara 3 - 225 karakter."],
      minLength: [3, "panjang username harus antara 3 - 225 karakter."],
    },

    password: {
      type: String,
      require: [true, "Password harus diisi"],
      maxLength: [225, "panjang password harus antara 6 - 225 karakter."],
      minLength: [6, "panjang password harus antara 6 - 225 karakter."],
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },

    avatar: {
      type: String,
    },

    fileName: {
      type: String,
    },

    phoneNumber: {
      type: String,
      require: [true, "Nomor telpon harus diisi"],
      maxLength: [13, "panjang nomor telpon harus antara 9 - 13 karakter."],
      minLength: [9, "panjang nomor telpon harus antara 9 - 13 karakter."],
    },

    favorite: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

playerSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("Player").countDocuments({ email: value });

      return !count;
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

playerSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

module.exports = Mongoose.model("Player", playerSchema);
