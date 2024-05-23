const Voucher = require("./model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");

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

      const voucher = await Voucher.find()
        .populate("nominals")
        .populate("category");

      res.render("admin/voucher/view_voucher", {
        voucher,
        alert,
        name: req.session.user.name,
        title: "Halaman voucher",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/voucher");
    }
  },

  viewCreate: async (req, res) => {
    try {
      const category = await Category.find();
      const nominal = await Nominal.find();
      res.render("admin/voucher/create", {
        category,
        nominal,
        name: req.session.user.name,
        title: "Halaman tambah voucher",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/voucher");
    }
  },

  actionCreate: async (req, res) => {
    try {
      const { name, category, nominals } = req.body;

      if (req.file) {
        // Upload image
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
            const voucher = new Voucher({
              name,
              category,
              nominals,
              thumbnail: filename,
            });

            await voucher.save();

            req.flash("alertMessage", "Berhasil tambah voucher.");
            req.flash("alertStatus", "success");
            req.flash("alertIcon", "check");

            res.redirect("/voucher");
          } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            req.flash("alertIcon", "ban");
            res.redirect("/voucher");
          }
        });
      } else {
        const voucher = new Voucher({
          name,
          category,
          nominals,
        });

        await voucher.save();

        req.flash("alertMessage", "Berhasil tambah voucher.");
        req.flash("alertStatus", "success");
        req.flash("alertIcon", "check");

        res.redirect("/voucher");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/voucher");
    }
  },

  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.find();
      const nominal = await Nominal.find();
      const voucher = await Voucher.findOne({ _id: id })
        .populate("nominals")
        .populate("category");

      res.render("admin/voucher/edit", {
        category,
        nominal,
        voucher,
        name: req.session.user.name,
        title: "Halaman ubah voucher",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/voucher");
    }
  },

  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, nominals } = req.body;

      if (req.file) {
        // Upload image
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
            const voucher = await Voucher.findOne({
              _id: id,
            });

            const curentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

            if (fs.existsSync(curentImage)) {
              fs.unlinkSync(curentImage);
            }

            await Voucher.findOneAndUpdate(
              {
                _id: id,
              },
              {
                name,
                category,
                nominals,
                thumbnail: filename,
              }
            );

            req.flash("alertMessage", "Berhasil ubah voucher.");
            req.flash("alertStatus", "success");
            req.flash("alertIcon", "check");

            res.redirect("/voucher");
          } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            req.flash("alertIcon", "ban");
            res.redirect("/voucher");
          }
        });
      } else {
        await Voucher.findOneAndUpdate(
          {
            _id: id,
          },
          {
            name,
            category,
            nominals,
          }
        );

        req.flash("alertMessage", "Berhasil ubah voucher.");
        req.flash("alertStatus", "success");
        req.flash("alertIcon", "check");

        res.redirect("/voucher");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/voucher");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      const voucher = await Voucher.findOneAndDelete({ _id: id });

      const curentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

      if (fs.existsSync(curentImage)) {
        fs.unlinkSync(curentImage);
      }

      req.flash("alertMessage", "Berhasil hapus voucher.");
      req.flash("alertStatus", "success");
      req.flash("alertIcon", "check");
      res.redirect("/voucher");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/voucher");
    }
  },

  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      let voucher = await Voucher.findOne({ _id: id });

      const status = voucher.status === "Y" ? "N" : "Y";

      voucher = await Voucher.findOneAndUpdate(
        {
          _id: id,
        },
        { status }
      );

      req.flash("alertMessage", "Berhasil ubah status.");
      req.flash("alertStatus", "success");
      req.flash("alertIcon", "check");
      res.redirect("/voucher");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      req.flash("alertIcon", "ban");
      res.redirect("/voucher");
    }
  },
};
