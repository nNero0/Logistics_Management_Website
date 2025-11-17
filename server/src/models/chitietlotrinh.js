// CREATE TABLE ChiTietLoTrinh (
//     IdChiTietLoTrinh INT PRIMARY KEY AUTO_INCREMENT,
//     IdLoTrinh INT NOT NULL,            -- Liên kết với bảng LoTrinh
//     IdKhoBai INT NOT NULL,     -- Liên kết với bảng KhoBai
//     ThuTu INT NOT NULL,                -- Rất quan trọng: 1, 2, 3...

//     FOREIGN KEY (IdLoTrinh) REFERENCES LoTrinh(IdLoTrinh),
//     FOREIGN KEY (IdKhoBai) REFERENCES KhoBai(IdKhoBai),
//     UNIQUE KEY UQ_LoTrinh_ThuTu (IdLoTrinh, ThuTu)
// );

import { DataTypes } from "@sequelize/core";
import sequelize from "../db/db.js";

const ChiTietLoTrinh = sequelize.define(
  "ChiTietLoTrinh",
  {
    IdChiTietLoTrinh: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    IdLoTrinh: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    IdKhoBai: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    ThuTu: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "ChiTietLoTrinh",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["IdLoTrinh", "ThuTu"],
      },
    ],
  }
);

export default ChiTietLoTrinh;
