import React, { useState, useEffect } from "react";
// Bỏ 'useNavigate' vì chúng ta không chuyển trang nữa
// import { useNavigate } from "react-router-dom";

function DonVanForm() {
  // const navigate = useNavigate(); // Không cần nữa

  // --- State cho Form ---
  const [IdKhachHang, setIdKhachHang] = useState("");
  const [IdKhoBatDau, setIdKhoBatDau] = useState("");
  const [IdKhoKetThuc, setIdKhoKetThuc] = useState("");
  const [eta, setEta] = useState("");

  const [khachHangList, setKhachHangList] = useState([]);
  const [khoList, setKhoList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading cho dropdown Khách Hàng
  const [loadingKho, setLoadingKho] = useState(false); // Loading cho dropdown Kho
  
  // --- State cho Panel Danh sách (MỚI) ---
  const [donVanList, setDonVanList] = useState([]);
  const [loadingDonVanList, setLoadingDonVanList] = useState(true);
  
  const [error, setError] = useState(null);

  const apiURL = import.meta.env.VITE_APP_API;
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  // --- Fetch cho Dropdown (Giữ nguyên) ---
  useEffect(() => {
    const fetchKhachHang = async () => {
      try {
        const res = await fetch(`${apiURL}/api/khachhang`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Không thể tải danh sách khách hàng");
        const khachHangData = await res.json();
        setKhachHangList(khachHangData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchKhachHang();
  }, [apiURL, token]);

  useEffect(() => {
    if (!IdKhachHang) {
      setKhoList([]);
      setIdKhoBatDau("");
      setIdKhoKetThuc("");
      return;
    }
    const fetchKhoCuaKhach = async () => {
      setLoadingKho(true);
      setError(null);
      try {
        // API này nên được lọc theo IdKhachHang nếu có thể
        const res = await fetch(`${apiURL}/api/khobai`, { 
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Không thể tải danh sách kho");
        const khoData = await res.json();
        setKhoList(khoData);
        setLoadingKho(false);
      } catch (err) {
        setError(err.message);
        setLoadingKho(false);
      }
    };
    fetchKhoCuaKhach();
  }, [IdKhachHang, apiURL, token]);

  // --- Fetch cho Panel Danh sách (MỚI) ---
  const fetchDonVanList = async () => {
    setLoadingDonVanList(true);
    try {
      const res = await fetch(`${apiURL}/api/donvan`, { // Giả sử đây là API lấy tất cả DonVan
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không tải được danh sách đơn vận");
      const data = await res.json();
      setDonVanList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDonVanList(false);
    }
  };

  // Tải danh sách lần đầu
  useEffect(() => {
    fetchDonVanList();
  }, [apiURL, token]);

  // --- Xử lý Submit (Đã sửa) ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!IdKhachHang || !IdKhoBatDau || !IdKhoKetThuc) {
      setError("Vui lòng chọn Khách hàng, Kho Lấy và Kho Giao.");
      return;
    }
    if (IdKhoBatDau === IdKhoKetThuc) {
      setError("Kho lấy và Kho giao không được trùng nhau.");
      return;
    }

    const DonVanData = {
      IdKhachHang, IdKhoBaiBatDau: IdKhoBatDau, IdKhoBaiKetThuc: IdKhoKetThuc,
      ETA: eta, TrangThai: "ChoXuLy",
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

      // --- THAY ĐỔI QUAN TRỌNG ---
      // navigate("/donvan/"); // Bỏ dòng này
      
      // Thay bằng: Reset form và Tải lại danh sách
      setIdKhachHang("");
      setIdKhoBatDau("");
      setIdKhoKetThuc("");
      setEta("");
      setError(null);
      alert("Tạo đơn vận thành công!");
      fetchDonVanList(); // Tải lại danh sách bên phải

    } catch (err) {
      setError(err.message);
    }
  };

  // --- Xử lý Xóa (MỚI) ---
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn vận này?")) return;
    try {
      const res = await fetch(`${apiURL}/api/donvan/delete/${id}`, { // Giả sử API Xóa của bạn
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      fetchDonVanList(); // Tải lại danh sách
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Đang tải dữ liệu khách hàng...</p>;
  }

  return (
    // === BỐ CỤC MỚI ===
    <div className="d-flex gap-4">
      
      {/* --- Form bên trái --- */}
      <form onSubmit={handleSubmit} className="p-3 border rounded bg-light flex-grow-1">
        <h3 className="mb-4">Tạo Đơn Vận Mới (Hub-to-Hub)</h3>

        {/* Chọn Khách Hàng */}
        <div className="mb-3">
          <label htmlFor="khachHang" className="form-label">
            1. Chọn Khách Hàng:
          </label>
          <select
            id="khachHang"
            className="form-select"
            value={IdKhachHang}
            onChange={(e) => setIdKhachHang(e.target.value)}
            required
          >
            <option value="" disabled> -- Chọn khách hàng -- </option>
            {khachHangList.map((kh) => (
              <option key={kh.IdKhachHang} value={kh.IdKhachHang}>
                {kh.Hoten}
              </option>
            ))}
          </select>
        </div>

        {/* Kho Lấy Hàng */}
        <div className="mb-3">
          <label htmlFor="IdKhoBatDau" className="form-label">
            2. Chọn Kho Lấy Hàng:
          </label>
          <select
            id="IdKhoBatDau"
            className="form-select"
            value={IdKhoBatDau}
            onChange={(e) => setIdKhoBatDau(e.target.value)}
            required
            disabled={!IdKhachHang || loadingKho}
          >
            <option value="" disabled> -- Chọn kho lấy hàng -- </option>
            {loadingKho && <option>Đang tải kho...</option>}
            {!loadingKho &&
              khoList.map((kho) => (
                <option key={kho.IdKhoBai} value={kho.IdKhoBai}>
                  {kho.TenKhoBai} ({kho.DiaChi})
                </option>
              ))}
          </select>
        </div>

        {/* Kho Giao Hàng */}
        <div className="mb-3">
          <label htmlFor="IdKhoKetThuc" className="form-label">
            3. Chọn Kho Giao Hàng:
          </label>
          <select
            id="IdKhoKetThuc"
            className="form-select"
            value={IdKhoKetThuc}
            onChange={(e) => setIdKhoKetThuc(e.target.value)}
            required
            disabled={!IdKhachHang || loadingKho}
          >
            <option value="" disabled> -- Chọn kho giao hàng -- </option>
            {loadingKho && <option>Đang tải kho...</option>}
            {!loadingKho &&
              khoList.map((kho) => (
                <option key={kho.IdKhoBai} value={kho.IdKhoBai}>
                  {kho.TenKhoBai} ({kho.DiaChi})
                </option>
              ))}
          </select>
        </div>

        {/* ETA */}
        <div className="mb-3">
          <label htmlFor="eta" className="form-label">
            4. Thời Gian Giao Dự Kiến (ETA):
          </label>
          <input
            id="eta"
            type="date"
            className="form-control"
            value={eta}
            onChange={(e) => setEta(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loadingKho}>
          Tạo Đon Vận
        </button>

        {error && <div className="mt-3 text-danger">{error}</div>}
      </form>

      {/* --- Sticky Summary Panel bên phải (MỚI) --- */}
      <div className="border rounded p-3 bg-white" style={{ width: "400px", height: "90vh", overflowY: "auto", position: "sticky", top: "10px" }}>
        <h5>Danh sách đơn vận</h5>
        {loadingDonVanList ? <p>Đang tải...</p> : (
          <ul className="list-group">
            {donVanList.map(dv => (
              <li key={dv.IdDonVan} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>Mã ĐV: {dv.IdDonVan}</strong>
                  <br/>
                  <small>KH: {dv.khachHang?.Hoten || 'N/A'}</small>
                  <br/>
                  <small>Trạng thái: {dv.TrangThai}</small>
                </div>
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => handleDelete(dv.IdDonVan)}
                >
                  Xóa
                </button>
              </li>
            ))}
            {donVanList.length === 0 && <li className="list-group-item">Không có đơn vận nào</li>}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DonVanForm;