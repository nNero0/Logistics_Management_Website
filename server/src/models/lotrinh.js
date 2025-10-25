import { DataTypes } from "@sequelize/core";
import sequelize from "../config/database.js";

// CREATE TABLE LoTrinh (
//     IdLoTrinh       INT NOT NULL AUTO_INCREMENT,
//     NoiBatDau       NVARCHAR(255) NOT NULL,
//     NoiKetThuc      NVARCHAR(255) NOT NULL,
//     TrangThai       NVARCHAR(255) NOT NULL,
//     ETC             DECIMAL(15,2) NOT NULL,
//     PRIMARY KEY (IdLoTrinh)
// );

const LoTrinh = sequelize.define(
  "LoTrinh",
  {
    IDLoTrinh: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    NoiBatDau: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    NoiKetThuc: {
      type: DataTypes.STRING(255),
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
  },
  { tableName: "LoTrinh",timestamps :false }
);

export default LoTrinh;
