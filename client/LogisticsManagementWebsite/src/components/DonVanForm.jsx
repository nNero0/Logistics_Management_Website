import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DonVanForm() {
  // --- STATE CHÍNH ---
  const [IdKhachHang, setIdKhachHang] = useState("");
  // --- THAY ĐỔI: Bỏ IDLoTrinh, thêm 2 state kho ---
  const [IdKhoBatDau, setIdKhoBatDau] = useState("");
  const [IdKhoKetThuc, setIdKhoKetThuc] = useState("");
  const [eta, setEta] = useState("");

  // --- STATE CHO CÁC DROPDOWN ---
  const [khachHangList, setKhachHangList] = useState([]);
  const [khoList, setKhoList] = useState([]); // <-- Danh sách kho của khách hàng đã chọn

  // --- STATE CHO UI ---
  const [loading, setLoading] = useState(true); // Loading trang ban đầu
  const [loadingKho, setLoadingKho] = useState(false); // Loading khi chọn khách hàng
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const apiURL = import.meta.env.VITE_APP_API;
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  // --- EFFECT 1: Tải danh sách Khách Hàng (chỉ 1 lần khi tải trang) ---
  useEffect(() => {
    const fetchKhachHang = async () => {
      try {
        const res = await fetch(`${apiURL}/api/khachhang`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Không thể tải danh sách khách hàng");
        
        const khachHangData = await res.json();
        setKhachHangList(khachHangData);
        setLoading(false); // Xong loading ban đầu
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchKhachHang();
  }, [apiURL, token]); // Mảng phụ thuộc


  // --- EFFECT 2: Tải danh sách Kho Bãi KHI Khách Hàng thay đổi ---
  useEffect(() => {
    // Nếu IDKhachHang rỗng (chưa chọn), thì reset
    if (!IdKhachHang) {
      setKhoList([]);
      setIdKhoBatDau("");
      setIdKhoKetThuc("");
      return;
    }

    // Nếu đã chọn khách hàng, fetch danh sách kho của họ
    const fetchKhoCuaKhach = async () => {
      setLoadingKho(true); // Bắt đầu loading kho
      setError(null);
      try {
        // API MỚI: Bạn cần tạo API này ở backend
        const res = await fetch(`${apiURL}/api/khobai`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Không thể tải danh sách kho của khách hàng này");

        const khoData = await res.json();
        setKhoList(khoData); // Set danh sách kho cho cả 2 dropdown
        setLoadingKho(false); // Tắt loading kho
      } catch (err) {
        setError(err.message);
        setLoadingKho(false);
      }
    };

    fetchKhoCuaKhach();
  }, [IdKhachHang, apiURL, token]); // Effect này "theo dõi" IDKhachHang


  // ----- XỬ LÝ SUBMIT FORM -----
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // Đảm bảo các dropdown đã được chọn
    if (!IdKhachHang || !IdKhoBatDau || !IdKhoKetThuc) {
      setError("Vui lòng chọn Khách hàng, Kho Lấy và Kho Giao.");
      return;
    }
    if (IdKhoBatDau === IdKhoKetThuc) {
      setError("Kho lấy và Kho giao không được trùng nhau.");
      return;
    }

    // --- THAY ĐỔI: Gửi dữ liệu kho, bỏ lộ trình ---
    const DonVanData = {
      IdKhachHang: IdKhachHang,
      IdKhoBaiBatDau:IdKhoBatDau,   // <-- Dữ liệu mới
      IdKhoBaiKetThuc: IdKhoKetThuc, // <-- Dữ liệu mới
      ETA: eta,
      TrangThai: "Chờ điều phối"
 
    };

    try {
      const response = await fetch(`${apiURL}/api/donvan/createdonvan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(DonVanData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Tạo đơn vận thất bại");
      }

      console.log("Đơn vận đã được tạo!");
      navigate("/donvan/createdonvan"); // Chuyển hướng đến trang quản lý / điều phối
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Đang tải dữ liệu khách hàng...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Tạo Đơn Vận Mới (Hub-to-Hub)</h3>

      {/* --- 1. Chọn Khách Hàng --- */}
      <div>
        <label htmlFor="khachHang">1. Chọn Khách Hàng:</label>
        <select id="khachHang" value={IdKhachHang} onChange={(e) => setIdKhachHang(e.target.value)} required>
          <option value="" disabled> -- Chọn khách hàng -- </option>
          {khachHangList.map((kh) => (
            <option key={kh.IdKhachHang} value={kh.IdKhachHang}>
              {kh.Hoten}
            </option>
          ))}
        </select>
      </div>

      {/* --- 2. Chọn Kho Lấy Hàng --- */}
      <div>
        <label htmlFor="IdKhoBatDau">2. Chọn Kho Lấy Hàng:</label>
        <select 
          id="IdKhoBatDau" 
          value={IdKhoBatDau} 
          onChange={(e) => setIdKhoBatDau(e.target.value)} 
          required
          disabled={!IdKhachHang || loadingKho} // <-- Vô hiệu hóa khi chưa chọn khách hoặc đang tải
        >
          <option value="" disabled> -- Chọn kho lấy hàng -- </option>
          {loadingKho && <option>Đang tải kho...</option>}
          {!loadingKho && khoList.map((kho) => (
            <option key={kho.IdKhoBai} value={kho.IdKhoBai}>
              ({kho.DiaChi})
            </option>
          ))}
        </select>
      </div>

      {/* --- 3. Chọn Kho Giao Hàng --- */}
      <div>
        <label htmlFor="IdKhoKetThuc">3. Chọn Kho Giao Hàng:</label>
        <select 
          id="IdKhoKetThuc" 
          value={IdKhoKetThuc} 
          onChange={(e) => setIdKhoKetThuc(e.target.value)} 
          required
          disabled={!IdKhachHang || loadingKho} // <-- Vô hiệu hóa
        >
          <option value="" disabled> -- Chọn kho giao hàng -- </option>
          {loadingKho && <option>Đang tải kho...</option>}
          {!loadingKho && khoList.map((kho) => (
            <option key={kho.IdKhoBai} value={kho.IdKhoBai}>
              ({kho.DiaChi})
            </option>
          ))}
        </select>
      </div>

      {/* --- BỎ LỘ TRÌNH --- */}
      {/* (Đã xóa dropdown Lộ Trình) */}

      {/* --- 4. Chọn ETA --- */}
      <div>
        <label htmlFor="eta">4. Thời Gian Giao Dự Kiến (ETA):</label>
        <input id="eta" type="datetime-local" value={eta} onChange={(e) => setEta(e.target.value)} required />
      </div>

      <button type="submit" disabled={loadingKho}>Tạo Đơn Vận (Chờ điều phối)</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
    
  );
}

export default DonVanForm;