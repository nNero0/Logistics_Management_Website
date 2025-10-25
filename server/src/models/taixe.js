import { DataTypes } from "@sequelize/core";
import sequelize from "../db/db.js";

// CREATE TABLE TaiXe (
//     IdTaiXe             INT NOT NULL AUTO_INCREMENT,
//     HoTen               NVARCHAR(255) NOT NULL,
//     Sdt                 VARCHAR(10) NOT NULL,
//     Email               VARCHAR(255) NOT NULL,
//     BangLai             VARCHAR(10) NOT NULL,
//     TrangThaiNghiepVu   VARCHAR(50) NOT NULL,
    // LyDoChiTiet          VARCHAR(255) NULL,
//     CCCD                VARCHAR(12) NOT NULL,
//     NgayCapCCCD         DATE NOT NULL,
//     NoiCapCCCD          VARCHAR(255) NOT NULL,

//     PRIMARY KEY (IdTaiXe),
//     UNIQUE (Email),
//      UNIQUE (Sdt) ,
//      UNIQUE (CCCD)

// );

const TaiXe = sequelize.define(
  "TaiXe",
  {
    IdTaiXe: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    HoTen: {
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
    BangLai: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    TrangThaiNghiepVu: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    LyDoChiTiet: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    CCCD: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
    },
    NgayCapCCCD: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    NoiCapCCCD: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  { tableName: "TaiXe", timestamps: false }
);

export default TaiXe;
