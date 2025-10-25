import { DataTypes } from "@sequelize/core";
import sequelize from "../db/db.js";

// CREATE TABLE KhachHang (
//     IdKhachHang     INT NOT NULL AUTO_INCREMENT,
//     HoTen           NVARCHAR(255) NOT NULL,
//     Sdt             VARCHAR(10) NOT NULL,
//     Email           VARCHAR(255) NOT NULL,
//     PRIMARY KEY (IdKhachHang),
//     UNIQUE (Email),
//      UNIQUE (Sdt)

// );

const KhachHang = sequelize.define(
  "KhachHang",
  {
    IdKhachHang: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    Hoten: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Sdt: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  { tableName: "KhachHang", timestamps: false }
);

export default KhachHang;
