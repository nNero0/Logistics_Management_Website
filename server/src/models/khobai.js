import { DataTypes} from '@sequelize/core';
import sequelize from '../db/db.js';

// CREATE TABLE KhoBai (
//     IdKhoBai            INT NOT NULL AUTO_INCREMENT,
//     DiaChi              NVARCHAR(255) NOT NULL,
//     SucChuaTong         DECIMAL(8,2) NOT NULL,
//     TrangThai           NVARCHAR(255) NOT NULL,
//     LoaiKho             NVARCHAR(255),
//     PRIMARY KEY (IdKhoBai),
//     UNIQUE (DiaChi)
// );
const KhoBai = sequelize.define('KhoBai', {

    IdKhoBai:{
        type: DataTypes.INTEGER,
        allowNull:false,
        autoIncrement: true,
        primaryKey:true
    } ,
    DiaChi:{

        type: DataTypes.STRING(255),
        allowNull: false,
        unique:true,
    },
    SucChuaTong:{
               type: DataTypes.DECIMAL(8,2),
        allowNull: false,
  

    },
    TrangThai: {
                type: DataTypes.STRING(255),
        allowNull: false,
    },
    LoaiKho:{  
                type: DataTypes.STRING(255),
        allowNull: false,

    }
 } , {tableName :'KhoBai',
    timestamps:false
 });

 export default KhoBai;
 