import { DataTypes } from "@sequelize/core";
import sequelize from "../db/db.js";


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
      type: DataTypes.INTEGER,
      allowNull: false,
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
      type: DataTypes.STRING(3),
      allowNull: false,
    },

    GhiChu: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    NgayTao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { tableName: "HangHoa", createdAt:'NgayTao' ,updatedAt:false}
);

export default HangHoa;
