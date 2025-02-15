const Payment = require("./model");
const Bank = require("../bank/model");

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

      const payment = await Payment.find().populate("banks");

      res.render("admin/payment/view_payment", {
        payment,
        alert,
        name: req.session.user.name,
        title: "Halaman jenis pembayaran",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/payment");
    }
  },

  viewCreate: async (req, res) => {
    try {
      const banks = await Bank.find();
      res.render("admin/payment/create", {
        banks,
        name: req.session.user.name,
        title: "Halaman tambah jenis pembayaran",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/payment");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { banks, type } = req.body;

      const payment = await Payment({ banks, type });
      await payment.save();

      req.flash("alertMessage", "Berhasil tambah jenis pembayaran.");
      req.flash("alertStatus", "success");
      req.flash("alertIcon", "check");

      res.redirect("/payment");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/payment");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const payment = await Payment.findOne({ _id: id }).populate("banks");
      const banks = await Bank.find();

      res.render("admin/payment/edit", {
        payment,
        banks,
        name: req.session.user.name,
        title: "Halaman ubah jenis pembayaran",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/payment");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { banks, type } = req.body;

      await Payment.findOneAndUpdate({ _id: id }, { banks, type });

      req.flash("alertMessage", "Berhasil ubah jenis pembayaran.");
      req.flash("alertStatus", "success");
      req.flash("alertIcon", "check");

      res.redirect("/payment");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/payment");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Payment.findOneAndDelete({ _id: id });

      req.flash("alertMessage", "Berhasil hapus payment.");
      req.flash("alertStatus", "success");
      req.flash("alertIcon", "check");
      res.redirect("/payment");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/payment");
    }
  },

  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      let payment = await Payment.findOne({ _id: id });

      const status = payment.status === "Y" ? "N" : "Y";

      payment = await Payment.findOneAndUpdate(
        {
          _id: id,
        },
        { status }
      );

      req.flash("alertMessage", "Berhasil ubah status.");
      req.flash("alertStatus", "success");
      req.flash("alertIcon", "check");
      res.redirect("/payment");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/payment");
    }
  },
};
