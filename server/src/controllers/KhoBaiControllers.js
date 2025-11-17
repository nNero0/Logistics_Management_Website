import{ KhoBai} from "../models/index.js";

const KhoBaiControllers = {
  async CreateKhoBai(req, res) {
    try {
      console.log("CREATE KHO BAI RECIEVED:", req.body);
      const { DiaChi, SucChuaTong, TrangThai, LoaiKho } = req.body;
      const newKhoBai = await KhoBai.create({
        DiaChi,
        SucChuaTong,
        TrangThai,
        LoaiKho,
      });
      res.status(201).json({ newKhoBai });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ message: "Địa chỉ  có thể bị trùng" });
      }

      res.status(500).json({ message: "Kho Bai creation error" });
      console.log(error);
    }
  },
  async fetchKhoBai(req, res) {
    try {
      const khoBais = await KhoBai.findAll();
      res.status(200).json(khoBais);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kho bãi:", error);
      res.status(500).json({ message: "Đã có lỗi xảy ra ở máy chủ", error: error.message });
    }
  },
};

export default KhoBaiControllers;
