import { DonVan, TaiXe, PhuongTien, PhanCongDonVan } from "../models/index.js";
import sequelize from "../db/db.js";

const DieuPhoiController = {
  async ganDon(req, res) {
    const t = await sequelize.startUnmanagedTransaction();

    try {
      const { DonVanIds, taiXeId, phuongTienId } = req.body;

      if (!DonVanIds || !taiXeId || !phuongTienId || DonVanIds.length === 0) {
        return res.status(400).json({ message: "Thiếu thông tin để gán đơn." });
      }

      await TaiXe.update({ TrangThaiNghiepVu: "DangChay" }, { where: { IdTaiXe: taiXeId }, transaction: t });

      await PhuongTien.update({ TrangThai: "DangChay" }, { where: { IdPhuongTien: phuongTienId }, transaction: t });

      for (const idDonVan of DonVanIds) {
        await PhanCongDonVan.create(
          {
            IdDonVan: idDonVan,
            IdTaiXe: taiXeId,
            IdPhuongTien: phuongTienId,
            TrangThai: "DangChay",
          },
          { transaction: t }
        );

        await DonVan.update({ TrangThai: "DangChay" }, { where: { IdDonVan: idDonVan }, transaction: t });
      }

      await t.commit();
      return res.status(200).json({
        message: `Gán ${DonVanIds.length} đơn thành công!`,
      });
    } catch (error) {
      await t.rollback();
      console.error("Lỗi khi gán đơn:", error);
      return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  async hoanThanhChuyen(req, res) {
    const t = await sequelize.startUnmanagedTransaction();
    try {
      const { taiXeId, phuongTienId } = req.body;
      if (!taiXeId || !phuongTienId) {
        return res.status(400).json({ message: "Thiếu taiXeId hoặc phuongTienId." });
      }

      const activeAssignments = await PhanCongDonVan.findAll({
        where: {
          IdTaiXe: taiXeId,
          IdPhuongTien: phuongTienId,
          TrangThai: "DangChay",
        },
        include: [
          {
            model: DonVan,
            attributes: ["IdDonVan", "IdKhoBaiKetThuc"],
            required: true, 
          },
        ],
        transaction: t,
      });
      console.log(activeAssignments);
      if (activeAssignments.length === 0) {
        throw new Error("Không tìm thấy chuyến đi nào đang chạy cho tổ đội này.");
      }

      const finalDestinationId = activeAssignments[0].donVan.IdKhoBaiKetThuc;
      if (!finalDestinationId) {
        throw new Error("Lỗi: Đơn vận được gán thiếu thông tin Kho Kết Thúc.");
      }

      const allPhanCongIds = activeAssignments.map((a) => a.IdPhanCong);
      const allDonVanIds = activeAssignments.map((a) => a.donVan.IdDonVan);

      await PhanCongDonVan.update(
        { TrangThai: "HoanThanh", NgayKetThuc: new Date() },
        { where: { IdPhanCong: allPhanCongIds }, transaction: t }
      );

      await DonVan.update({ TrangThai: "HoanThanh" }, { where: { IdDonVan: allDonVanIds }, transaction: t });

      await TaiXe.update(
        {
          TrangThaiNghiepVu: "SanSang",
          IdViTriHienTai: finalDestinationId,
        },
        { where: { IdTaiXe: taiXeId }, transaction: t }
      );

      await PhuongTien.update(
        {
          TrangThai: "SanSang",
          IdViTriHienTai: finalDestinationId,
        },
        { where: { IdPhuongTien: phuongTienId }, transaction: t }
      );

      await t.commit();
      res.status(200).json({ message: "Hoàn thành chuyến đi thành công." });
    } catch (error) {
      await t.rollback();
      console.error("Lỗi khi hoàn thành chuyến:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  async getAllPhanCong(req, res) {
    try {
      const { TrangThai } = req.query;

      const whereClause = {};
      if (TrangThai) {
        whereClause.TrangThai = TrangThai;
      }

      const phanCongList = await PhanCongDonVan.findAll({
        where: whereClause,

        include: [
          { model: TaiXe, attributes: ["Hoten"] },
          { model: PhuongTien, attributes: ["BienSo"] },
        ],
      });

      res.status(200).json(phanCongList);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phân công:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};

export default DieuPhoiController;
