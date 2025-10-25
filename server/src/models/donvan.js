import { DataTypes} from '@sequelize/core';
import sequelize from "../config/database.js";

// IdDonVan        INT NOT NULL AUTO_INCREMENT,
// IdLoTrinh       INT NOT NULL,
// IdKhachHang     INT NOT NULL,
// DiaDiemGiao     NVARCHAR(255) NOT NULL,

// ETA             DATETIME NOT NULL,
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
    IDLoTrinh: {
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
  },
  { tableName: "DonVan", createdAt: "NgayLapDon", updatedAt: false }
);

export default DonVan;
