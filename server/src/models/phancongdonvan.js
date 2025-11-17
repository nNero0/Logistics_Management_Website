import { DataTypes } from "@sequelize/core";
import sequelize from "../db/db.js";

// CREATE TABLE PhanCongDonVan (
//     IdPhanCong      INT NOT NULL AUTO_INCREMENT,
//     IdTaiXe         INT NOT NULL,
//     IdPhuongTien    INT NOT NULL,
//     IdDonVan        INT NOT NULL,
//     NgayBatDau      DATE NOT NULL,
//     NgayKetThuc     DATE NOT NULL,
//     TrangThai       NVARCHAR(255),
//     PRIMARY KEY (IdPhanCong)
// );

const PhanCongDonVan = sequelize.define(
  "PhanCongDonVan",
  {
    IdPhanCong: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    IdTaiXe: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    IdPhuongTien: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    IdDonVan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    NgayBatDau: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    // Thêm `NgayKetThuc` (từ comment SQL của bạn)  
    NgayKetThuc: {
      type: DataTypes.DATE,
      allowNull: true, // Nên là TRUE, vì khi mới gán thì chưa kết thúc
    },

    // Thêm `TrangThai` (từ comment SQL của bạn)
    TrangThai: {
      type: DataTypes.STRING, 
      allowNull: true, // Ví dụ: "DangChay", "HoanThanh"
      defaultValue: "DangChay",
    },            
  },
  {
    tableName: "PhanCongDonVan",
    createdAt: "NgayBatDau", // Logic của bạn: Dùng cột createdAt làm NgayBatDau
    updatedAt: false,
  }
);

export default PhanCongDonVan;
