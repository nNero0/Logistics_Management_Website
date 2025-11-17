import { DataTypes } from "@sequelize/core";
import sequelize from "../db/db.js";

// CREATE TABLE Invoices (
//     IdInvoice       INT NOT NULL AUTO_INCREMENT,
//     IdDonVan        INT NOT NULL,
//     NgayPhatHanh    DATETIME NOT NULL,
//     HanDong         DATETIME NOT NULL,
//     TongTien        DECIMAL(15,2) NOT NULL,
//     DonViTT         VARCHAR(3) NOT NULL,
//     TrangThai       NVARCHAR(100) NOT NULL,
//     GhiChu          NVARCHAR(255),
//     PRIMARY KEY (IdInvoice)
// );
const Invoices = sequelize.define(
  "Invoices",
  {
    IdInvoice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    IdDonVan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    NgayPhatHanh: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    HanDong: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    TongTien: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    DonViTT: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "VND",
    },
    TrangThai: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    GhiChu: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  { tableName: "Invoices", timestamps: false }
);

export default Invoices;
