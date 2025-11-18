import React, { useState, useEffect } from "react";

function KhachHangForm() {
  const [Hoten, setHoten] = useState("");
  const [Sdt, setSdt] = useState("");
  const [Email, setEmail] = useState("");
  const [KhachHangList, setKhachHangList] = useState([]);
  const [loadingKH, setLoadingKH] = useState(true);
  const [error, setError] = useState(null);

  const apiURL = import.meta.env.VITE_APP_API;
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  // --- Load danh sách khách hàng ---
  const fetchKhachHang = async () => {
    setLoadingKH(true);
    try {
      const res = await fetch(`${apiURL}/api/khachhang`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không tải được danh sách khách hàng");
      const data = await res.json();
      setKhachHangList(data);
      setLoadingKH(false);
    } catch (err) {
      setError(err.message);
      setLoadingKH(false);
    }
  };

  useEffect(() => {
    fetchKhachHang();
  }, []);

  // --- Submit Form ---
  const HandleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const KhachHangData = { Hoten, Sdt, Email };

    try {
      const res = await fetch(`${apiURL}/api/khachhang/createkhachhang`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(KhachHangData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Tạo khách hàng thất bại");
      }

      // reset form
      setHoten("");
      setSdt("");
      setEmail("");
      fetchKhachHang(); // reload danh sách
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Delete KhachHang ---
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
    try {
      const res = await fetch(`${apiURL}/api/khachhang/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      fetchKhachHang();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex gap-4">
      {/* --- Form bên trái --- */}
      <form onSubmit={HandleSubmit} className="p-4 border rounded bg-light flex-grow-1">
        <h3 className="mb-4">Thêm Khách Hàng Mới</h3>

        <div className="mb-3">
          <label htmlFor="tenKhachHang" className="form-label">Tên Khách Hàng / Công Ty</label>
          <input
            id="tenKhachHang"
            type="text"
            className="form-control"
            value={Hoten}
            onChange={(e) => setHoten(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="sdt" className="form-label">Số điện thoại</label>
          <input
            id="sdt"
            type="text"
            className="form-control"
            value={Sdt}
            onChange={(e) => setSdt(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Lưu Khách Hàng</button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </form>

      {/* --- Sticky Panel bên phải --- */}
      <div className="border rounded p-3 bg-white" style={{ width: "350px", height: "90vh", overflowY: "auto", position: "sticky", top: "10px" }}>
        <h5>Danh sách khách hàng</h5>
        {loadingKH ? <p>Đang tải...</p> : (
          <ul className="list-group">
            {KhachHangList.map(kh => (
              <li key={kh.id} className="list-group-item d-flex justify-content-between align-items-center">
                {kh.Hoten} ({kh.Sdt})
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(kh.id)}>Xóa</button>
              </li>
            ))}
            {KhachHangList.length === 0 && <li className="list-group-item">Không có khách hàng nào</li>}
          </ul>
        )}
      </div>
    </div>
  );
}

export default KhachHangForm;
