import KhachHang from "../models/khachhang.js";

const KhachHangControllers = {
  async CreateKhachHang(req, res) {
    try {
      console.log("CREATE Khach hang RECEIVED:", req.body);

      const { HoTen, Sdt, Email } = req.body;

      const newKhachHang = await KhachHang.create({
        HoTen,
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
};

export default KhachHangControllers;
