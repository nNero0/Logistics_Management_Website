import { LoTrinh, KhoBai, ChiTietLoTrinh } from "../models/index.js";
import sequelize from "../db/db.js"; // <-- Quan trọng: Import sequelize instance

// Helper để kiểm tra alias (tên định danh) trong model
const checkAlias = (model, alias) => {
  if (!model.associations[alias]) {
    console.warn(
      `Warning: Model '${model.name}' does not have an association named '${alias}'. Please check your model definition.`
    );
  }
};

const LoTrinhControllers = {
  /**
   * @desc    Tạo một Lộ trình mới (bao gồm cả các trạm chi tiết)
   * @route   POST /api/lotrinh
   * @access  Private (Quản lý)
   */
  async CreateLoTrinh(req, res) {
    console.log("CREATE Lo trinh RECEIVED:", req.body);

    // 1. Lấy dữ liệu mới từ frontend
    const {
      TenLoTrinh, // <-- Tên mới (thay vì NoiBatDau)
      trangThai,
      etc,
      khoangCach,
      dsKhoBai, // <-- Mảng ID kho bãi [1, 5, 3]
    } = req.body;

    // 2. Kiểm tra dữ liệu đầu vào
    if (!TenLoTrinh || !dsKhoBai || !Array.isArray(dsKhoBai) || dsKhoBai.length < 2) {
      return res
        .status(400)
        .json({ message: "Dữ liệu không hợp lệ. Cần 'TenLoTrinh' và 'dsKhoBai' (mảng có ít nhất 2 kho)." });
    }

    // Bắt đầu một transaction
    const t = await sequelize.startUnmanagedTransaction();

    try {
      // 3. Lấy điểm đầu và cuối từ mảng
      const IdKhoBaiBatDau = dsKhoBai[0];
      const IdKhoBaiKetThuc = dsKhoBai[dsKhoBai.length - 1];

      // 4. TẠO BẢN GHI `LoTrinh` (cha)
      const newLoTrinh = await LoTrinh.create(
        {
          TenLoTrinh: TenLoTrinh, // Đổi tên trường cho khớp
          IdKhoBaiBatDau: IdKhoBaiBatDau,
          IdKhoBaiKetThuc: IdKhoBaiKetThuc,
          TrangThai: trangThai,
          ETC: etc,
          KhoangCach: khoangCach,
        },
        { transaction: t }
      ); // Quan trọng: chỉ định transaction

      const newIdLoTrinh = newLoTrinh.IdLoTrinh;
      console.log(newLoTrinh);
      // 5. Chuẩn bị dữ liệu cho `ChiTietLoTrinh` (con)
      const chiTietData = dsKhoBai.map((idKho, index) => {
        return {
          IdLoTrinh: newIdLoTrinh,
          IdKhoBai: idKho,
          ThuTu: index + 1, // Quan trọng: Thứ tự (1, 2, 3...)
        };
      });

      // 6. TẠO CÁC BẢN GHI `ChiTietLoTrinh` (dùng bulkCreate cho hiệu quả)
      await ChiTietLoTrinh.bulkCreate(chiTietData, { transaction: t });

      // 7. Nếu mọi thứ thành công, commit transaction
      await t.commit();

      res.status(201).json(newLoTrinh);
    } catch (error) {
      // 8. Nếu có bất kỳ lỗi nào, rollback tất cả thay đổi
      await t.rollback();
      console.error("Lo Trinh creation error:", error);
      res.status(500).json({ message: "Error creating Lo Trinh.", error: error.message });
    }
  },

  /**
   * @desc    Lấy TẤT CẢ Lộ trình (bao gồm chi tiết)
   * @route   GET /api/lotrinh
   * @access  Private
   */
  async getAllLoTrinh(req, res) {
    try {
      // !!! CẢNH BÁO QUAN TRỌNG VỀ ALIAS (as: '...') !!!
      // Các tên 'khoBatDau', 'khoKetThuc', 'chiTietLoTrinhs', 'khoBai'
      // PHẢI KHỚP 100% với tên 'as' bạn định nghĩa trong file Model (models/lotrinh.js, models/chitietlotrinh.js)

      // Check alias (có thể xóa đi khi đã chắc chắn)
      checkAlias(LoTrinh, "khoBatDau");
      checkAlias(LoTrinh, "khoKetThuc");
      checkAlias(LoTrinh, "chiTietLoTrinhs");
      checkAlias(ChiTietLoTrinh, "khoBai");

      const allLoTrinh = await LoTrinh.findAll({
        order: [["TenLoTrinh", "ASC"]],
        include: [
          // 1. Include Kho Bãi cho điểm BẮT ĐẦU
          {
            model: KhoBai,
            as: "khoBatDau", // Alias cho quan hệ belongsTo IdKhoBaiBatDau
            attributes:  ["DiaChi"],
          },
          // 2. Include Kho Bãi cho điểm KẾT THÚC
          {
            model: KhoBai,
            as: "khoKetThuc", // Alias cho quan hệ belongsTo IdKhoBaiKetThuc
            attributes: [ "DiaChi"],
          },
          // 3. Include TẤT CẢ các trạm dừng (ChiTietLoTrinh)
          {
            model: ChiTietLoTrinh,
            as: "chiTietLoTrinhs", // Alias cho quan hệ hasMany ChiTietLoTrinh
            order: [["ThuTu", "ASC"]], // Rất quan trọng: Sắp xếp các trạm theo thứ tự
            include: {
              model: KhoBai,
              as: "khoBai", // Alias cho quan hệ ChiTietLoTrinh belongsTo KhoBai
              attributes: [ "DiaChi"],
            },
          },
        ],
      });

      res.status(200).json(allLoTrinh);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lộ trình:", error);
      res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
    }
  },

  /**
   * @desc    Lấy MỘT Lộ trình bằng ID (bao gồm chi tiết)
   * @route   GET /api/lotrinh/:id
   * @access  Private
   */
  async getLoTrinhById(req, res) {
    try {
      const { id } = req.params;
      const loTrinh = await LoTrinh.findByPk(id, {
        include: [
          { model: KhoBai, as: "khoBatDau", attributes: ["DiaChi"] },
          { model: KhoBai, as: "khoKetThuc", attributes: ["DiaChi"] },
          {
            model: ChiTietLoTrinh,
            as: "chiTietLoTrinhs",
            order: [["ThuTu", "ASC"]],
            include: {
              model: KhoBai,
              as: "khoBai",
              attributes: [ "DiaChi"],
            },
          },
        ],
      });

      if (!loTrinh) {
        return res.status(404).json({ message: "Không tìm thấy lộ trình." });
      }
      res.status(200).json(loTrinh);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết lộ trình:", error);
      res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
    }
  },

  /**
   * @desc    Cập nhật MỘT Lộ trình (bao gồm cập nhật chi tiết)
   * @route   PUT /api/lotrinh/:id
   * @access  Private (Quản lý)
   */
  async updateLoTrinh(req, res) {
    const { id } = req.params;
    const { TenLoTrinh, trangThai, etc, khoangCach, dsKhoBai } = req.body;

    // Validation
    if (!TenLoTrinh || !dsKhoBai || !Array.isArray(dsKhoBai) || dsKhoBai.length < 2) {
      return res
        .status(400)
        .json({ message: "Dữ liệu không hợp lệ. Cần 'TenLoTrinh' và 'dsKhoBai' (mảng có ít nhất 2 kho)." });
    }

    const t = await sequelize.transaction();
    try {
      const loTrinh = await LoTrinh.findByPk(id);
      if (!loTrinh) {
        await t.rollback();
        return res.status(404).json({ message: "Không tìm thấy lộ trình." });
      }

      // 1. Cập nhật bản ghi `LoTrinh` (cha)
      const IdKhoBaiBatDau = dsKhoBai[0];
      const IdKhoBaiKetThuc = dsKhoBai[dsKhoBai.length - 1];

      await loTrinh.update(
        {
          TenLoTrinh: TenLoTrinh,
          IdKhoBaiBatDau: IdKhoBaiBatDau,
          IdKhoBaiKetThuc: IdKhoBaiKetThuc,
          TrangThai: trangThai,
          ETC: etc,
          KhoangCach: khoangCach,
        },
        { transaction: t }
      );

      // 2. XÓA TẤT CẢ `ChiTietLoTrinh` (con) cũ
      await ChiTietLoTrinh.destroy(
        {
          where: { IdLoTrinh: id },
        },
        { transaction: t }
      );

      // 3. TẠO LẠI `ChiTietLoTrinh` (con) mới
      const chiTietData = dsKhoBai.map((idKho, index) => ({
        IdLoTrinh: id,
        IdKhoBai: idKho,
        ThuTu: index + 1,
      }));
      console.log(chiTietData);

      await ChiTietLoTrinh.bulkCreate(chiTietData, { transaction: t });

      // 4. Commit
      await t.commit();
      res.status(200).json(loTrinh);
    } catch (error) {
      await t.rollback();
      console.error("Lỗi khi cập nhật lộ trình:", error);
      res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
    }
  },

  /**
   * @desc    Xóa MỘT Lộ trình (và tất cả chi tiết)
   * @route   DELETE /api/lotrinh/:id
   * @access  Private (Quản lý)
   */
  async deleteLoTrinh(req, res) {
    const { id } = req.params;
    const t = await sequelize.transaction();
    try {
      const loTrinh = await LoTrinh.findByPk(id);
      if (!loTrinh) {
        await t.rollback();
        return res.status(404).json({ message: "Không tìm thấy lộ trình." });
      }

      // 1. Xóa tất cả 'ChiTietLoTrinh' (con) trước
      // (Bỏ qua bước này nếu bạn đã cài 'onDelete: CASCADE' trong model)
      await ChiTietLoTrinh.destroy(
        {
          where: { IdLoTrinh: id },
        },
        { transaction: t }
      );

      // 2. Xóa 'LoTrinh' (cha)
      await loTrinh.destroy({ transaction: t });

      // 3. Commit
      await t.commit();
      res.status(200).json({ message: "Đã xóa lộ trình và chi tiết thành công." });
    } catch (error) {
      await t.rollback();
      console.error("Lỗi khi xóa lộ trình:", error);
      res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
    }
  },
};

export default LoTrinhControllers;
