import { DataTypes } from "@sequelize/core";
import sequelize from "../db/db.js";

// IdDonVan        INT NOT NULL AUTO_INCREMENT,
// IdLoTrinh       INT NOT NULL,
// IdKhachHang     INT NOT NULL,
// DiaDiemGiao     NVARCHAR(255) NOT NULL,

// ETA             DATETIME,
// NgayLapDon      DATETIME NOT NULL,
// PRIMARY KEY (IdDonVan)

const DonVan = sequelize.define(
  "DonVan",
  {
    IdDonVan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    IdKhoBaiBatDau: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    IdKhoBaiKetThuc: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    IdKhachHang: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ETA: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    TrangThai: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  { tableName: "DonVan", createdAt: "NgayLapDon", updatedAt: false }
);

export default DonVan;
