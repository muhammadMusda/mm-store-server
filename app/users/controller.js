const { name } = require("ejs");
const User = require("./model");
const bcrypt = require("bcryptjs");

module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alertIcon = req.flash("alertIcon");

      const alert = {
        message: alertMessage,
        status: alertStatus,
        icon: alertIcon,
      };

      if (req.session.user === null || req.session.user === undefined) {
        res.render("admin/users/view_signin", {
          alert,
          title: "Halaman signin",
        });
      } else {
        res.redirect("/dashboard");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/");
    }
  },

  actionSignin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const check = await User.findOne({ email: email });

      if (check) {
        if (check.status === "Y") {
          const checkPassword = await bcrypt.compare(password, check.password);

          if (checkPassword) {
            req.session.user = {
              id: check._id,
              email: check.email,
              status: check.status,
              name: check.name,
            };
            res.redirect("/dashboard");
          } else {
            req.flash("alertMessage", "Kata sandi salah silahkan cek kembali.");
            req.flash("alertStatus", "danger");
            req.flash("alertIcon", "ban");
            res.redirect("/");
          }
        } else {
          req.flash("alertMessage", "Maaf, status anda belum aktif.");
          req.flash("alertStatus", "danger");
          req.flash("alertIcon", "ban");
          res.redirect("/");
        }
      } else {
        console.log("test 1");
        req.flash("alertMessage", "Email yang anda masukan salah.");
        req.flash("alertStatus", "danger");
        req.flash("alertIcon", "ban");
        res.redirect("/");
      }
    } catch (err) {
      console.log("test");
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/");
    }
  },

  actionLogout: async (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
};
