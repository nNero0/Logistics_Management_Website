// CREATE TABLE PhuongTien (
//     IdPhuongTien    INT NOT NULL AUTO_INCREMENT,
//     BienSo          VARCHAR(10) NOT NULL,
//     Loai            NVARCHAR(255) NOT NULL,
//     TaiTrong        DECIMAL(7,2) NOT NULL,
//     -- Tổng khối lượng hàng hóa đang chở
//     TrongTai        DECIMAL(7,2) NOT NULL,
//     -- Tổng khối lượng hàng hóa Tối đa có thể chở

//     TrangThai       NVARCHAR(255) NOT NULL,
//     GiayDangKyXeSo  VARCHAR(10) NOT NULL,
//     -- Các kích thước in Meters
//     CDaiThungChua   decimal(7,2 ) NOT NULL,
//     CRongThungChua   decimal(7,2 ) NOT NULL,
//     CCaoThungChua   DECIMAL(7,2) NOT NULL,
//     PRIMARY KEY (IdPhuongTien),
//     UNIQUE (BienSo)
// );
import { PhuongTien, KhoBai } from '../models/index.js';

const PhuongTienControllers = {
  async CreatePhuongTien(req, res) {
    try {
      console.log("CREATE PHUONG TIEN RECIEVED:", req.body);
      const {
        BienSo,
        Loai,
        TaiTrong = 0,
        TrongTai,
        TrangThai,
        GiayDangKyXeSo,
        CDaiThungChua,
        CRongThungChua,
        CCaoThungChua,
        IdKhoBai,
      } = req.body;
      const newPhuongTien = await PhuongTien.create({
        BienSo,
        Loai,
        TaiTrong,
        TrongTai,
        TrangThai,
        GiayDangKyXeSo,
        CDaiThungChua,
        CRongThungChua,
        CCaoThungChua,
        IdKhoBai,
      });
      res.status(201).json({ newPhuongTien });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ message: "Trùng biển số hoặc Mã đăng ký số xe" });
      }

      res.status(500).json({ message: "Phuong Tien creation error" });
      console.log(error);
    }
  },

  async getAllPhuongTien(req, res) {
    try {
      const { trangThai, viTriId } = req.query;

      const whereClause = {};
      if (trangThai) {
        whereClause.TrangThai = trangThai;
      }
      if (viTriId) {
        whereClause.IdKhoBai = viTriId; 
      }

      const phuongTienList = await PhuongTien.findAll({
        where: whereClause,
        include: [
          {
            model: KhoBai,        
            as: 'viTriHienTai',   
            attributes: ['IdKhoBai', 'DiaChi'] 
          }
        ]
      });

      res.status(200).json(phuongTienList);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phương tiện:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
   async deletePhuongTien(req, res) {
    try {
      const id = req.params.id;
      const pt = await PhuongTien.findByPk(id);
      if (!pt) return res.status(404).json({ message: "Phương tiện không tồn tại" });
      await pt.destroy();
      res.status(200).json({ message: "Phương tiện đã bị xóa" });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  }
};

export default PhuongTienControllers;
