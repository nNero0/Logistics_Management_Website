import { useState } from "react";
import React from "react";

import "./App.css";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import PhuongTienForm from "./components/PhuongTienForm";
import PhuongTienList from "./components/PhuongTienList";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import RegisterPage from "./components/RegisterPage";
import DonVanForm from "./components/DonVanForm";
import KhachHangForm from "./components/KhangHangForm";
import TaiXeForm from "./components/TaiXeForm";
import KhoBaiForm from "./components/KhoBaiForm";
import LoTrinhForm from "./components/LoTrinhForm";
const DashBoard = () => (
  <div>
    <h2>WELCOME </h2>

    <header style={HeaderStyle}>
      <h2> My Logistic Website </h2>
      <nav>
        <Link to="/" style={{ marginRight: "15px" }}>
          Dashboard
        </Link>
        <Link to="/phuongtien" style={{ marginRight: "15px" }}>
          Vehicle List
        </Link>
        <Link to="/phuongtien/new" style={{ marginRight: "15px" }}>
          Add Vehicle
        </Link>
           <Link to="/khobai/createkhobai" style={{ marginRight: "15px" }}>
          Them Kho Bãi
        </Link>
           <Link to="/khachhang/createkhachhang" style={{ marginRight: "15px" }}>
          Thêm khách hàng
        </Link>
           <Link to="/donvan/createdonvan" style={{ marginRight: "15px" }}>
          Tạo đơn vận
        </Link>
           <Link to="/taixe/createtaixe" style={{ marginRight: "15px" }}>
          Thêm tài xế
        </Link>
              <Link to="/lotrinh/createlotrinh" style={{ marginRight: "15px" }}>
          Thêm Lộ trình
        </Link>

      </nav>
    </header>
    <hr />
  </div>
);
const HeaderStyle = {
  padding: "10px",
  backgroundColor: "#f0f0f0",
  borderBottom: "1px solid #ccc",
};
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashBoard />} />
          <Route path="/phuongtien" element={<PhuongTienList />} />
          <Route path="/phuongtien/new" element={<PhuongTienForm />} />
          <Route path="/taixe/createtaixe" element={<TaiXeForm />} />
          <Route path="/khachhang/createkhachhang" element={<KhachHangForm />} />
          <Route path="/khobai/createkhobai" element={<KhoBaiForm />} />
           <Route path="/lotrinh/createlotrinh" element={<LoTrinhForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
