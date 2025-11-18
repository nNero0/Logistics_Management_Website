import React, { useState, useEffect } from "react";

function TaiXeForm() {
  const [HoTen, setHoTen] = useState("");
  const [Sdt, setSdt] = useState("");
  const [Email, setEmail] = useState("");
  const [BangLai, setBangLai] = useState("");
  const [TrangThaiNghiepVu, setTrangThaiNghiepVu] = useState("SanSang");
  const [LyDoChiTiet, setLyDoChiTiet] = useState("");
  const [CCCD, setCCCD] = useState("");
  const [NgayCapCCCD, setNgayCapCCCD] = useState("");
  const [NoiCapCCCD, setNoiCapCCCD] = useState("");

  const [IdViTriHienTai, setIdViTriHienTai] = useState("");
  const [KhoBaiList, setKhoBaiList] = useState([]);
  const [loadingKhoBai, setLoadingKhoBai] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKhoBai = async () => {
      try {
        const apiURL = import.meta.env.VITE_APP_API;
        const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

        const response = await fetch(`${apiURL}/api/khobai`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Không thể tải danh sách kho bãi");

        const data = await response.json();
        setKhoBaiList(data);
        setLoadingKhoBai(false);
      } catch (err) {
        setError(err.message);
        setLoadingKhoBai(false);
      }
    };
    fetchKhoBai();
  }, []);

  const HandleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    if (!IdViTriHienTai) {
      setError("Vui lòng chọn vị trí hiện tại cho tài xế.");
      return;
    }

    const TaiXeData = {
      Hoten: HoTen,
      Sdt,
      Email,
      BangLai,
      TrangThaiNghiepVu,
      LyDoChiTiet: LyDoChiTiet || null,
      CCCD,
      NgayCapCCCD,
      NoiCapCCCD,
      IdKhoBai: Number(IdViTriHienTai),
    };

    try {
      const apiURL = import.meta.env.VITE_APP_API;
      const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
      if (!token) {
        setError("User is not authenticated.");
        return;
      }

      const response = await fetch(`${apiURL}/api/taixe/createtaixe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(TaiXeData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Tạo tài xế thất bại");
      }

      alert("Tạo tài xế thành công!");
      setHoTen(""); setSdt(""); setEmail(""); setBangLai(""); setTrangThaiNghiepVu("SanSang");
      setLyDoChiTiet(""); setCCCD(""); setNgayCapCCCD(""); setNoiCapCCCD(""); setIdViTriHienTai("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={HandleSubmit} className=" p-3 border rounded bg-light ">
      <h3 className="mb-4">Thêm tài xế mới</h3>

      <div className="mb-3">
        <label htmlFor="hoTen" className="form-label">Họ Tên</label>
        <input id="hoTen" type="text" className="form-control" value={HoTen} onChange={(e) => setHoTen(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label htmlFor="sdt" className="form-label">Số điện thoại</label>
        <input id="sdt" type="text" className="form-control" value={Sdt} onChange={(e) => setSdt(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input id="email" type="email" className="form-control" value={Email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label htmlFor="bangLai" className="form-label">Bằng Lái (Hạng)</label>
        <input id="bangLai" type="text" className="form-control" value={BangLai} onChange={(e) => setBangLai(e.target.value)} placeholder="VD: B2, C, FC..." required />
      </div>

      <div className="mb-3">
        <label htmlFor="trangThai" className="form-label">Trạng Thái Nghiệp Vụ</label>
        <select id="trangThai" className="form-select" value={TrangThaiNghiepVu} onChange={(e) => setTrangThaiNghiepVu(e.target.value)} required>
          <option value="SanSang">Sẵn sàng (Đang rảnh)</option>
          <option value="DangChay">Đang chạy (Đang vận chuyển)</option>
          <option value="NghiPhep">Nghỉ phép</option>
          <option value="KhongHoatDong">Không hoạt động</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="cccd" className="form-label">CCCD</label>
        <input id="cccd" type="text" className="form-control" value={CCCD} onChange={(e) => setCCCD(e.target.value)} required />
      </div>

      <div className="mb-3 row">
        <div className="col-md-6">
          <label htmlFor="ngayCap" className="form-label">Ngày Cấp CCCD</label>
          <input id="ngayCap" type="date" className="form-control" value={NgayCapCCCD} onChange={(e) => setNgayCapCCCD(e.target.value)} required />
        </div>
        <div className="col-md-6">
          <label htmlFor="noiCap" className="form-label">Nơi Cấp CCCD</label>
          <input id="noiCap" type="text" className="form-control" value={NoiCapCCCD} onChange={(e) => setNoiCapCCCD(e.target.value)} required />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="ViTri" className="form-label">Vị Trí Hiện Tại (Kho Bãi)</label>
        <select id="ViTri" className="form-select" value={IdViTriHienTai} onChange={(e) => setIdViTriHienTai(e.target.value)} required disabled={loadingKhoBai}>
          <option value="" disabled>{loadingKhoBai ? "Đang tải kho bãi..." : "-- Chọn kho bãi --"}</option>
          {KhoBaiList.map((kho) => (
            <option key={kho.IdKhoBai} value={kho.IdKhoBai}>
              {kho.TenKhoBai} ({kho.DiaChi})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="lyDo" className="form-label">Lý Do Chi Tiết (Nếu trạng thái không sẵn sàng)</label>
        <input id="lyDo" type="text" className="form-control" value={LyDoChiTiet} onChange={(e) => setLyDoChiTiet(e.target.value)} />
      </div>

      <button type="submit" className="btn btn-primary">Lưu tài xế</button>

      {error && <p className="text-danger mt-2">{error}</p>}
    </form>
  );
}

export default TaiXeForm;
