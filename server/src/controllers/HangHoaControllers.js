import {HangHoa} from "../models/index.js";

//     IdHangHoa       INT NOT NULL AUTO_INCREMENT,
//     IdDonVan        INT NOT NULL,
//     NoiDung         NVARCHAR(255) NOT NULL,
//     CanNang         DECIMAL(15,2) NOT NULL,
//     ChieuDai        DECIMAL(15,2) NOT NULL,
//     XuatXu          VARCHAR(3) NOT NULL,
//     GhiChu          NVARCHAR(255),
//     ChieuRong       DECIMAL(15,2) NOT NULL,
//     ChieuCao        DECIMAL(15,2) NOT NULL,

const HangHoaControllers = {
  async CreateHangHoa(req, res) {
    try {
      console.log("CREATE Hang hoa RECIEVED:", req.body);
      const { IdHangHoa, DiaChi, SucChuaTong, TrangThai, LoaiKho } = req.body;
      const newHangHoa = await HangHoa.create({
        IdHangHoa,
        IdDonVan,
        NoiDung,
        CanNang,
        ChieuDai,
        XuatXu,
        GhiChu,
        ChieuRong,
        ChieuCao,
      });
      res.status(201).json({ newHangHoa });
    } catch (error) {
      res.status(500).json({ message: "Hang Hoa creation error" });
      console.log(error);
    }
  },

};

export default HangHoaControllers;
