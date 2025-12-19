import React, { useState, useEffect } from "react";

const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};

function TaiXeForm() {
  const [Hoten, setHoten] = useState("");
  const [Sdt, setSdt] = useState("");
  const [Email, setEmail] = useState("");
  const [BangLai, setBangLai] = useState("");
  const [TrangThaiNghiepVu, setTrangThaiNghiepVu] = useState("SanSang");

  const [LyDoChiTiet, setLyDoChiTiet] = useState("");
  const [CCCD, setCCCD] = useState("");
  const [NgayCapCCCD, setNgayCapCCCD] = useState(getTodayString());
  const [NoiCapCCCD, setNoiCapCCCD] = useState("");

  const [IdViTriHienTai, setIdViTriHienTai] = useState("");

  const [KhoBaiList, setKhoBaiList] = useState([]);
  const [TaiXeList, setTaiXeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiURL = import.meta.env.VITE_APP_API;
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  useEffect(() => {
    const fetchKhoBai = async () => {
      try {
        const res = await fetch(`${apiURL}/api/khobai`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Lỗi tải kho bãi");
        const data = await res.json();
        setKhoBaiList(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchKhoBai();
  }, [apiURL, token]);

  const fetchTaiXe = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiURL}/api/taixe`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Lỗi tải danh sách tài xế");
      const data = await res.json();
      setTaiXeList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaiXe();
  }, [apiURL, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!IdViTriHienTai) {
      setError("Vui lòng chọn vị trí hiện tại cho tài xế.");
      return;
    }

    const TaiXeData = {
      Hoten,
      Sdt,
      Email,
      BangLai,
      TrangThaiNghiepVu,

      LyDoChiTiet: TrangThaiNghiepVu === "SanSang" ? null : LyDoChiTiet,
      CCCD,
      NgayCapCCCD,
      NoiCapCCCD,
      IdKhoBai: Number(IdViTriHienTai),
    };

    try {
      const res = await fetch(`${apiURL}/api/taixe/createtaixe`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(TaiXeData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Tạo tài xế thất bại");
      }

      fetchTaiXe();

      setHoten("");
      setSdt("");
      setEmail("");
      setBangLai("");
      setTrangThaiNghiepVu("SanSang");
      setLyDoChiTiet("");
      setCCCD("");
      setNgayCapCCCD(getTodayString());
      setNoiCapCCCD("");
      setIdViTriHienTai("");

      fetchTaiXe();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài xế này?")) return;
    try {
      const res = await fetch(`${apiURL}/api/taixe/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      fetchTaiXe();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredList = TaiXeList.filter(
    (tx) =>
      (tx.Hoten || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.Sdt || "").includes(searchTerm) ||
      (tx.Email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid ">
      <div className="row">
        <div className="col-md-7">
          <form onSubmit={handleSubmit} className="p-3 border rounded bg-light mb-3">
            <h3 className="mb-4">Thêm Tài Xế Mới</h3>

            <div className="row mb-3">
              <div className="col-md-6">
                <label>Họ Tên</label>
                <input
                  type="text"
                  className="form-control"
                  value={Hoten}
                  onChange={(e) => setHoten(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label>Bằng Lái (VD: B2, C)</label>
                <input
                  type="text"
                  className="form-control"
                  value={BangLai}
                  onChange={(e) => setBangLai(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  inputMode="numeric"
                  onChange={(e) => {
                    setSdt(e.target.value.replace(/\D/g, ""));
                  }}
                  className="form-control"
                  value={Sdt}
                  required
                />
              </div>
              <div className="col-md-6">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <h5 className="mt-4">Thông tin CCCD</h5>
            <div className="row mb-3">
              <div className="col-md-4">
                <label>Số CCCD</label>
                <input
                  type="text"
                  className="form-control"
                  value={CCCD}
                  onChange={(e) => setCCCD(e.target.value)}
                  required
                  maxLength={12}
                />
              </div>
              <div className="col-md-4">
                <label>Ngày Cấp CCCD</label>
                <input
                  type="date"
                  className="form-control"
                  value={NgayCapCCCD}
                  onChange={(e) => setNgayCapCCCD(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <label>Nơi Cấp CCCD</label>
                <input
                  type="text"
                  className="form-control"
                  value={NoiCapCCCD}
                  onChange={(e) => setNoiCapCCCD(e.target.value)}
                  required
                />
              </div>
            </div>

            <h5 className="mt-4">Thông tin nghiệp vụ</h5>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Trạng Thái</label>
                <select
                  className="form-select"
                  value={TrangThaiNghiepVu}
                  onChange={(e) => setTrangThaiNghiepVu(e.target.value)}
                >
                  <option value="SanSang">Sẵn sàng</option>
                  <option value="DangChay">Đang chạy</option>
                  <option value="NghiPhep">Nghỉ phép</option>
                  <option value="KhongHoatDong">Không hoạt động</option>
                </select>
              </div>
              <div className="col-md-6">
                <label>Vị trí hiện tại (Kho bãi)</label>
                <select
                  className="form-select"
                  value={IdViTriHienTai}
                  onChange={(e) => setIdViTriHienTai(e.target.value)}
                  required
                >
                  <option value="">-- Chọn kho bãi --</option>
                  {KhoBaiList.map((kho) => (
                    <option key={kho.IdKhoBai} value={kho.IdKhoBai}>
                      {kho.TenKhoBai} ({kho.DiaChi})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {TrangThaiNghiepVu !== "SanSang" && (
              <div className="mb-3">
                <label>Lý Do Chi Tiết (Nghỉ phép, Xe hỏng,...)</label>
                <input
                  type="text"
                  className="form-control"
                  value={LyDoChiTiet}
                  onChange={(e) => setLyDoChiTiet(e.target.value)}
                  placeholder="Nhập lý do cho trạng thái"
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary">
              Lưu Tài Xế
            </button>
            {error && <p className="text-danger mt-2">{error}</p>}
          </form>
        </div>

        <div className="col-md-5">
          <div className="sticky-top p-3 border bg-light" style={{ top: "20px", maxHeight: "90vh", overflowY: "auto" }}>
            <h5>📋 Danh sách Tài Xế</h5>

            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm theo tên, sdt, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <p>Đang tải...</p>
            ) : filteredList.length === 0 ? (
              <p>Không có tài xế nào</p>
            ) : (
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>Họ Tên</th>
                    <th>SDT</th>
                    <th>Trạng Thái</th>
                    <th>Vị trí hiện tại</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((tx) => (
                    <tr key={tx.IdTaiXe}>
                      <td>{tx.Hoten}</td>
                      <td>{tx.Sdt}</td>
                      <td>{tx.TrangThaiNghiepVu}</td>
                      <td>{tx.viTriHienTai?.DiaChi}</td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(tx.IdTaiXe)}>
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaiXeForm;
