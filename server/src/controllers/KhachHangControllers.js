import { KhachHang, DonVan } from "../models/index.js";

const KhachHangControllers = {
  async CreateKhachHang(req, res) {
    try {
      console.log("CREATE Khach hang RECEIVED:", req.body);

      const { Hoten, Sdt, Email } = req.body;

      const newKhachHang = await KhachHang.create({
        Hoten,
        Sdt,
        Email,
      });

      res.status(201).json({ newKhachHang });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ message: "Email or Sdt trung. " });
      }
      res.status(500).json({ message: "Khach Hang creation error" });
      console.log(error);
    }
  },
  async getAllKhachHang(req, res) {
    try {
      const allKhachHang = await KhachHang.findAll();

      res.status(200).json(allKhachHang);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
      res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
    }
  },
  async deleteKhachHang(req, res) {
    try {
      const id = req.params.id;
      const kh = await KhachHang.findByPk(id);
      if (!kh) return res.status(404).json({ message: "kh không tồn tại" });
      await kh.destroy();
      res.status(200).json({ message: "kh đã bị xóa" });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  },
};

export default KhachHangControllers;
