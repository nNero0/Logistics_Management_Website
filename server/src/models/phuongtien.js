// CREATE TABLE PhuongTien (
//     IdPhuongTien    INT NOT NULL AUTO_INCREMENT,
//     BienSo          VARCHAR(10) NOT NULL,
//     Loai            NVARCHAR(255) NOT NULL,
//     TaiTrong        DECIMAL(7,2) NOT NULL,
//     -- Tổng khối lượng hàng hóa đang chở
//     TrongTai        DECIMAL(7,2) NOT NULL,
//     -- Tổng khối lượng hàng hóa Tối đa có thể chở

//     TrangThai       NVARCHAR(255) NOT NULL,
//     GiayDangKyXeSo  VARCHAR(10) NOT NULL,
//     -- Các kích thước in Meters
//     CDaiThungChua   decimal(7,2 ) NOT NULL,
//     CRongThungChua   decimal(7,2 ) NOT NULL,
//     CCaoThungChua   DECIMAL(7,2) NOT NULL,
//     PRIMARY KEY (IdPhuongTien),
//     UNIQUE (BienSo)
// );

import { DataTypes } from "@sequelize/core";
import sequelize from "../db/db.js";

const PhuongTien = sequelize.define(
  "PhuongTien",
  {
    IdPhuongTien: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    BienSo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    Loai: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    TaiTrong: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },

    TrongTai: {
      type:DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    TrangThai: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    GiayDangKyXeSo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique:true,
      
    },

    CDaiThungChua: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    CRongThungChua: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    CCaoThungChua: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
  },
  { tableName: "PhuongTien", timestamps: false }
);

export default PhuongTien;
