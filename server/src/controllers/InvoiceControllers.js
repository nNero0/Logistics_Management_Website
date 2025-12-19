import { Invoices,DonVan } from "../models/index.js";


const InvoiceController = {
  async createInvoice(req, res) {
    try {
      const { IdDonVan, TongTien, HanDong, GhiChu } = req.body;

            if (!IdDonVan || !TongTien || !HanDong) {
        return res.status(400).json({ message: "Thiếu thông tin IdDonVan, TongTien, hoặc HanDong" });
      }

            const donVan = await DonVan.findByPk(IdDonVan);
      if (!donVan) {
        return res.status(404).json({ message: `Không tìm thấy Đơn vận với ID ${IdDonVan}.` });
      }

      
            const newInvoice = await Invoices.create({
        IdDonVan: IdDonVan,
        TongTien: TongTien,
        HanDong: HanDong,
        GhiChu: GhiChu,
        NgayPhatHanh: new Date(),         DonViTT: "VND",         TrangThai: "ChuaThanhToan",       });

      res.status(201).json(newInvoice);
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};
export default InvoiceController;