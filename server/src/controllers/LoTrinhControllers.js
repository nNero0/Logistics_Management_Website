import { LoTrinh, KhoBai, ChiTietLoTrinh } from "../models/index.js";
import sequelize from "../db/db.js";

const checkAlias = (model, alias) => {
  if (!model.associations[alias]) {
    console.warn(
      `Warning: Model '${model.name}' does not have an association named '${alias}'. Please check your model definition.`
    );
  }
};

const LoTrinhControllers = {
  async CreateLoTrinh(req, res) {
    console.log("CREATE Lo trinh RECEIVED:", req.body);

    const { TenLoTrinh, trangThai, etc, khoangCach, dsKhoBai } = req.body;

    if (!TenLoTrinh || !dsKhoBai || !Array.isArray(dsKhoBai) || dsKhoBai.length < 2) {
      return res
        .status(400)
        .json({ message: "Dữ liệu không hợp lệ. Cần 'TenLoTrinh' và 'dsKhoBai' (mảng có ít nhất 2 kho)." });
    }

    const t = await sequelize.startUnmanagedTransaction();

    try {
      const IdKhoBaiBatDau = dsKhoBai[0];
      const IdKhoBaiKetThuc = dsKhoBai[dsKhoBai.length - 1];

      const newLoTrinh = await LoTrinh.create(
        {
          TenLoTrinh: TenLoTrinh,
          IdKhoBaiBatDau: IdKhoBaiBatDau,
          IdKhoBaiKetThuc: IdKhoBaiKetThuc,
          TrangThai: trangThai,
          ETC: etc,
          KhoangCach: khoangCach,
        },
        { transaction: t }
      );
      const newIdLoTrinh = newLoTrinh.IdLoTrinh;
      console.log(newLoTrinh);

      const chiTietData = dsKhoBai.map((idKho, index) => {
        return {
          IdLoTrinh: newIdLoTrinh,
          IdKhoBai: idKho,
          ThuTu: index + 1,
        };
      });

      await ChiTietLoTrinh.bulkCreate(chiTietData, { transaction: t });

      await t.commit();

      res.status(201).json(newLoTrinh);
    } catch (error) {
      await t.rollback();
      console.error("Lo Trinh creation error:", error);
      res.status(500).json({ message: "Error creating Lo Trinh.", error: error.message });
    }
  },

  async getAllLoTrinh(req, res) {
    try {
      checkAlias(LoTrinh, "khoBatDau");
      checkAlias(LoTrinh, "khoKetThuc");
      checkAlias(LoTrinh, "chiTietLoTrinhs");
      checkAlias(ChiTietLoTrinh, "khoBai");

      const allLoTrinh = await LoTrinh.findAll({
        order: [["TenLoTrinh", "ASC"]],
        include: [
          {
            model: KhoBai,
            as: "khoBatDau",
            attributes: ["DiaChi"],
          },

          {
            model: KhoBai,
            as: "khoKetThuc",
            attributes: ["DiaChi"],
          },

          {
            model: ChiTietLoTrinh,
            as: "chiTietLoTrinhs",
            order: [["ThuTu", "ASC"]],
            include: {
              model: KhoBai,
              as: "khoBai",
              attributes: ["DiaChi"],
            },
          },
        ],
      });

      res.status(200).json(allLoTrinh);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lộ trình:", error);
      res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
    }
  },


  async getLoTrinhById(req, res) {
    try {
      const { id } = req.params;
      const loTrinh = await LoTrinh.findByPk(id, {
        include: [
          { model: KhoBai, as: "khoBatDau", attributes: ["DiaChi"] },
          { model: KhoBai, as: "khoKetThuc", attributes: ["DiaChi"] },
          {
            model: ChiTietLoTrinh,
            as: "chiTietLoTrinhs",
            order: [["ThuTu", "ASC"]],
            include: {
              model: KhoBai,
              as: "khoBai",
              attributes: ["DiaChi"],
            },
          },
        ],
      });

      if (!loTrinh) {
        return res.status(404).json({ message: "Không tìm thấy lộ trình." });
      }
      res.status(200).json(loTrinh);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết lộ trình:", error);
      res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
    }
  },

  async updateLoTrinh(req, res) {
    const { id } = req.params;
    const { TenLoTrinh, trangThai, etc, khoangCach, dsKhoBai } = req.body;

    if (!TenLoTrinh || !dsKhoBai || !Array.isArray(dsKhoBai) || dsKhoBai.length < 2) {
      return res
        .status(400)
        .json({ message: "Dữ liệu không hợp lệ. Cần 'TenLoTrinh' và 'dsKhoBai' (mảng có ít nhất 2 kho)." });
    }

    const t = await sequelize.transaction();
    try {
      const loTrinh = await LoTrinh.findByPk(id);
      if (!loTrinh) {
        await t.rollback();
        return res.status(404).json({ message: "Không tìm thấy lộ trình." });
      }

      const IdKhoBaiBatDau = dsKhoBai[0];
      const IdKhoBaiKetThuc = dsKhoBai[dsKhoBai.length - 1];

      await loTrinh.update(
        {
          TenLoTrinh: TenLoTrinh,
          IdKhoBaiBatDau: IdKhoBaiBatDau,
          IdKhoBaiKetThuc: IdKhoBaiKetThuc,
          TrangThai: trangThai,
          ETC: etc,
          KhoangCach: khoangCach,
        },
        { transaction: t }
      );

      await ChiTietLoTrinh.destroy(
        {
          where: { IdLoTrinh: id },
        },
        { transaction: t }
      );

      const chiTietData = dsKhoBai.map((idKho, index) => ({
        IdLoTrinh: id,
        IdKhoBai: idKho,
        ThuTu: index + 1,
      }));
      console.log(chiTietData);

      await ChiTietLoTrinh.bulkCreate(chiTietData, { transaction: t });

      await t.commit();
      res.status(200).json(loTrinh);
    } catch (error) {
      await t.rollback();
      console.error("Lỗi khi cập nhật lộ trình:", error);
      res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
    }
  },

  async deleteLoTrinh(req, res) {
    const { id } = req.params;
    const t = await sequelize.startUnmanagedTransaction();
    try {
      const loTrinh = await LoTrinh.findByPk(id);
      if (!loTrinh) {
        await t.rollback();
        return res.status(404).json({ message: "Không tìm thấy lộ trình." });
      }

      await ChiTietLoTrinh.destroy(
        {
          where: { IdLoTrinh: id },
        },
        { transaction: t }
      );

      await loTrinh.destroy({ transaction: t });

      await t.commit();
      res.status(200).json({ message: "Đã xóa lộ trình và chi tiết thành công." });
    } catch (error) {
      await t.rollback();
      console.error("Lỗi khi xóa lộ trình:", error);
      res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
    }
  },
};

export default LoTrinhControllers;
