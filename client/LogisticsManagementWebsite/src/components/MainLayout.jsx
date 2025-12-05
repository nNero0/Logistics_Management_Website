import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
// 1. Style cho layout cha (container)
const layoutContainerStyle = {
  display: "flex", // Dùng Flexbox
  minHeight: "100vh", // Đảm bảo nó cao ít nhất 100% màn hình
};

// 2. Style cho Sidebar (Cột bên trái)
const sidebarStyles = {
  width: "250px", // Chiều rộng cố định 250px
  flexShrink: 0, // Bắt buộc sidebar KHÔNG bị co lại
  backgroundColor: "#f8f9fa",
  borderRight: "1px solid #dee2e6",
  padding: "1rem",
};

// 3. Style cho Nội dung (Cột bên phải)
const contentStyles = {
  flexGrow: 1, // Tự động chiếm hết phần còn lại
  padding: "1.5rem",
  height: "100vh", // Quan trọng: Cao 100% màn hình
  overflowY: "auto", // Quan trọng: Thêm thanh cuộn CHỈ cho cột nội dung
};

const MainLayout = () => {
  const apiURL = import.meta.env.VITE_APP_API;
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault(); // Ngăn thẻ <a> tải lại trang

    localStorage.removeItem("userToken");
    sessionStorage.removeItem("userToken");
    navigate("/auth/register");
  };
  return (
    <div style={layoutContainerStyle}>
      {/* === THANH SIDEBAR (Cột 1) === */}
      <div style={sidebarStyles}>
        <Link to="/" className="d-block text-center my-3 text-dark text-decoration-none">
          <strong>LOGISTICS APP</strong>
        </Link>

        {/* Menu điều hướng */}
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dieuphoi">
              Điều Phối
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/du-lieu-goc">
              Dữ Liệu Gốc
            </Link>
          </li>

          {/* Đẩy Đăng xuất xuống cuối */}
          <li className="nav-item" style={{ marginTop: "auto" }}>
            <a className="nav-link" href="#" onClick={handleLogout} style={{ cursor: "pointer" }}>
              Đăng xuất
            </a>
          </li>
        </ul>
      </div>

      {/* === NỘI DUNG TRANG CHÍNH (Cột 2) === */}
      {/* Cột này sẽ tự động lấp đầy phần còn lại
          và sẽ có thanh cuộn riêng nếu nội dung quá dài
      */}
      <div style={contentStyles}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
