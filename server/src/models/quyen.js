import { DataTypes} from '@sequelize/core';
import sequelize from '../db/db.js';


    // IdPerm          INT NOT NULL AUTO_INCREMENT,
    // IdRole          INT NOT NULL,
    // TenQuyen        NVARCHAR(255) NOT NULL,
    // MoTaQuyen       NVARCHAR(255) NOT NULL,
    // PRIMARY KEY (IdPerm)

const Quyen = sequelize.define('Quyen', {

IdPerm: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  IdRole: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  TenQuyen: {
    type: DataTypes.STRING(255),  // NVARCHAR(255)
    allowNull: false
  },
  MoTaQuyen: {
    type: DataTypes.STRING(255),  // NVARCHAR(255)
    allowNull: false
  }
} 
  , {tableName :'Quyen',
    timestamps:false
  });

 export default Quyen;
 