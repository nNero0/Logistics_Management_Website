import React, { useState, useEffect } from "react";

function KhoBaiForm() {
  const [DiaChi, setDiaChi] = useState("");
  const [SucChuaTong, setSucChuaTong] = useState(0);
  const [TrangThai, setTrangThai] = useState("Có sẵn");
  const [LoaiKho, setLoaiKho] = useState("Lưu trữ");
  const [KhoBaiList, setKhoBaiList] = useState([]);
  const [loadingKB, setLoadingKB] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const apiURL = import.meta.env.VITE_APP_API;
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  // --- Load KhoBai ---
  const fetchKhoBai = async () => {
    setLoadingKB(true);
    try {
      const res = await fetch(`${apiURL}/api/khobai`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không tải được danh sách kho bãi");
      const data = await res.json();
      setKhoBaiList(data);
      setLoadingKB(false);
    } catch (err) {
      setError(err.message);
      setLoadingKB(false);
    }
  };

  useEffect(() => {
    fetchKhoBai();
  }, []);

  // --- Submit Form ---
  const HandleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const KhoBaiData = {
      DiaChi,
      SucChuaTong: Number(SucChuaTong),
      TrangThai,
      LoaiKho,
    };

    try {
      const res = await fetch(`${apiURL}/api/khobai/createkhobai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(KhoBaiData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Tạo kho bãi thất bại");
      }

      setDiaChi("");
      setSucChuaTong(0);
      setTrangThai("Có sẵn");
      setLoaiKho("Lưu trữ");
      fetchKhoBai(); // reload danh sách
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Delete KhoBai ---
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa kho bãi này?")) return;
    try {
      const res = await fetch(`${apiURL}/api/khobai/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      fetchKhoBai();
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Filter danh sách theo searchTerm ---
  const filteredKhoBai = KhoBaiList.filter((kb) => kb.DiaChi.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="d-flex gap-4">
      {/* --- Form bên trái --- */}
      <form onSubmit={HandleSubmit} className="p-4 border rounded bg-light flex-grow-1">
        <h3 className="mb-4">Thêm Kho Bãi / Địa Điểm Mới</h3>
        <div className="mb-3">
          <label className="form-label">Bản đồ (Tham khảo)</label>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59587.978404675625!2d105.79576387871435!3d21.022734639773788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2sHanoi%2C%20Vietnam!5e0!3m2!1sen!2s!4v1763425353875!5m2!1sen!2s" // <-- Dán code 'src' của BẠN vào đây
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: "8px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>{" "}
        <div className="mb-3">
          <label htmlFor="diaChi" className="form-label">
            Địa Chỉ
          </label>
          <input
            id="diaChi"
            type="text"
            className="form-control"
            value={DiaChi}
            onChange={(e) => setDiaChi(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="SucChuaTong" className="form-label">
            Sức chứa tổng
          </label>
          <input
            id="SucChuaTong"
            type="number"
            className="form-control"
            value={SucChuaTong}
            onChange={(e) => setSucChuaTong(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="TrangThai" className="form-label">
            Trạng thái
          </label>
          <select
            id="TrangThai"
            className="form-select"
            value={TrangThai}
            onChange={(e) => setTrangThai(e.target.value)}
          >
            <option value="Có sẵn">Có sẵn</option>
            <option value="Gần đầy">Gần đầy</option>
            <option value="Đầy">Đầy</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="LoaiKho" className="form-label">
            Loại Kho Bãi
          </label>
          <select id="LoaiKho" className="form-select" value={LoaiKho} onChange={(e) => setLoaiKho(e.target.value)}>
            <option value="Lưu trữ">Lưu trữ</option>
            <option value="Điểm Trung Chuyển">Điểm Trung Chuyển</option>
            <option value="Điểm Giao Hàng">Điểm Giao Hàng</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Lưu Địa Điểm
        </button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </form>

      {/* --- Sticky Panel bên phải --- */}
      <div
        className="border rounded p-3 bg-white"
        style={{ width: "350px", height: "90vh", overflowY: "auto", position: "sticky", top: "10px" }}
      >
        <h5>Danh sách Kho Bãi</h5>

        {/* --- Search Bar --- */}
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Tìm theo địa chỉ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loadingKB ? (
          <p>Đang tải...</p>
        ) : (
          <ul className="list-group">
            {filteredKhoBai.map((kb) => (
              <li key={kb.id} className="list-group-item d-flex justify-content-between align-items-center">
                {kb.DiaChi} ({kb.TrangThai})
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(kb.id)}>
                  Xóa
                </button>
              </li>
            ))}
            {filteredKhoBai.length === 0 && <li className="list-group-item">Không có kho bãi nào</li>}
          </ul>
        )}
      </div>
    </div>
  );
}

export default KhoBaiForm;
