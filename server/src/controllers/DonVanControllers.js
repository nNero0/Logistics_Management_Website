import { DonVan, KhoBai, KhachHang,HangHoa } from "../models/index.js";

const DonVanController = {
  async CreateDonVan(req, res) {
    try {
      console.log(req.body);
      const { IdKhachHang, ETA, IdKhoBaiBatDau, IdKhoBaiKetThuc ,TrangThai,YeuCauContainer} = req.body;

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
        TrangThai,
        YeuCauContainer,
      });
      res.status(201).json(newDonVan);
    } catch (error) {
      console.error("Lỗi khi tạo đơn vận:", error);
      res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
    }
  },

    async getAllDonVan(req, res) {
    try {
            const { trangThai, khoBatDauId, khoKetThucId } = req.query;
            const whereClause = {};
      if (trangThai) {
        whereClause.TrangThai = trangThai;
      }
      if (khoBatDauId) {
        whereClause.IdKhoBaiBatDau = khoBatDauId;       }
      if (khoKetThucId) {
        whereClause.IdKhoBaiKetThuc = khoKetThucId;       }

            const DonVanList = await DonVan.findAll({
        where: whereClause,
        include: [
          { model: KhachHang, as: "khachHang" },           { model: KhoBai, as: "DVkhoBatDau" },           { model: KhoBai, as: "DVkhoKetThuc" },           { 
            model: HangHoa, 
            as: 'hangHoas',                     }
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

        const donVan = await DonVan.findByPk(id); 
    
        if (!donVan) { 
      return res.status(404).json({ message: "Không tìm thấy đơn vận" });
    }

        await donVan.destroy(); 

    res.status(200).json({ message: "Đã xóa đơn vận thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa đơn vận:", error);
    
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
