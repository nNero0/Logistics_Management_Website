import { HangHoa, DonVan, KhachHang, KhoBai } from "../models/index.js";

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
      const { IdHangHoa, IdDonVan, NoiDung, CanNang, ChieuDai, XuatXu, GhiChu, ChieuRong, ChieuCao } = req.body;
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
  async deleteHangHoa(req, res) {
    try {
      const id = req.params.id;

      // Sửa "DonVan" thành "HangHoa"
      const hh = await HangHoa.findByPk(id); 

      if (!hh) {
        return res.status(404).json({ message: "Hàng hóa không tồn tại" });
      }

      await hh.destroy();
      res.status(200).json({ message: "Hàng hóa đã bị xóa" });

    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },
  async getAllHangHoa(req, res) {
    try {
      // Dùng findAll() để lấy tất cả
      const allHangHoa = await HangHoa.findAll({
        include: [
          // Include DonVan để lấy thông tin liên quan
          {
            model: DonVan,
            as: 'donVan', // 'as' này phải khớp với định nghĩa model của bạn
            include: [
              // Lồng include để lấy tên Khách Hàng và Kho Bãi từ Đơn Vận
              { model: KhachHang, as: 'khachHang', attributes: ['Hoten'] },
              { model: KhoBai, as: 'DVkhoBatDau', attributes: ['DiaChi'] },
              { model: KhoBai, as: 'DVkhoKetThuc', attributes: ['DiaChi'] }
            ]
          }
        ],
        order: [['IdHangHoa', 'DESC']] // Sắp xếp (Hàng mới nhất lên đầu)
      });
      
      res.status(200).json(allHangHoa);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách hàng hóa", error: error.message });
      console.log(error);
    }
  },
};

export default HangHoaControllers;
