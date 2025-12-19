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
   
    try {
      await sequelize.transaction(async (t) => {
        const { taiXeId, phuongTienId } = req.body;

        if (!taiXeId || !phuongTienId) {
          throw new Error("Thiếu taiXeId hoặc phuongTienId.");
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

        if (!activeAssignments || activeAssignments.length === 0) {
          throw new Error("Không tìm thấy chuyến đi nào đang chạy cho tổ đội này.");
        }

   
        const firstOrder =
          activeAssignments[0].DonVan || activeAssignments[0].donVan || activeAssignments[0].dataValues.DonVan;

        if (!firstOrder) {
          throw new Error("Lỗi dữ liệu: Không lấy được thông tin Đơn Vận từ Phân Công.");
        }

        const finalDestinationId = firstOrder.IdKhoBaiKetThuc;

        if (!finalDestinationId) {
          throw new Error("Lỗi dữ liệu: Đơn vận thiếu thông tin Kho Kết Thúc.");
        }

        const allPhanCongIds = activeAssignments.map((a) => a.IdPhanCong);
        const allDonVanIds = activeAssignments.map((a) => (a.DonVan || a.donVan).IdDonVan);


        await PhanCongDonVan.update(
          { TrangThai: "HoanThanh", NgayKetThuc: new Date() },
          { where: { IdPhanCong: allPhanCongIds }, transaction: t }
        );

  
        await DonVan.update(
          { TrangThai: "HoanThanh" },
          { where: { IdDonVan: allDonVanIds }, transaction: t }
        );


        await TaiXe.update(
          {
            TrangThaiNghiepVu: "SanSang",
            IdKhoBai: finalDestinationId, 
          },
          { where: { IdTaiXe: taiXeId }, transaction: t }
        );

        await PhuongTien.update(
          {
            TrangThai: "SanSang",
            IdKhoBai: finalDestinationId, 
          },
          { where: { IdPhuongTien: phuongTienId }, transaction: t }
        );
      });

      return res.status(200).json({ message: "Hoàn thành chuyến đi và cập nhật vị trí thành công." });
    } catch (error) {
      console.error("Lỗi khi hoàn thành chuyến:", error);
      return res.status(500).json({ message: error.message || "Lỗi server" });
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
