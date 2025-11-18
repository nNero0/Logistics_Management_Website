import React, { useState, useEffect } from "react";


function PhuongTienForm() {
  const [BienSo, SetBienSo] = useState("");
  const [Loai, SetLoai] = useState("");
  const [TaiTrong, SetTaiTrong] = useState(0); // Tải trọng hiện tại (nên = 0 khi tạo)
  const [TrongTai, SetTrongTai] = useState(0); // Tải trọng tối đa (cần nhập)
  const [TrangThai, SetTrangThai] = useState("SanSang");
  const [GiayDangKyXeSo, SetGiayDangKyXeSo] = useState("");
  const [CDaiThungChua, SetCDaiThungChua] = useState(0);
  const [CRongThungChua, SetCRongThungChua] = useState(0);
  const [CCaoThungChua, SetCCaoThungChua] = useState(0);

  const [IdViTriHienTai, setIdViTriHienTai] = useState("");
  const [KhoBaiList, setKhoBaiList] = useState([]);
  const [PhuongTienList, setPhuongTienList] = useState([]);
  const [loadingKhoBai, setLoadingKhoBai] = useState(true);
  const [loadingPT, setLoadingPT] = useState(true);
  const [error, setError] = useState(null);

  const apiURL = import.meta.env.VITE_APP_API;
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  // --- Load KhoBai (Đã thêm check 401) ---
  useEffect(() => {
    const fetchKhoBai = async () => {
      try {
        const res = await fetch(`${apiURL}/api/khobai`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) return handleLogoutAndRedirect(); // Check 401
        if (!res.ok) throw new Error("Không thể tải kho bãi");
        const data = await res.json();
        setKhoBaiList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingKhoBai(false);
      }
    };
    fetchKhoBai();
  }, [apiURL, token]); // Thêm dependencies

  // --- Load PhuongTien (Đã thêm check 401) ---
  const fetchPhuongTien = async () => {
    setLoadingPT(true);
    try {
      const res = await fetch(`${apiURL}/api/phuongtien`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return handleLogoutAndRedirect(); // Check 401
      if (!res.ok) throw new Error("Không tải được danh sách phương tiện");
      const data = await res.json();
      setPhuongTienList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingPT(false);
    }
  };

  useEffect(() => {
    fetchPhuongTien();
  }, [apiURL, token]); // Thêm dependencies

  // --- Submit Form (Đã thêm check 401) ---
  const HandleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!IdViTriHienTai) {
      setError("Vui lòng chọn kho bãi");
      return;
    }
    const payload = {
      BienSo, Loai, TaiTrong: Number(TaiTrong), TrongTai: Number(TrongTai),
      TrangThai, GiayDangKyXeSo, CDaiThungChua: Number(CDaiThungChua),
      CRongThungChua: Number(CRongThungChua), CCaoThungChua: Number(CCaoThungChua),
      IdKhoBai: Number(IdViTriHienTai)
    };

    try {
      const res = await fetch(`${apiURL}/api/phuongtien/createphuongtien`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) return handleLogoutAndRedirect(); // Check 401
      if (!res.ok) throw new Error("Tạo phương tiện thất bại");
      alert("Tạo phương tiện thành công!");
      // reset form
      SetBienSo(""); SetLoai(""); SetTaiTrong(0); SetTrongTai(0);
      SetTrangThai("SanSang"); SetGiayDangKyXeSo("");
      SetCDaiThungChua(0); SetCRongThungChua(0); SetCCaoThungChua(0); setIdViTriHienTai("");
      fetchPhuongTien(); // reload list
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Delete PhuongTien (Đã thêm check 401) ---
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa phương tiện này?")) return;
    try {
      const res = await fetch(`${apiURL}/api/phuongtien/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return handleLogoutAndRedirect(); // Check 401
      if (!res.ok) throw new Error("Xóa thất bại");
      fetchPhuongTien();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    // 2. SỬA LỖI: Xóa 1 thẻ <form> bị lồng
    <div className="container-fluid">
      <div className="row">
        {/* --- Form bên trái (Tăng độ rộng) --- */}
        <div className="col-md-7">
          <form onSubmit={HandleSubmit} className="p-4 border rounded bg-light flex-grow-1">
            <h3 className="mb-4">Thêm phương tiện mới</h3>

            <div className="mb-3">
              <label htmlFor="BienSo" className="form-label">Biển số</label>
              <input id="BienSo" type="text" className="form-control" value={BienSo} onChange={(e) => SetBienSo(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label htmlFor="Loai" className="form-label">Loại phương tiện</label>
              <input id="Loai" type="text" className="form-control" value={Loai} onChange={(e) => SetLoai(e.target.value)} placeholder="VD: Xe tải 5 tấn, Container..." required />
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="TrongTai" className="form-label">Trọng Tải Tối Đa (kg)</label>
                <input id="TrongTai" type="number" className="form-control" value={TrongTai} onChange={(e) => SetTrongTai(e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="TaiTrong" className="form-label">Tải Trọng Hiện Tại (kg)</label>
                <input id="TaiTrong" type="number" className="form-control" value={TaiTrong} onChange={(e) => SetTaiTrong(e.target.value)} required />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="TrangThai" className="form-label">Trạng Thái</label>
              <select id="TrangThai" className="form-select" value={TrangThai} onChange={(e) => SetTrangThai(e.target.value)} required>
                <option value="SanSang">Sẵn sàng (Đang rảnh)</option>
                <option value="DangChay">Đang chạy (Đang vận chuyển)</option>
                <option value="BaoTri">Đang bảo trì</option>
                <option value="KhongHoatDong">Không hoạt động</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="GiayDangKyXeSo" className="form-label">Số Giấy Đăng Ký Xe</label>
              <input id="GiayDangKyXeSo" type="text" className="form-control" value={GiayDangKyXeSo} onChange={(e) => SetGiayDangKyXeSo(e.target.value)} required />
            </div>

            <h5 className="mt-4">Kích thước thùng chứa</h5>
            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="CDaiThungChua" className="form-label">Chiều Dài (m)</label>
                <input id="CDaiThungChua" type="number" step="0.01" className="form-control" value={CDaiThungChua} onChange={(e) => SetCDaiThungChua(e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label htmlFor="CRongThungChua" className="form-label">Chiều Rộng (m)</label>
                <input id="CRongThungChua" type="number" step="0.01" className="form-control" value={CRongThungChua} onChange={(e) => SetCRongThungChua(e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label htmlFor="CCaoThungChua" className="form-label">Chiều Cao (m)</label>
                <input id="CCaoThungChua" type="number" step="0.01" className="form-control" value={CCaoThungChua} onChange={(e) => SetCCaoThungChua(e.target.value)} required />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="ViTri" className="form-label">Vị Trí Hiện Tại (Kho Bãi)</label>
              <select id="ViTri" className="form-select" value={IdViTriHienTai} onChange={(e) => setIdViTriHienTai(e.target.value)} required disabled={loadingKhoBai}>
                <option value="">{loadingKhoBai ? "Đang tải kho bãi..." : "-- Chọn kho bãi --"}</option>
                {KhoBaiList.map((kho) => (
                  // 3. SỬA LỖI HIỂN THỊ:
                  <option key={kho.IdKhoBai} value={kho.IdKhoBai}>{kho.TenKhoBai} ({kho.DiaChi})</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loadingKhoBai}>Lưu phương tiện</button>
            {error && <p className="text-danger mt-2">{error}</p>}
          </form>
        </div>

        {/* --- Sticky Summary Panel bên phải (Giảm độ rộng) --- */}
        <div className="col-md-5">
          <div className="border rounded p-3 bg-white" style={{ height: "90vh", overflowY: "auto", position: "sticky", top: "20px" }}>
            <h5>Danh sách phương tiện</h5>
            {loadingPT ? <p>Đang tải...</p> : (
              <ul className="list-group">
                {PhuongTienList.map(pt => (
                  // 4. SỬA LỖI KEY:
                  <li key={pt.IdPhuongTien} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{pt.BienSo}</strong> ({pt.Loai})
                      <br/>
                      <small>Trạng thái: {pt.TrangThai}</small>
                    </div>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(pt.IdPhuongTien)}>Xóa</button>
                  </li>
                ))}
                {PhuongTienList.length === 0 && <li className="list-group-item">Không có phương tiện nào</li>}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhuongTienForm;