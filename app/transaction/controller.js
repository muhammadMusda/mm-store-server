const Transaction = require("./model");

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

      const transaction = await Transaction.find().populate("player");

      res.render("admin/transaction/view_transaction", {
        transaction,
        alert,
        name: req.session.user.name,
        title: "Halaman transaksi",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/transaction");
    }
  },

  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.query;

      await Transaction.findOneAndUpdate(
        {
          _id: id,
        },
        { status }
      );

      req.flash("alertMessage", "Berhasil ubah status.");
      req.flash("alertStatus", "success");
      req.flash("alertIcon", "check");
      res.redirect("/transaction");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/transaction");
    }
  },
};
