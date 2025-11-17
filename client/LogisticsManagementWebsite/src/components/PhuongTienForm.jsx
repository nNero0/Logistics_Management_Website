import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Giả sử bạn sẽ cần điều hướng

function PhuongTienForm() {
  // --- State cho dữ liệu form ---
  const [BienSo, SetBienSo] = useState("");
  const [Loai, SetLoai] = useState("");
  const [TaiTrong, SetTaiTrong] = useState(0);
  const [TrongTai, SetTrongTai] = useState(0);
  const [TrangThai, SetTrangThai] = useState("SanSang"); // Đặt giá trị mặc định
  const [GiayDangKyXeSo, SetGiayDangKyXeSo] = useState("");
  const [CDaiThungChua, SetCDaiThungChua] = useState(0);
  const [CRongThungChua, SetCRongThungChua] = useState(0);
  const [CCaoThungChua, SetCCaoThungChua] = useState(0);
  
  // --- State mới cho Vị trí (Kho Bãi) ---
  const [IdViTriHienTai, setIdViTriHienTai] = useState(""); // Lưu ID Kho Bãi
  const [KhoBaiList, setKhoBaiList] = useState([]); // Lưu danh sách Kho Bãi

  // --- State cho UI ---
  const [loadingKhoBai, setLoadingKhoBai] = useState(true);
  const [error, setError] = useState(null);
  // const navigate = useNavigate();

  // --- Tải danh sách Kho Bãi khi form được mount ---
  useEffect(() => {
    const fetchKhoBai = async () => {
      try {
        const apiURL = import.meta.env.VITE_APP_API;
        // Đảm bảo bạn đã có token
        const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
        if (!token) throw new Error("Chưa đăng nhập");

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

    if (!IdViTriHienTai) {
        setError("Vui lòng chọn vị trí (kho bãi) cho phương tiện.");
        return;
    }

    const PhuongTienData = {
      BienSo: BienSo,
      Loai: Loai,
      TaiTrong: Number(TaiTrong),
      TrongTai: Number(TrongTai),
      TrangThai: TrangThai,
      GiayDangKyXeSo: GiayDangKyXeSo,
      CDaiThungChua: Number(CDaiThungChua),
      CRongThungChua: Number(CRongThungChua),
      CCaoThungChua: Number(CCaoThungChua),
      IdKhoBai: Number(IdViTriHienTai), // <-- Thêm ID Vị trí (phải là số)
    };

    try {
      const apiURL = import.meta.env.VITE_APP_API;
      const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

      const response = await fetch(`${apiURL}/api/phuongtien/createphuongtien`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // <-- Thêm Auth Token
        },
        body: JSON.stringify(PhuongTienData),
      });

      if (!response.ok) {
        console.error("Error:", response.status, response.statusText);
        const data = await response.json();
        throw new Error(data.message || "Tạo phương tiện thất bại");
      }

      const NewPhuongTien = await response.json();
      console.log("PhuongTien duoc tao ", NewPhuongTien);
      
      alert("Tạo phương tiện thành công!");

      // Reset form
      SetBienSo("");
      SetLoai("");
      SetTaiTrong(0);
      SetTrongTai(0);
      SetTrangThai("SanSang");
      SetGiayDangKyXeSo("");
      SetCDaiThungChua(0);
      SetCRongThungChua(0);
      SetCCaoThungChua(0);
      setIdViTriHienTai(""); // Reset vị trí

      // navigate("/quan-ly/phuong-tien"); // Điều hướng về trang danh sách
    } catch (error) {
      console.log("Error :", error);
      setError(error.message); // Hiển thị lỗi cho người dùng
    }
  };

  return (
    <form onSubmit={HandleSubmit}>
      <h3> Thêm phương tiện mới </h3>
      <div>
        <label htmlFor="BienSo">Biển số</label>
        <input id="BienSo" type="text" value={BienSo} onChange={(e) => SetBienSo(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="Loai">Loại Phương tiện</label>
        <input id="Loai" type="text" value={Loai} onChange={(e) => SetLoai(e.target.value)} required placeholder="VD: Xe tải 5 tấn, Container..."/>
      </div>
      <div>
        <label htmlFor="TaiTrong">Tải Trọng (kg)</label>
        <input id="TaiTrong" type="number" value={TaiTrong} onChange={(e) => SetTaiTrong(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="TrongTai">Trọng Tải (kg)</label>
        <input id="TrongTai" type="number" value={TrongTai} onChange={(e) => SetTrongTai(e.target.value)} required />
      </div>

      {/* --- THAY ĐỔI: Input thành Select cho Trạng Thái --- */}
      <div>
        <label htmlFor="TrangThai">Trạng Thái</label>
        <select id="TrangThai" value={TrangThai} onChange={(e) => SetTrangThai(e.target.value)} required>
          <option value="SanSang">Sẵn sàng (Đang rảnh)</option>
          <option value="DangChay">Đang chạy (Đang vận chuyển)</option>
          <option value="BaoTri">Đang bảo trì</option>
          <option value="KhongHoatDong">Không hoạt động</option>
        </select>
      </div>

      <div>
        <label htmlFor="GiayDangKyXeSo">Số Giấy Đăng Ký Xe</label>
        <input id="GiayDangKyXeSo" type="text" value={GiayDangKyXeSo} onChange={(e) => SetGiayDangKyXeSo(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="CDaiThungChua">Chiều Dài Thùng (m)</label>
        <input id="CDaiThungChua" type="number" value={CDaiThungChua} onChange={(e) => SetCDaiThungChua(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="CRongThungChua">Chiều Rộng Thùng (m)</label>
        <input id="CRongThungChua" type="number" value={CRongThungChua} onChange={(e) => SetCRongThungChua(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="CCaoThungChua">Chiều Cao Thùng (m)</label>
        <input id="CCaoThungChua" type="number" value={CCaoThungChua} onChange={(e) => SetCCaoThungChua(e.target.value)} required />
      </div>

      {/* --- THAY ĐỔI: Input thành Select cho Vị Trí --- */}
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
            <option key={kho.IdKhoBai} value={kho.IdKhoBai}> {/* <-- Gửi ID (số) */}
              {kho.TenKhoBai} ({kho.DiaChi})
            </option>
          ))}
        </select>
      </div>
      
      <button type="submit" disabled={loadingKhoBai}> Lưu phương tiện </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default PhuongTienForm;