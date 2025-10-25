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

import TaiXe from "../models/taixe.js";

const TaiXeControllers = {
  async CreateTaiXe(req, res) {
    try {
      console.log("CREATE TAI XE RECIEVED:", req.body);
      const {
        HoTen,
        Sdt,
        Email,
        BangLai,
        TrangThaiNghiepVu,
        LyDoChiTiet,
        CCCD,
        NgayCapCCCD,
        NoiCapCCCD,
      } = req.body;
      const newTaiXe = await TaiXe.create({
        HoTen,
        Sdt,
        Email,
        BangLai,
        TrangThaiNghiepVu,
        LyDoChiTiet,
        CCCD,
        NgayCapCCCD,
        NoiCapCCCD,
      });
      res.status(201).json({ newTaiXe });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(409)
          .json({ message: "Email , sdt, cccd có thể bị trùng" });
      }

      res.status(500).json({ message: "Tai Xe creation error" });
      console.log(error);
    }
  },
};

export default TaiXeControllers;
