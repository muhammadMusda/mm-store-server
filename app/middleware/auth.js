const config = require("../../config");
const jwt = require("jsonwebtoken");
const Player = require("../player/model");

module.exports = {
  isLoginAdmin: (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash(
        "alertMessage",
        "Maaf, sesi anda telah habis, silahkan login kembali"
      );
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/");
    } else {
      next();
    }
  },

  isLoginPlayer: async (req, res, next) => {
    try {
      const token = req.headers.authorization
        ? req.headers.authorization.replace("Bearer ", "")
        : null;

      const data = jwt.verify(token, config.jwtKey);

      const player = await Player.findOne({ _id: data.player.id });

      if (!player) {
        res.status(404).json({ message: "player._id not found" });
      }

      req.player = player;
      req.token = token;
      next();
    } catch (eror) {
      res.status(401).json({
        error: "Not authorized to acces this resousce",
      });
    }
  },
};
