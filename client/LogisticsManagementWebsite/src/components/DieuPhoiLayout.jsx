// src/pages/DieuPhoiLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

// CSS cho các tab
const styles = {
  nav: { 
    display: 'flex', 
    gap: '1rem', 
    marginBottom: '1rem', 
    borderBottom: '1px solid #ccc' 
  },
  // Style cho tab không được chọn
  link: {
    textDecoration: 'none',
    padding: '10px 15px',
    color: '#555',
    fontWeight: '500'
  },
  // Style cho tab đang được chọn (active)
  activeLink: {
    textDecoration: 'none',
    padding: '10px 15px',
    color: '#007bff',
    fontWeight: 'bold',
    borderBottom: '3px solid #007bff'
  }
};

function DieuPhoiLayout() {
  return (
    <div>
      <h2>🚚 Quản Lý Điều Phối</h2>

      {/* 1. Thanh điều hướng (Tabs) */}
      <nav style={styles.nav}>
        <NavLink 
          to="/dieuphoi" // Link đến trang "Gán Đơn"
          end // 'end' rất quan trọng để link cha không bị active
          style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          Gán Đơn (Matching)
        </NavLink>
        <NavLink 
          to="/dieuphoi/phancong" // Link đến trang "Đang Chạy"
          style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          Chuyến Đang Chạy
        </NavLink>
      </nav>

      {/* 2. Cửa sổ render trang con (Tab 1 hoặc Tab 2) */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default DieuPhoiLayout;