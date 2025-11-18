// Các hàm liên quan tới tạo ra object đơn vận
import { DonVan, KhoBai, KhachHang } from "../models/index.js";

const DonVanController = {
  async CreateDonVan(req, res) {
    try {
      console.log(req.body);
      const { IdKhachHang, ETA, IdKhoBaiBatDau, IdKhoBaiKetThuc ,TrangThai} = req.body;

      if (!IdKhachHang || !IdKhoBaiBatDau || !IdKhoBaiKetThuc) {
        return res.status(400).json({
          message: "Vui lòng cung cấp Lộ trình, Khách hàng, và Địa điểm giao",
        });
      }
      const newDonVan = await DonVan.create({
        IdKhoBaiBatDau,
        IdKhoBaiKetThuc,
        IdKhachHang,
        ETA,
        TrangThai
      });
      res.status(201).json(newDonVan);
    } catch (error) {
      console.error("Lỗi khi tạo đơn vận:", error);
      res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
    }
  },

  // hêm hàm này hoặc cập nhật hàm cũ
  async getAllDonVan(req, res) {
    try {
      // 1. Đọc các tham số query
      const { trangThai, khoBatDauId, khoKetThucId } = req.query;
      // 2. Xây dựng mệnh đề 'where' động
      const whereClause = {};
      if (trangThai) {
        whereClause.TrangThai = trangThai;
      }
      if (khoBatDauId) {
        whereClause.IdKhoBaiBatDau = khoBatDauId; // Dùng tên cột trong Model
      }
      if (khoKetThucId) {
        whereClause.IdKhoBaiKetThuc = khoKetThucId; // Dùng tên cột trong Model
      }

      // 3. Tìm tất cả với 'where' và 'include'
      const DonVanList = await DonVan.findAll({
        where: whereClause,
        include: [
          { model: KhachHang, as: "khachHang" }, // Dùng 'as' bạn đã định nghĩa
          { model: KhoBai, as: "DVkhoBatDau" }, // Dùng 'as' bạn đã định nghĩa
          { model: KhoBai, as: "DVkhoKetThuc" }, // Dùng 'as' bạn đã định nghĩa
        ],
      });

      res.status(200).json(DonVanList);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn vận:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  async deleteDonVan(req, res) {
  try {
    const { id } = req.params;

    // SỬA Ở ĐÂY: Dùng "donVan" (chữ thường) cho biến
    const donVan = await DonVan.findByPk(id); 
    //   ^ (chữ thường)   ^ (chữ hoa - Model)

    // SỬA Ở ĐÂY:
    if (!donVan) { 
      return res.status(404).json({ message: "Không tìm thấy đơn vận" });
    }

    // SỬA Ở ĐÂY:
    await donVan.destroy(); 

    res.status(200).json({ message: "Đã xóa đơn vận thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa đơn vận:", error);
    
    // Thêm logic bắt lỗi khóa ngoại (nếu bạn muốn)
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        message: "Xóa thất bại. Đơn vận này đang được liên kết với Hàng Hóa hoặc Hóa Đơn." 
      });
    }

    res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
  }
},
};

export default DonVanController;
