// CREATE TABLE TaiXe (
//     IdTaiXe             INT NOT NULL AUTO_INCREMENT,
//     HoTen               NVARCHAR(255) NOT NULL,
//     Sdt                 VARCHAR(10) NOT NULL,
//     Email               VARCHAR(255) NOT NULL,
//     BangLai             VARCHAR(10) NOT NULL,
//     TrangThaiNghiepVu   NVARCHAR(50) NOT NULL,
//     LyDoChiTiet         NVARCHAR(255) NULL,
//     CCCD                VARCHAR(12) NOT NULL,
//     NgayCapCCCD         DATE NOT NULL,
//     NoiCapCCCD          NVARCHAR(255) NOT NULL,

//     PRIMARY KEY (IdTaiXe),
//     UNIQUE (Email),
//      UNIQUE (Sdt) ,
//      UNIQUE (CCCD)

// );

import { TaiXe } from "../models/index.js";

const TaiXeControllers = {
  async CreateTaiXe(req, res) {
    try {
      console.log("CREATE TAI XE RECIEVED:", req.body);
      const { Hoten, Sdt, Email, BangLai, TrangThaiNghiepVu, LyDoChiTiet, CCCD, NgayCapCCCD, NoiCapCCCD, IdKhoBai } =
        req.body;
      const newTaiXe = await TaiXe.create({
        Hoten,
        Sdt,
        Email,
        BangLai,
        TrangThaiNghiepVu,
        LyDoChiTiet,
        CCCD,
        NgayCapCCCD,
        NoiCapCCCD,
        IdKhoBai,
      });
      res.status(201).json({ newTaiXe });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ message: "Email , sdt, cccd có thể bị trùng" });
      }

      res.status(500).json({ message: "Tai Xe creation error" });
      console.log(error);
    }
  },
  // Thêm hàm này hoặc cập nhật hàm cũ
  async getAllTaiXe(req, res) {
    try {
      // 1. Đọc query
      const { trangThai, viTriId } = req.query;

      // 2. Xây dựng 'where'
      const whereClause = {};
      if (trangThai) {
        whereClause.TrangThaiNghiepVu = trangThai; // Tên cột trong Model TaiXe
      }
      if (viTriId) {
        whereClause.idKhobai = viTriId; // Tên cột trong Model TaiXe
      }

      // 3. Tìm tất cả
      const taiXeList = await TaiXe.findAll({
        where: whereClause,
      });

      res.status(200).json(taiXeList);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài xế:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  async deleteTaiXe(req, res) {
  try {
    const { id } = req.params;
    const taiXe = await TaiXe.findByPk(id);
    if (!taiXe) return res.status(404).json({ message: "Tài xế không tồn tại" });
    await taiXe.destroy();
    res.status(200).json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
}

};

export default TaiXeControllers;
