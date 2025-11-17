import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoTrinhForm() {

  const [NoiBatDau, setNoiBatDau] = useState("");
  const [NoiKetThuc, setNoiKetThuc] = useState("");
  const [TrangThai, setTrangThai] = useState("");
  const [ETC, setETC] = useState(0);
  const [KhoangCach, setKhoangCach] = useState(0);

  const [khoBaiList, setKhoBaiList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKhoBai = async () => {
      try {
        const apiURL = import.meta.env.VITE_APP_API;
        const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

        console.log("Fetching from:", `${apiURL}/api/khobai`);

        const response = await fetch(`${apiURL}/api/khobai`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Received data:", data);

        setKhoBaiList(data);
        setLoading(false);
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
      NoiBatDau: (NoiBatDau),
      NoiKetThuc: (NoiKetThuc),
      TrangThai: TrangThai,
      ETC: parseFloat(ETC),
      KhoangCach: parseFloat(KhoangCach),
    };

    try {
      const apiURL = import.meta.env.VITE_APP_API;
      const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

      if (!token) throw new Error("User is not authenticated.");

      const response = await fetch(`${apiURL}/api/lotrinh/createlotrinh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(LoTrinhData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Tạo lộ trình thất bại");
      }

      console.log("Lộ trình được tạo!");

      navigate("/");
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

      {/* First Dropdown - Điểm Bắt Đầu */}
       <div>
        <label htmlFor="diemBatDau">Điểm Bắt Đầu</label>
        <select 
          id="diemBatDau" 
          value={NoiBatDau} 
          onChange={(e) =>{ setNoiBatDau(e.target.value);
              if (e.target.value === NoiKetThuc){
              setNoiKetThuc("");
            }
          
          }
          }
          required
        >
          <option value="">-- Chọn kho bãi --</option>
          {khoBaiList.map((kho) => (
            <option key={kho.DiaChi} value={kho.DiaChi}>
              {kho.DiaChi}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="diemKetThuc">Điểm Kết Thúc</label>
        <select 
          id="diemKetThuc" 
          value={NoiKetThuc} 
          onChange={(e) => {setNoiKetThuc(e.target.value);
            if (e.target.value === NoiBatDau ){
              setNoiBatDau("");
            }
          }
          }
          required
        >
          <option value="">-- Chọn kho bãi --</option>
          {khoBaiList.map((kho) => (
            <option key={kho.DiaChi} value={kho.DiaChi}>
              {kho.DiaChi}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="TrangThai">Trạng thái</label>
        <select id="TrangThai" value={TrangThai} onChange={(e) => setTrangThai(e.target.value)} required>
         <option value="" disabled>
            -- Vui lòng chọn trạng thái --
          </option>
          <option value="Sẵn sàng">Sẵn sàng</option>
          <option value="Cần sự cố">Cần sự cốy</option>
          <option value="Không thể vận hành">Không thể vận hàn</option>
        </select>
      </div>
      <div>
        <label htmlFor="ETC">Thời gian dự kiến ( giờ )</label>
        <input id="ETC" type="number" value={ETC} onChange={(e) => setETC(e.target.value)} required placeholder="5" />
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
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default LoTrinhForm;
