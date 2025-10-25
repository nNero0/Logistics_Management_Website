import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HangHoaForm from './HangHoaForm';

function DonVanForm() {
  const navigate = useNavigate();
  

  const [tenNguoiGui, setTenNguoiGui] = useState('');
  const [sdtNguoiGui, setSdtNguoiGui] = useState('');
  const [diaChiNguoiGui, setDiaChiNguoiGui] = useState('');



  const [hangHoaList, setHangHoaList] = useState([]);
  const [error, setError] = useState(null);


  const handleAddItem = (newItem) => {
    setHangHoaList(prevList => [...prevList, newItem]);
  };


  const handleCreateShipment = async (e) => {
    e.preventDefault();
    
    if (hangHoaList.length === 0) {
      setError("Bạn phải thêm ít nhất 1 món hàng.");
      return;
    }


    const shipmentData = {
      nguoiGui: { ten: tenNguoiGui, sdt: sdtNguoiGui, diaChi: diaChiNguoiGui },
      nguoiNhan: { /* ... */ },
      hanhTrinh: { /* ... */ },
     
      danhSachHangHoa: hangHoaList 
    };

    try {
      const token = localStorage.getItem('userToken');
      const apiURL = process.env.VITE_APP_API;
      
      const response = await fetch(`${apiURL}/api/donvan/createdonvan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shipmentData)
      });
      
      if (!response.ok) throw new Error("Tạo đơn vận thất bại");
      
      navigate('/');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleCreateShipment}>
      <h2>Tạo Đơn Vận Chuyển Mới</h2>
      

      <h3>Thông Tin Người Gửi</h3>
      <input value={tenNguoiGui} onChange={e => setTenNguoiGui(e.target.value)} placeholder="Tên Người Gửi" />

      
      <h3>Thông Tin Người Nhận</h3>

      
      <hr />
      

      <HangHoaItemForm onAddItem={handleAddItem} />
      
      <hr />

      <h3>Danh Sách Hàng Hoá Đã Thêm</h3>
      {hangHoaList.length === 0 ? (
        <p>Chưa có hàng hoá nào.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Tên Hàng</th>
              <th>Số Lượng</th>
              <th>Cân Nặng</th>
            </tr>
          </thead>
          <tbody>
            {hangHoaList.map((item, index) => (
              <tr key={index}>
                <td>{item.TenHang}</td>
                <td>{item.SoLuong}</td>
                <td>{item.CanNang} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <button type="submit" style={{ marginTop: '20px', fontSize: '1.2em' }}>
        Tạo Đơn Vận Chuyển
      </button>
    </form>
  );
}

export default DonVanForm;