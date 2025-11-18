import { Invoices,DonVan } from "../models/index.js";


/**
 * Tạo một hóa đơn cho MỘT đơn vận duy nhất (cho đồ án).
 */
const InvoiceController = {
  async createInvoice(req, res) {
    try {
      const { IdDonVan, TongTien, HanDong, GhiChu } = req.body;

      // 1. Kiểm tra thông tin đầu vào cơ bản
      if (!IdDonVan || !TongTien || !HanDong) {
        return res.status(400).json({ message: "Thiếu thông tin IdDonVan, TongTien, hoặc HanDong" });
      }

      // 2. (Khuyến khích) Kiểm tra xem Đơn vận có tồn tại không
      const donVan = await DonVan.findByPk(IdDonVan);
      if (!donVan) {
        return res.status(404).json({ message: `Không tìm thấy Đơn vận với ID ${IdDonVan}.` });
      }

      // (Bạn cũng có thể kiểm tra xem DonVan này đã có hóa đơn chưa)

      // 3. Tạo Hóa đơn mới
      const newInvoice = await Invoices.create({
        IdDonVan: IdDonVan,
        TongTien: TongTien,
        HanDong: HanDong,
        GhiChu: GhiChu,
        NgayPhatHanh: new Date(), // Lấy ngày giờ hiện tại
        DonViTT: "VND", // Giá trị mặc định từ model của bạn
        TrangThai: "ChuaThanhToan", // Trạng thái ban đầu
      });

      res.status(201).json(newInvoice);
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};
export default InvoiceController;