
import { DonVan, PhanCongDonVan,TaiXe, PhuongTien } from  "../models/index.js";
const ThongKeController = {
  async getDashboardStats(req, res) {
    try {
      // 1. Đếm đơn chờ xử lý
      // (Thay 'ChoXuLy' bằng trạng thái thật của bạn)
      const donCho = await DonVan.count({
        where: { TrangThai: "ChoXuLy" },
      });

      // 2. Đếm chuyến đang chạy
      // (Thay 'DangChay' bằng trạng thái thật của bạn)
      const chuyenChay = await PhanCongDonVan.count({
        where: { TrangThai: "DangChay" },
      });

      // 3. Đếm tài xế sẵn sàng
      // (Thay 'SanSang' bằng trạng thái thật của bạn)
      const taiXeRanh = await TaiXe.count({
        where: { TrangThaiNghiepVu: "SanSang" },
      });

      // 4. Đếm phương tiện sẵn sàng
      // (Thay 'SanSang' bằng trạng thái thật của bạn)
      const xeRanh = await PhuongTien.count({
        where: { TrangThai: "SanSang" },
      });

      // Trả về một JSON object duy nhất chứa cả 4 con số
      res.status(200).json({ donCho, chuyenChay, taiXeRanh, xeRanh });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy số liệu thống kê", error: error.message });
    }
  },
};
export default ThongKeController;
