const Player = require("../player/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  signup: async (req, res, next) => {
    try {
      const payload = req.body;

      if (req.file) {
        const tmp_path = req.file.path;
        const originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        const filename = req.file.filename + "." + originalExt;
        const target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const player = new Player({ ...payload, avatar: filename });

            await player.save();

            delete player._doc.password;

            res.status(201).json({ data: player });
          } catch (err) {
            if (err && err.name === "ValidationError") {
              return res.status(422).json({
                error: 1,
                message: err.message,
                fields: err.errors,
              });
            }
            next(err);
          }
        });
      } else {
        let player = new Player(payload);

        await player.save();

        delete player._doc.password;

        res.status(201).json({ data: player });
      }
    } catch (err) {
      if (err && err.name === "ValidationError") {
        return res.status(422).json({
          error: 1,
          message: err.message,
          fields: err.errors,
        });
      }
      next(err);
    }
  },

  signin: (req, res, next) => {
    const { email, password } = req.body;

    Player.findOne({ email: email })
      .then((player) => {
        if (player) {
          const checkPassword = bcrypt.compareSync(password, player.password);

          if (checkPassword) {
            const token = jwt.sign(
              {
                player: {
                  id: player.id,
                  username: player.username,
                  nama: player.nama,
                  phoneNumber: player.phoneNumber,
                  avatar: player.avatar,
                },
              },
              config.jwtKey
            );

            res.status(200).json({ data: { token } });
          } else {
            res.status(403).json({
              message: "Kata sandi salah silahkan cek kembali.",
            });
          }
        } else {
          res.status(403).json({
            message: "Email belum terdaftar.!",
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          message: err.message || `Internal esrver error.`,
        });

        next();
      });
  },
};
