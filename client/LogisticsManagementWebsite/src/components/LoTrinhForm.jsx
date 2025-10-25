import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function LoTrinhForm() {
  const [TenLoTrinh, setTenLoTrinh] = useState("");
  const [IdKhoBaiBatDau, setIdKhoBaiBatDau] = useState("");
  const [IdKhoBaiKetThuc, setIdKhoBaiKetThuc] = useState("");
  const [ETC, setETC ] = useState(0);
  const [KhoangCach, setKhoangCach] = useState(0); // Manual input for V1

  // State to hold your list of warehouses for the dropdowns
  const [khoBaiList, setKhoBaiList] = useState([]);
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchKhoBai = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const apiURL = process.env.VITE_APP_API;
        
    
        const response = await fetch(`${apiURL}/api/khobai`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        
        const data = await response.json();
        setKhoBaiList(data);
        setLoading(false);
        

        if (data.length > 0) {
          setIdKhoBaiBatDau(data[0].IdKhoBai);
          setIdKhoBaiKetThuc(data[0].IdKhoBai);
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchKhoBai();
  }, []); 

  const HandleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const LoTrinhData = {
      TenLoTrinh: TenLoTrinh,
      IdKhoBaiBatDau: parseInt(IdKhoBaiBatDau),
      IdKhoBaiKetThuc: parseInt(IdKhoBaiKetThuc),
      ETC:parseFloat(ETC),
      KhoangCach: parseFloat(KhoangCach) 
    };

    try {
      const apiURL = process.env.VITE_APP_API;
      const token = localStorage.getItem('userToken');

      if (!token) throw new Error("User is not authenticated.");

      const response = await fetch(`${apiURL}/api/lotrinh/createkhobai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(LoTrinhData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Tạo lộ trình thất bại");
      }

      console.log("Lộ trình được tạo!");

      navigate('/routes'); 

    } catch (error) {
      setError(error.message);
      console.log("Error :", error.message);
    }
  };

  if (loading) {
    return <p>Loading location data...</p>;
  }



  return (
    <form onSubmit={HandleSubmit}>
      <h3> Thêm Lộ Trình Mới (V1) </h3>
      <div>
        <label htmlFor="tenLoTrinh">Tên Lộ Trình</label>
        <input 
          id="tenLoTrinh" 
          type="text" 
          value={TenLoTrinh} 
          onChange={(e) => setTenLoTrinh(e.target.value)} 
          required 
          placeholder="Ví dụ: Tuyến HCM - Hà Nội"
        />
      </div>
      
      <div>
        <label htmlFor="diemBatDau">Điểm Bắt Đầu</label>
        <select 
          id="diemBatDau" 
          value={IdKhoBaiBatDau} 
          onChange={(e) => setIdKhoBaiBatDau(e.target.value)}
          required
        >
          <option value="">-- Chọn kho bãi --</option>
          {khoBaiList.map((kho) => (
            <option key={kho.IdKhoBai} value={kho.IdKhoBai}>
              {kho.TenKhoBai}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="diemKetThuc">Điểm Kết Thúc</label>
        <select 
          id="diemKetThuc" 
          value={IdKhoBaiKetThuc} 
          onChange={(e) => setIdKhoBaiKetThuc(e.target.value)}
          required
        >
          <option value="">-- Chọn kho bãi --</option>
          {khoBaiList.map((kho) => (
            <option key={kho.IdKhoBai} value={kho.IdKhoBai}>
              {kho.TenKhoBai}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="ETC">Thời gian dự kiến ( giờ )</label>
        <input 
          id="ETC" 
          type="number" 
          value={ETC} 
          onChange={(e) => setETC(e.target.value)} 
          required 
          placeholder="5"
        />
      </div>
      
      <div>
        <label htmlFor="khoangCach">Khoảng Cách (km)</label>
        <input 
          id="khoangCach" 
          type="number" 
          value={KhoangCach} 
          onChange={(e) => setKhoangCach(e.target.value)} 
          required 
          placeholder="e.g., 1710"
        />
      </div>
      
      <button type="submit"> Lưu Lộ Trình </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default LoTrinhForm;