import { DataTypes } from "@sequelize/core";
import sequelize from "../db/db.js";

// CREATE TABLE LoTrinh (
//     IdLoTrinh       INT NOT NULL AUTO_INCREMENT,
//     NoiBatDau       NVARCHAR(255) NOT NULL,
//     NoiKetThuc      NVARCHAR(255) NOT NULL,
//     TrangThai       NVARCHAR(255) NOT NULL,
//     ETC           DECIMAL(8,2) NOT NULL,
//     KhoangCach         DECIMAL(8,2) NOT NULL,
//     PRIMARY KEY (IdLoTrinh)
// );

const LoTrinh = sequelize.define(
  "LoTrinh",
  {
    IdLoTrinh: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    TenLoTrinh: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    IdKhoBaiBatDau: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    IdKhoBaiKetThuc: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    TrangThai: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ETC: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    KhoangCach: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
  },
  { tableName: "LoTrinh", timestamps: false }
);

export default LoTrinh;
