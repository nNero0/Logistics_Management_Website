import { HangHoa, DonVan, KhachHang, KhoBai } from "../models/index.js";


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
            const { IdDonVan } = req.query;

            let whereCondition = {};
      
            if (IdDonVan) {
        whereCondition.IdDonVan = IdDonVan;
      }

            const allHangHoa = await HangHoa.findAll({
        where: whereCondition,         include: [
          {
            model: DonVan,
            as: 'donVan',
            include: [
              { model: KhachHang, as: 'khachHang', attributes: ['Hoten'] },
              { model: KhoBai, as: 'DVkhoBatDau', attributes: ['DiaChi'] },
              { model: KhoBai, as: 'DVkhoKetThuc', attributes: ['DiaChi'] }
            ]
          }
        ],
        order: [['IdHangHoa', 'DESC']]
      });
      
      res.status(200).json(allHangHoa);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Lỗi khi lấy danh sách hàng hóa", error: error.message });
    }
},
};

export default HangHoaControllers;
