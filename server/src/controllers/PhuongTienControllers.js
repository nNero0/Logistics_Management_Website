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

import PhuongTien from "../models/phuongtien.js";
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
   
      const PTs= await PhuongTien.findAll();

      res.status(200).json(PTs);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phương tiện:", error);
      res.status(500).json({ message: "Đã có lỗi xảy ra ở máy chủ" });
    }
  },
};

export default PhuongTienControllers;
