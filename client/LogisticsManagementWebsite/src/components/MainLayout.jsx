import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
const layoutContainerStyle = {
  display: "flex",
  minHeight: "100vh",
};

const sidebarStyles = {
  width: "250px",
  flexShrink: 0,
  backgroundColor: "#f8f9fa",
  borderRight: "1px solid #dee2e6",
  padding: "1rem",
};

const contentStyles = {
  flexGrow: 1,
  padding: "1.5rem",
  height: "100vh",
  overflowY: "auto",
};

const MainLayout = () => {
  const apiURL = import.meta.env.VITE_APP_API;
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("userToken");
    sessionStorage.removeItem("userToken");
    navigate("/auth/register");
  };
  return (
    <div style={layoutContainerStyle}>
      <div style={sidebarStyles}>
        <Link to="/" className="d-block text-center my-3 text-dark text-decoration-none">
          <strong>DASHBOARD</strong>
        </Link>

        <ul className="nav flex-column">
          <div>
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
          </div>
          <li></li>

          <li className="nav-item" style={{ marginTop: "auto" }}>
            <a className="nav-link" href="#" onClick={handleLogout} style={{ cursor: "pointer" }}>
              Đăng xuất
            </a>
          </li>
        </ul>
      </div>


      <div style={contentStyles}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
