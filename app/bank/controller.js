const Bank = require("./model");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alertIcon = req.flash("alertIcon");

      const alert = {
        message: alertMessage,
        status: alertStatus,
        icon: alertIcon,
      };

      const bank = await Bank.find();

      res.render("admin/bank/view_bank", {
        bank,
        alert,
        name: req.session.user.name,
        title: "Halaman bank",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/bank");
    }
  },

  viewCreate: async (req, res) => {
    try {
      res.render("admin/bank/create", {
        name: req.session.user.name,
        title: "Halaman tambah bank",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/bank");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { name, bankName, noRekening } = req.body;

      const bank = await Bank({ name, bankName, noRekening });
      await bank.save();

      req.flash("alertMessage", "Berhasil tambah bank.");
      req.flash("alertStatus", "success");
      req.flash("alertIcon", "check");

      res.redirect("/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/bank");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const bank = await Bank.findOne({ _id: id });

      res.render("admin/bank/edit", {
        bank,
        name: req.session.user.name,
        title: "Halaman ubah bank",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/bank");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, bankName, noRekening } = req.body;

      await Bank.findOneAndUpdate({ _id: id }, { name, bankName, noRekening });

      req.flash("alertMessage", "Berhasil ubah bank.");
      req.flash("alertStatus", "success");
      req.flash("alertIcon", "check");

      res.redirect("/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/bank");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Bank.findOneAndDelete({ _id: id });

      req.flash("alertMessage", "Berhasil hapus bank.");
      req.flash("alertStatus", "success");
      req.flash("alertIcon", "check");
      res.redirect("/bank");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/bank");
    }
  },
};
