import TaiKhoan from './taikhoan.js'
import DonVan from './donvan.js'



TaiKhoan.hasMany(Shipment,{
    foreignKey:"IDDonVan"
} )

