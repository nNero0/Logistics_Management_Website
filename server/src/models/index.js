import KhachHang from "./khachhang.js";
import DonVan from "./donvan.js";
import PhuongTien from "./phuongtien.js";
import TaiXe from "./taixe.js";
import LoTrinh from "./lotrinh.js";
import HangHoa from "./hanghoa.js";
import KhoBai from "./khobai.js";
import CSC from "./csc.js";
import Invoices from "./invoices.js";
import Container from "./container.js";
import TaiKhoan from "./taikhoan.js";
import VaiTro from "./vaitro.js";
import Quyen from "./quyen.js";
import PhanCongDonVan from "./phancongdonvan.js";
import ChiTietLoTrinh from "./chitietlotrinh.js";

if (!global.modelsInitialized) {
  // A Driver has one current location (which is a Warehouse)
  TaiXe.belongsTo(KhoBai, {
    foreignKey: "IdKhoBai",
    as: "viTriHienTai",
  });
  // A Vehicle has one current location (which is a Warehouse)
  PhuongTien.belongsTo(KhoBai, {
    foreignKey: "IdKhoBai",
    as: "viTriHienTai",
  });
  // --- Phía DonVan (Đã đúng) ---
  DonVan.belongsTo(KhoBai, {
    foreignKey: "IdKhoBaiBatDau",
    as: "DVkhoBatDau",
  });

  DonVan.belongsTo(KhoBai, {
    foreignKey: "IdKhoBaiKetThuc",
    as: "DVkhoKetThuc",
  });

  // --- Phía KhoBai (Cần 'as' và 'inverse') ---
  KhoBai.hasMany(DonVan, {
    foreignKey: "IdKhoBaiBatDau",
    as: "DonVanBatDau", // <-- Tên để bạn dùng khi include
    inverse: { as: "DVkhoBatDau" },
  });

  KhoBai.hasMany(DonVan, {
    foreignKey: "IdKhoBaiKetThuc",
    as: "DonVanKetThuc", // <-- Tên để bạn dùng khi include
    inverse: { as: "DVkhoKetThuc" },
  });

  LoTrinh.belongsTo(KhoBai, {
    foreignKey: "IdKhoBaiBatDau",
    as: "khoBatDau",
  });

  // 2. QUAN HỆ MÀ BẠN CÒN THIẾU (Cho Kho Kết Thúc)
  LoTrinh.belongsTo(KhoBai, {
    foreignKey: "IdKhoBaiKetThuc",
    as: "khoKetThuc", // <-- Tên này cũng cần cho controller
  });

  // 3. QUAN HỆ BẠN ĐÃ CÓ (Cho các trạm dừng)
  LoTrinh.hasMany(ChiTietLoTrinh, {
    foreignKey: "IdLoTrinh",
    as: "chiTietLoTrinhs", // <-- Tên này đã có trong log lỗi
  });

  // 4. QUAN HỆ BẠN ĐÃ CÓ (Cho các đơn vận)


  ChiTietLoTrinh.belongsTo(KhoBai, {
    foreignKey: "IdKhoBai",
    as: "khoBai", // <-- Đây chính là cái tên gây lỗi
  });

  // ChiTietLoTrinh.belongsTo(LoTrinh, { foreignKey: 'IdLoTrinh' });
  // ChiTietLoTrinh.belongsTo(KhoBai, { foreignKey: 'IdKhoBai' });

  // LoTrinh.hasMany(ChiTietLoTrinh, { foreignKey: 'IdLoTrinh' });
  // KhoBai.hasMany(ChiTietLoTrinh, { foreignKey: 'IdKhoBai' });

  // KhoBai.belongsToMany(LoTrinh, {
  //   through: "DiemDungTrungGian",
  //   foreignKey: "IdKhoBai",
  // });
  DonVan.belongsToMany(Container, {
    through: "DonVanContainer",
    foreignKey: "IdDonVan",
  });
  // Container.belongsToMany(DonVan, {
  //   through: "DonVanContainer",
  //   foreignKey: "IdContainer",
  // });

  // ALTER TABLE Csc ... FOREIGN KEY (IdContainer) REFERENCES Container
  // "Một Container có một Bảng Csc"
  Container.hasOne(CSC, { foreignKey: "IdContainer" });
  // "Một Bảng Csc thuộc về một Container"
  CSC.belongsTo(Container, { foreignKey: "IdContainer" });

  // ALTER TABLE Invoices ... FOREIGN KEY (IdDonVan) REFERENCES DonVan
  // "Một Đơn Vận có một Hóa Đơn"
  DonVan.hasOne(Invoices, { foreignKey: "IdDonVan" });
  // "Một Hóa Đơn thuộc về một Đơn Vận"
  Invoices.belongsTo(DonVan, { foreignKey: "IdDonVan" });

  // ALTER TABLE DonVan ... FOREIGN KEY (IdKhachHang) REFERENCES KhachHang
  KhachHang.hasMany(DonVan, { foreignKey: "IdKhachHang" });
  DonVan.belongsTo(KhachHang, { foreignKey: "IdKhachHang" });

  // ALTER TABLE DonVan ... FOREIGN KEY (IdLoTrinh) REFERENCES LoTrinh
  // LoTrinh.hasMany(DonVan, { foreignKey: "IdLoTrinh" });

  // ALTER TABLE HangHoa ... FOREIGN KEY (IdDonVan) REFERENCES DonVan
 // (Trong file DonVan.js hoặc index.js)
DonVan.hasMany(HangHoa, { 
  foreignKey: { // <-- Sửa ở đây
    name: 'IdDonVan',
    onDelete: 'CASCADE' // <-- Thêm onDelete vào đây
  }, 
  as: 'hangHoas' 
});
//  HangHoa.belongsTo(DonVan, { 
//   foreignKey: { 
//     name: 'IdDonVan' // <-- Chỉ cần tên khóa ngoại là đủ
//   }, 
//   as: 'donVan' 
// });

  // ALTER TABLE Quyen ... FOREIGN KEY (IdRole) REFERENCES VaiTro
  VaiTro.hasMany(Quyen, { foreignKey: "IdRole" });
  Quyen.belongsTo(VaiTro, { foreignKey: "IdRole" });

  // ALTER TABLE VaiTro ... FOREIGN KEY (IdTaiKhoan) REFERENCES TaiKhoan
  TaiKhoan.hasMany(VaiTro, { foreignKey: "IdTaiKhoan" });
  VaiTro.belongsTo(TaiKhoan, { foreignKey: "IdTaiKhoan" });

  // ALTER TABLE DonVanContainer ... (links DonVan and Container)

  // "PhanCongDonVan" belongs to DonVan, PhuongTien, and TaiXe
  PhanCongDonVan.belongsTo(DonVan, { foreignKey: "IdDonVan"  });
  PhanCongDonVan.belongsTo(PhuongTien, { foreignKey: "IdPhuongTien" });
  PhanCongDonVan.belongsTo(TaiXe, { foreignKey: "IdTaiXe"  });

  // The reverse relationships
  DonVan.hasMany(PhanCongDonVan, { foreignKey: "IdDonVan" });
  PhuongTien.hasMany(PhanCongDonVan, { foreignKey: "IdPhuongTien" });
  TaiXe.hasMany(PhanCongDonVan, { foreignKey: "IdTaiXe" });
  global.modelsInitialized = true;
}
export {
  KhachHang,
  DonVan,
  PhuongTien,
  TaiXe,
  LoTrinh,
  HangHoa,
  KhoBai,
  CSC,
  Invoices,
  Container,
  TaiKhoan,
  VaiTro,
  Quyen,
  PhanCongDonVan,
  ChiTietLoTrinh,
};
