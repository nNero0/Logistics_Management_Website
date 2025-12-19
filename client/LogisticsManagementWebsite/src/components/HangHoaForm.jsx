import React, { useState, useEffect } from "react";

function HangHoaForm() {
  const [NoiDung, setNoiDung] = useState("");
  const [CanNang, setCanNang] = useState("");
  const [ChieuDai, setChieuDai] = useState("");
  const [ChieuRong, setChieuRong] = useState("");
  const [ChieuCao, setChieuCao] = useState("");
  const [XuatXu, setXuatXu] = useState("VN");
  const [GhiChu, setGhiChu] = useState("");
  const [error, setError] = useState(null);
  const [searchTermHH, setSearchTermHH] = useState("");
  const [idDonVan, setIdDonVan] = useState("");
  const [donVanList, setDonVanList] = useState([]);
  const [loadingDonVans, setLoadingDonVans] = useState(true);

  const [hangHoaList, setHangHoaList] = useState([]);
  const [loadingHangHoa, setLoadingHangHoa] = useState(true);

  const apiURL = import.meta.env.VITE_APP_API;
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  const fetchDonVans = async () => {
    setLoadingDonVans(true);
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

  const fetchHangHoaList = async () => {
    setLoadingHangHoa(true);
    try {
      if (!token) throw new Error("User is not authenticated.");
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

  useEffect(() => {
    fetchDonVans();
    fetchHangHoaList();
  }, [apiURL, token]);

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
      fetchHangHoaList();
      setIdDonVan("");
      setNoiDung("");
      setCanNang("");
      setChieuDai("");
      setChieuRong("");
      setChieuCao("");
      setXuatXu("VN");
      setGhiChu("");

      fetchHangHoaList();
    } catch (err) {
      setError(err.message);
      console.log("Error :", err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa hàng hóa này?")) return;
    try {
      const res = await fetch(`${apiURL}/api/hanghoa/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      fetchHangHoaList();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex gap-4">
      <form onSubmit={HandleSubmit} className="p-4 border rounded bg-light flex-grow-1">
        <h3 className="mb-4">Thêm Hàng Hóa Mới</h3>

        <div className="mb-3">
          <label htmlFor="donVan" className="form-label">
            Gán vào Đơn Vận
          </label>
          <select
            id="donVan"
            className="form-select"
            value={idDonVan}
            onChange={(e) => setIdDonVan(e.target.value)}
            required
            disabled={loadingDonVans}
          >
            <option value="">{loadingDonVans ? "Đang tải đơn vận..." : "-- Chọn một đơn vận --"}</option>
            {!loadingDonVans &&
              donVanList
                .filter((dv) => dv.TrangThai === "ChoXuLy")
                .map((dv) => (
                  <option key={dv.IdDonVan} value={dv.IdDonVan}>
                    Mã ĐV: {dv.IdDonVan} (Đi từ: {dv.DVkhoBatDau?.DiaChi} - {dv.DVkhoKetThuc?.DiaChi}) (Khách hàng:{" "}
                    {dv.khachHang?.Hoten || "N/A"})
                  </option>
                ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="noiDung" className="form-label">
            Nội Dung Hàng Hóa
          </label>
          <input
            id="noiDung"
            type="text"
            className="form-control"
            value={NoiDung}
            onChange={(e) => setNoiDung(e.target.value)}
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col">
            <label htmlFor="canNang" className="form-label">
              Cân Nặng (kg)
            </label>
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
            <label htmlFor="chieuDai" className="form-label">
              Chiều Dài (m)
            </label>
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
            <label htmlFor="chieuRong" className="form-label">
              Chiều Rộng (m)
            </label>
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
            <label htmlFor="chieuCao" className="form-label">
              Chiều Cao (m)
            </label>
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

        <div className="mb-3">
          <label htmlFor="xuatXu" className="form-label">
            Xuất Xứ (VD: VN, US, CN)
          </label>
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

        <div className="mb-3">
          <label htmlFor="ghiChu" className="form-label">
            Ghi Chú
          </label>
          <input
            id="ghiChu"
            type="text"
            className="form-control"
            value={GhiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loadingDonVans}>
          Lưu Hàng Hóa
        </button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </form>

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
        <h5>Danh sách hàng hóa ({hangHoaList.length})</h5>

        <input
          className="form-control mb-2"
          placeholder="Tìm tên hàng hoặc khách hàng..."
          value={searchTermHH}
          onChange={(e) => setSearchTermHH(e.target.value)}
        />

        {loadingHangHoa ? (
          <p>Đang tải...</p>
        ) : (
          <ul className="list-group">
            {hangHoaList
              .filter((hh) => {
                const term = searchTermHH.toLowerCase();
                const tenHang = hh.NoiDung ? hh.NoiDung.toLowerCase() : "";
                const tenKhach = hh.donVan?.khachHang?.Hoten ? hh.donVan.khachHang.Hoten.toLowerCase() : "";

                return tenHang.includes(term) || tenKhach.includes(term);
              })
              .map((hh) => (
                <li key={hh.IdHangHoa} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{hh.NoiDung}</strong>
                    <br />
                    <small>
                      ĐV: {hh.donVan?.IdDonVan || hh.IdDonVan} (KH: {hh.donVan?.khachHang?.Hoten || "N/A"}) -{" "}
                      {hh.CanNang} kg
                    </small>
                  </div>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(hh.IdHangHoa)}>
                    Xóa
                  </button>
                </li>
              ))}

            {hangHoaList.length === 0 && <li className="list-group-item">Không có hàng hóa nào</li>}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HangHoaForm;
