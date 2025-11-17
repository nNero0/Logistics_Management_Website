import { DataTypes } from "@sequelize/core";
import sequelize from "../db/db.js";

// CREATE TABLE Container (
//     IdContainer     INT NOT NULL AUTO_INCREMENT,
//     MaSoHuu         VARCHAR(20) NOT NULL,
//     TrangThai       NVARCHAR(255) NOT NULL,
//     Loai            NVARCHAR(255) NOT NULL,
//     Tare            DECIMAL(8,2) NOT NULL,
//     Gross          DECIMAL(8,2) NOT NULL,
//     TaiHienTai      DECIMAL(8,2) NOT NULL,
//     TheTich         DECIMAL(8,2) NOT NULL,
//     IsoCode         VARCHAR(12) NOT NULL,
//     PRIMARY KEY (IdContainer),
//     UNIQUE (MaSoHuu)
// );

const Container = sequelize.define(
  "Container",
  {
    IdContainer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    MaSoHuu: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    TrangThai: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    Loai: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    Tare: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },

    Gross: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },

    TaiHienTai: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },

    TheTich: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },

    Isocode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  { tableName: "Container", timestamps: false }
);

export default Container;
