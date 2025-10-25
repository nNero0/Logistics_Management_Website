import { DataTypes} from '@sequelize/core';
import sequelize from '../db/db.js';

// IdTaiKhoan      INT NOT NULL AUTO_INCREMENT,
//     Username        VARCHAR(255) NOT NULL,
//     PasswordHash    VARCHAR(255) NOT NULL,
//     Email           VARCHAR(255) NOT NULL,
//     Sdt             VARCHAR(10) NOT NULL,

const TaiKhoan = sequelize.define('TaiKhoan', {

    IdTaiKhoan:{
        type: DataTypes.INTEGER,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    } ,
    Username:{

        type: DataTypes.STRING(255),
        allowNull: false,
        unique:true,
    },
    PasswordHash:{
               type: DataTypes.STRING(255),
        allowNull: false,
  

    },
    Email: {
                type: DataTypes.STRING(255),
        allowNull: false,
        unique:true,
    },
    Sdt :{  
                type: DataTypes.STRING(255),
        allowNull: false,

    }
 } , {tableName :'TaiKhoan',
    timestamps:false
 });

 export default TaiKhoan;
 