import KhachHang from "./khachhang.js";
import DonVan from "./donvan.js";
import PhuongTien from "./phuongtien.js";
import TaiXe from "./taixe.js";
import LoTrinh from "./lotrinh.js";
import HangHoa from "./hanghoa.js";
import KhoBai from "./khobai.js";

import Invoices from "./invoices.js";

import TaiKhoan from "./taikhoan.js";

import PhanCongDonVan from "./phancongdonvan.js";
import ChiTietLoTrinh from "./chitietlotrinh.js";

if (!global.modelsInitialized) {
  TaiXe.belongsTo(KhoBai, {
    foreignKey: "IdKhoBai",
    as: "viTriHienTai",
  });

  PhuongTien.belongsTo(KhoBai, {
    foreignKey: "IdKhoBai",
    as: "viTriHienTai",
  });

  DonVan.belongsTo(KhoBai, {
    foreignKey: "IdKhoBaiBatDau",
    as: "DVkhoBatDau",
  });

  DonVan.belongsTo(KhoBai, {
    foreignKey: "IdKhoBaiKetThuc",
    as: "DVkhoKetThuc",
  });

  KhoBai.hasMany(DonVan, {
    foreignKey: "IdKhoBaiBatDau",
    as: "DonVanBatDau",
    inverse: { as: "DVkhoBatDau" },
  });

  KhoBai.hasMany(DonVan, {
    foreignKey: "IdKhoBaiKetThuc",
    as: "DonVanKetThuc",
    inverse: { as: "DVkhoKetThuc" },
  });

  LoTrinh.belongsTo(KhoBai, {
    foreignKey: "IdKhoBaiBatDau",
    as: "khoBatDau",
  });

  LoTrinh.belongsTo(KhoBai, {
    foreignKey: "IdKhoBaiKetThuc",
    as: "khoKetThuc",
  });

  LoTrinh.hasMany(ChiTietLoTrinh, {
    foreignKey: "IdLoTrinh",
    as: "chiTietLoTrinhs",
  });

  ChiTietLoTrinh.belongsTo(KhoBai, {
    foreignKey: "IdKhoBai",
    as: "khoBai",
  });

  DonVan.hasOne(Invoices, { foreignKey: "IdDonVan" });

  Invoices.belongsTo(DonVan, { foreignKey: "IdDonVan" });

  KhachHang.hasMany(DonVan, { foreignKey: "IdKhachHang" });
  DonVan.belongsTo(KhachHang, { foreignKey: "IdKhachHang" });

  DonVan.hasMany(HangHoa, {
    foreignKey: {
      name: "IdDonVan",
      onDelete: "CASCADE",
    },
    as: "hangHoas",
  });

  PhanCongDonVan.belongsTo(DonVan, { foreignKey: "IdDonVan" });
  PhanCongDonVan.belongsTo(PhuongTien, { foreignKey: "IdPhuongTien" });
  PhanCongDonVan.belongsTo(TaiXe, { foreignKey: "IdTaiXe" });

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
  Invoices,
  TaiKhoan,
  PhanCongDonVan,
  ChiTietLoTrinh,
};
