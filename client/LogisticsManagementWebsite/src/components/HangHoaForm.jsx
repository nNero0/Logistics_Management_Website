import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // 1. Không cần navigate nữa

function HangHoaForm() {
  // const navigate = useNavigate(); // 1. Không cần navigate nữa

  // --- State cho Form (Giữ nguyên) ---
  const [NoiDung, setNoiDung] = useState("");
  const [CanNang, setCanNang] = useState("");
  const [ChieuDai, setChieuDai] = useState("");
  const [ChieuRong, setChieuRong] = useState("");
  const [ChieuCao, setChieuCao] = useState("");
  const [XuatXu, setXuatXu] = useState("VN");
  const [GhiChu, setGhiChu] = useState("");
  const [error, setError] = useState(null);

  // --- State cho Dropdown (Giữ nguyên) ---
  const [idDonVan, setIdDonVan] = useState("");
  const [donVanList, setDonVanList] = useState([]);
  const [loadingDonVans, setLoadingDonVans] = useState(true);

  // === 2. STATE MỚI: Cho Panel Danh Sách ===
  const [hangHoaList, setHangHoaList] = useState([]);
  const [loadingHangHoa, setLoadingHangHoa] = useState(true);

  const apiURL = import.meta.env.VITE_APP_API;
  const token =
    localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  // --- 3. Fetch DonVans (cho Dropdown - Giữ nguyên) ---
  useEffect(() => {
    const fetchDonVans = async () => {
      try {
        if (!token) throw new Error("User is not authenticated.");
        const response = await fetch(`${apiURL}/api/donvan`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Không thể tải danh sách đơn vận");
        const data = await response.json();
        setDonVanList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingDonVans(false);
      }
    };
    fetchDonVans();
  }, [apiURL, token]); // Thêm dependencies

  // === 4. FETCH MỚI: Tải danh sách Hàng Hóa (cho Panel) ===
  const fetchHangHoaList = async () => {
    setLoadingHangHoa(true);
    try {
      if (!token) throw new Error("User is not authenticated.");
      // API GET hàng hóa của bạn là /api/hanghoa
      const res = await fetch(`${apiURL}/api/hanghoa`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không tải được danh sách hàng hóa");
      const data = await res.json();
      setHangHoaList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingHangHoa(false);
    }
  };

  // Tải danh sách hàng hóa khi component load
  useEffect(() => {
    fetchHangHoaList();
  }, [apiURL, token]); // Thêm dependencies

  // === 5. Cập nhật HandleSubmit ===
  const HandleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const HangHoaData = {
      IdDonVan: parseInt(idDonVan),
      NoiDung,
      CanNang: parseFloat(CanNang),
      ChieuDai: parseFloat(ChieuDai),
      ChieuRong: parseFloat(ChieuRong),
      ChieuCao: parseFloat(ChieuCao),
      XuatXu,
      GhiChu,
    };

    try {
      if (!token) throw new Error("User is not authenticated.");
      const response = await fetch(`${apiURL}/api/hanghoa/createhanghoa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(HangHoaData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Tạo hàng hóa thất bại");
      }

      // Reset form
      setIdDonVan("");
      setNoiDung("");
      setCanNang("");
      setChieuDai("");
      setChieuRong("");
      setChieuCao("");
      setXuatXu("VN");
      setGhiChu("");

      // navigate("/hanghoa/createhanghoa"); // Bỏ dòng này
      alert("Tạo hàng hóa thành công!");
      fetchHangHoaList(); // Tải lại danh sách bên phải
    } catch (err) {
      setError(err.message);
      console.log("Error :", err.message);
    }
  };

  // === 6. HÀM MỚI: Xử lý Xóa ===
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa hàng hóa này?")) return;
    try {
      // API Xóa của bạn là /api/hanghoa/delete/:id
      const res = await fetch(`${apiURL}/api/hanghoa/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      fetchHangHoaList(); // Tải lại danh sách
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    // === 7. BỐ CỤC MỚI ===
    <div className="d-flex gap-4">
      {/* --- Form bên trái --- */}
      <form onSubmit={HandleSubmit} className="p-4 border rounded bg-light flex-grow-1">
        <h3 className="mb-4">Thêm Hàng Hóa Mới</h3>

        {/* Dropdown Đơn Vận */}
        <div className="mb-3">
          <label htmlFor="donVan" className="form-label">Gán vào Đơn Vận</label>
          <select
            id="donVan"
            className="form-select"
            value={idDonVan}
            onChange={(e) => setIdDonVan(e.target.value)}
            required
            disabled={loadingDonVans}
          >
            <option value="">
              {loadingDonVans ? "Đang tải đơn vận..." : "-- Chọn một đơn vận --"}
            </option>
            {!loadingDonVans &&
              donVanList.map((dv) => (
                <option key={dv.IdDonVan} value={dv.IdDonVan}>
                  Mã ĐV: {dv.IdDonVan} ( Đi từ: {dv.DVkhoBatDau?.DiaChi} -{" "}
                  {dv.DVkhoKetThuc?.DiaChi} ) (Khách hàng:{" "}
                  {dv.khachHang?.Hoten || "N/A"})
                </option>
              ))}
          </select>
        </div>

        {/* Nội Dung Hàng Hóa */}
        <div className="mb-3">
          <label htmlFor="noiDung" className="form-label">Nội Dung Hàng Hóa</label>
          <input
            id="noiDung"
            type="text"
            className="form-control"
            value={NoiDung}
            onChange={(e) => setNoiDung(e.target.value)}
            required
          />
        </div>

        {/* Kích thước & Cân nặng */}
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="canNang" className="form-label">Cân Nặng (kg)</label>
            <input
              id="canNang"
              type="number"
              step="0.01"
              className="form-control"
              value={CanNang}
              onChange={(e) => setCanNang(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <label htmlFor="chieuDai" className="form-label">Chiều Dài (m)</label>
            <input
              id="chieuDai"
              type="number"
              step="0.01"
              className="form-control"
              value={ChieuDai}
              onChange={(e) => setChieuDai(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label htmlFor="chieuRong" className="form-label">Chiều Rộng (m)</label>
            <input
              id="chieuRong"
              type="number"
              step="0.01"
              className="form-control"
              value={ChieuRong}
              onChange={(e) => setChieuRong(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <label htmlFor="chieuCao" className="form-label">Chiều Cao (m)</label>
            <input
              id="chieuCao"
              type="number"
              step="0.01"
              className="form-control"
              value={ChieuCao}
              onChange={(e) => setChieuCao(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Xuất Xứ */}
        <div className="mb-3">
          <label htmlFor="xuatXu" className="form-label">Xuất Xứ (VD: VN, US, CN)</label>
          <input
            id="xuatXu"
            type="text"
            className="form-control"
            value={XuatXu}
            onChange={(e) => setXuatXu(e.target.value)}
            maxLength={3}
            required
          />
        </div>

        {/* Ghi Chú */}
        <div className="mb-3">
          <label htmlFor="ghiChu" className="form-label">Ghi Chú</label>
          <input
            id="ghiChu"
            type="text"
            className="form-control"
            value={GhiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loadingDonVans}
        >
          Lưu Hàng Hóa
        </button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </form>

      {/* --- Sticky Panel bên phải (Đã Cập nhật) --- */}
      <div
        className="border rounded p-3 bg-white"
        style={{
          width: "400px",
          height: "90vh",
          overflowY: "auto",
          position: "sticky",
          top: "10px",
        }}
      >
        <h5>Danh sách hàng hóa</h5>
        {loadingHangHoa ? (
          <p>Đang tải...</p>
        ) : (
          <ul className="list-group">
            {hangHoaList.map((hh) => (
              <li
                key={hh.IdHangHoa}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{hh.NoiDung}</strong>
                  <br />
                  {/* === CẢI TIẾN Ở ĐÂY === */}
                  <small>
                    ĐV: {hh.donVan?.IdDonVan || hh.IdDonVan} (KH:{" "}
                    {hh.donVan?.khachHang?.Hoten || "N/A"}) - {hh.CanNang}kg
                  </small>
                </div>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(hh.IdHangHoa)}
                >
                  Xóa
                </button>
              </li>
            ))}
            {hangHoaList.length === 0 && (
              <li className="list-group-item">Không có hàng hóa nào</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HangHoaForm;