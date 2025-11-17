import { DataTypes } from "@sequelize/core";
import sequelize from "../db/db.js";

// CREATE TABLE Csc (
//     IdContainer         INT NOT NULL,
//     PlateNumber         VARCHAR(20) NOT NULL,
//     ApprovalNumber      VARCHAR(20) NOT NULL,
//     LastInspection      DATE NOT NULL,
//     Expiry              DATE NOT NULL,
//     PRIMARY KEY (IdContainer)
// );

const CSC = sequelize.define(
  "CSC",
  {
    IdCSC: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    PlateNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    ApprovalNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    LastInspection: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    Expiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { tableName: "CSC", timestamps: false }
);

export default CSC;
