import { DataTypes} from '@sequelize/core';
import sequelize from '../db/db.js';


    // IdRole          INT NOT NULL AUTO_INCREMENT,
    // IdTaiKhoan      INT NOT NULL,
    // RoleName        NVARCHAR(255) NOT NULL,
    // PRIMARY KEY (IdRole)

const VaiTro = sequelize.define('VaiTro', {

    IdRole:{
        type: DataTypes.INTEGER,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    } ,
    IdTaiKhoan :{

        type: DataTypes.STRING(255),
        allowNull: false,
        unique:true,
    },
    RoleName:{
               type: DataTypes.STRING(255),
        allowNull: false,
  

    },
    
 } , {tableName :'VaiTro',
    timestamps:false
 });

 export default VaiTro;
 