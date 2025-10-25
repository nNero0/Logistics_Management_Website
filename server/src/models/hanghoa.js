import { DataTypes } from "@sequelize/core";
import sequelize from "../db/db.js";

// CREATE TABLE HangHoa (
  //     IdHangHoa       INT NOT NULL AUTO_INCREMENT,
  //     IdDonVan        INT NOT NULL,
  //     NoiDung         NVARCHAR(255) NOT NULL,
  //     CanNang         DECIMAL(15,2) NOT NULL,
  //     ChieuDai        DECIMAL(15,2) NOT NULL,
  //     XuatXu          VARCHAR(3) NOT NULL,
  //     GhiChu          NVARCHAR(255),
  //     ChieuRong       DECIMAL(15,2) NOT NULL,
  //     ChieuCao        DECIMAL(15,2) NOT NULL,
  //     PRIMARY KEY (IdHangHoa)
// );

const HangHoa = sequelize.define(
  "HangHoa",
  {
    IdHangHoa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    IdDonVan: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    NoiDung: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    CanNang: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },

    XuatXu: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    GhiChu: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ChieuDai: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    ChieuRong: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    ChieuCao: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
  },
  { tableName: "HangHoa", createdAt: "NgayTao" }
);

export default HangHoa;
