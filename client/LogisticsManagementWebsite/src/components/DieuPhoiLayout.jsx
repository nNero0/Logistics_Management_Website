// src/pages/DieuPhoiLayout.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

function DieuPhoiLayout() {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">🚚 Quản Lý Điều Phối</h2>

      {/* Tabs Bootstrap */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <NavLink to="/dieuphoi" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Gán Đơn (Matching)
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/dieuphoi/phancong" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Chuyến Đang Chạy
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/dieuphoi/invoice" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link ")}>
            Thanh toán
          </NavLink>
        </li>
      </ul>

      {/* Tab content */}
      <div className="tab-content p-3 border rounded">
        <Outlet />
      </div>
    </div>
  );
}

export default DieuPhoiLayout;
