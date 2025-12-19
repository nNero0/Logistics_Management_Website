import { DonVan, PhanCongDonVan, TaiXe, PhuongTien } from "../models/index.js";

const ThongKeController = {
  async getDashboardStats(req, res) {
    try {
      const donCho = await DonVan.count({
        where: { TrangThai: "ChoXuLy" },
      });

      const chuyenChay = await PhanCongDonVan.count({
        where: { TrangThai: "DangChay" },
      });

      const taiXeRanh = await TaiXe.count({
        where: { TrangThaiNghiepVu: "SanSang" },
      });

      const xeRanh = await PhuongTien.count({
        where: { TrangThai: "SanSang" },
      });

      res.status(200).json({ donCho, chuyenChay, taiXeRanh, xeRanh });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy số liệu thống kê", error: error.message });
    }
  },
};

export default ThongKeController;
