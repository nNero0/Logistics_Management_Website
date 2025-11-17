import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Bạn có thể cần

function TaiXeForm() {
  // State for TaiXe (Driver) fields
  const [HoTen, setHoTen] = useState("");
  const [Sdt, setSdt] = useState("");
  const [Email, setEmail] = useState("");
  const [BangLai, setBangLai] = useState("");
  // --- THAY ĐỔI: Đặt giá trị mặc định hợp lý ---
  const [TrangThaiNghiepVu, setTrangThaiNghiepVu] = useState("SanSang"); 
  const [LyDoChiTiet, setLyDoChiTiet] = useState("");
  const [CCCD, setCCCD] = useState("");
  const [NgayCapCCCD, setNgayCapCCCD] = useState("");
  const [NoiCapCCCD, setNoiCapCCCD] = useState("");

  // --- THÊM MỚI: State cho Vị trí (Kho Bãi) ---
  const [IdViTriHienTai, setIdViTriHienTai] = useState(""); // Lưu ID Kho Bãi
  const [KhoBaiList, setKhoBaiList] = useState([]); // Lưu danh sách Kho Bãi

  // --- THÊM MỚI: State cho UI ---
  const [loadingKhoBai, setLoadingKhoBai] = useState(true);
  const [error, setError] = useState(null);
  // const navigate = useNavigate();

  // --- THÊM MỚI: Tải danh sách Kho Bãi khi form được mount ---
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

        if (!response.ok) {
          throw new Error("Không thể tải danh sách kho bãi");
        }
        
        const data = await response.json();
        setKhoBaiList(data);
        setLoadingKhoBai(false);
      } catch (err) {
        setError(err.message);
        setLoadingKhoBai(false);
      }
    };

    fetchKhoBai();
  }, []); // Chạy 1 lần

  const HandleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Xóa lỗi cũ

    // --- THÊM MỚI: Kiểm tra Vị trí ---
    if (!IdViTriHienTai) {
      setError("Vui lòng chọn vị trí hiện tại cho tài xế.");
      return;
    }

    const TaiXeData = {
      Hoten: HoTen,
      Sdt: Sdt,
      Email: Email,
      BangLai: BangLai,
      TrangThaiNghiepVu: TrangThaiNghiepVu,
      LyDoChiTiet: LyDoChiTiet || null,
      CCCD: CCCD,
      NgayCapCCCD: NgayCapCCCD,
      NoiCapCCCD: NoiCapCCCD,
      IdKhoBai: Number(IdViTriHienTai), // <-- THÊM MỚI: Gửi ID Vị trí
    };

    try {
      const apiURL = import.meta.env.VITE_APP_API;
      const token = localStorage.getItem('userToken') || sessionStorage.getItem("userToken");

      if (!token) {
        setError("User is not authenticated."); // Cập nhật lỗi
        return; 
      }

      const response = await fetch(`${apiURL}/api/taixe/createtaixe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(TaiXeData),
      });

      if (!response.ok) {
        console.error("Error:", response.status, response.statusText);
        const data = await response.json();
        throw new Error(data.message || "Tạo tài xế thất bại");
      }

      const NewTaiXe = await response.json();
      console.log("TaiXe duoc tao ", NewTaiXe);
      alert("Tạo tài xế thành công!");

      // Reset all form fields
      setHoTen("");
      setSdt("");
      setEmail("");
      setBangLai("");
      setTrangThaiNghiepVu("SanSang");
      setLyDoChiTiet("");
      setCCCD("");
      setNgayCapCCCD("");
      setNoiCapCCCD("");
      setIdViTriHienTai(""); // <-- THÊM MỚI: Reset Vị trí

      // navigate("/quan-ly/tai-xe"); // Điều hướng

    } catch (error) {
      console.log("Error :", error.message);
      setError(error.message); // Hiển thị lỗi cho người dùng
    }
  };

  return (
    <form onSubmit={HandleSubmit}>
      <h3> Thêm tài xế mới </h3>
      <div>
        <label htmlFor="hoTen">Họ Tên</label>
        <input id="hoTen" type="text" value={HoTen} onChange={(e) => setHoTen(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="sdt">Số điện thoại</label>
        <input id="sdt" type="text" value={Sdt} onChange={(e) => setSdt(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={Email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="bangLai">Bằng Lái (Hạng)</label>
        <input id="bangLai" type="text" value={BangLai} onChange={(e) => setBangLai(e.target.value)} required placeholder="VD: B2, C, FC..."/>
      </div>
      
      {/* --- THAY ĐỔI: Input thành Select cho Trạng Thái --- */}
      <div>
        <label htmlFor="trangThai">Trạng Thái Nghiệp Vụ</label>
        <select id="trangThai" value={TrangThaiNghiepVu} onChange={(e) => setTrangThaiNghiepVu(e.target.value)} required>
          <option value="SanSang">Sẵn sàng (Đang rảnh)</option>
          <option value="DangChay">Đang chạy (Đang vận chuyển)</option>
          <option value="NghiPhep">Nghỉ phép</option>
          <option value="KhongHoatDong">Không hoạt động</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="cccd">CCCD</label>
        <input id="cccd" type="text" value={CCCD} onChange={(e) => setCCCD(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="ngayCap">Ngày Cấp CCCD</label>
        <input id="ngayCap" type="date" value={NgayCapCCCD} onChange={(e) => setNgayCapCCCD(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="noiCap">Nơi Cấp CCCD</label>
        <input id="noiCap" type="text" value={NoiCapCCCD} onChange={(e) => setNoiCapCCCD(e.target.value)} required />
      </div>

      {/* --- THÊM MỚI: Dropdown Vị Trí Hiện Tại --- */}
      <div>
        <label htmlFor="ViTri">Vị Trí Hiện Tại (Kho Bãi)</label>
        <select 
          id="ViTri" 
          value={IdViTriHienTai} 
          onChange={(e) => setIdViTriHienTai(e.target.value)} 
          required
          disabled={loadingKhoBai} // Vô hiệu hóa khi đang tải
        >
          <option value="" disabled>
            {loadingKhoBai ? "Đang tải kho bãi..." : "-- Chọn kho bãi --"}
          </option>
          {KhoBaiList.map((kho) => (
            <option key={kho.IdKhoBai} value={kho.IdKhoBai}>
              {kho.TenKhoBai} ({kho.DiaChi})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="lyDo">Lý Do Chi Tiết (Nếu trạng thái không sẵn sàng)</label>
        <input id="lyDo" type="text" value={LyDoChiTiet} onChange={(e) => setLyDoChiTiet(e.target.value)} />
      </div>

      <button type="submit"> Lưu tài xế </button>

      {/* --- THÊM MỚI: Hiển thị lỗi --- */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default TaiXeForm;