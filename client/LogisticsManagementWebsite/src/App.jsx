import { useState } from "react";
import React from "react";

import "./App.css";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import PhuongTienForm from "./components/PhuongTienForm";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import RegisterPage from "./components/RegisterPage";
import DonVanForm from "./components/DonVanForm";
import KhachHangForm from "./components/KhangHangForm";
import TaiXeForm from "./components/TaiXeForm";
import KhoBaiForm from "./components/KhoBaiForm";
import LoTrinhForm from "./components/LoTrinhForm";
import HangHoaForm from "./components/HangHoaForm";
import GanDonPage from "./components/GanDonPage";
import ChuyenDangChay from "./components/ChuyenDangChay";
import DieuPhoiLayout from "./components/DieuPhoiLayout";


const DashBoard = () => (
  <div>
    <h2>WELCOME </h2>

    <header style={HeaderStyle}>
      <h2> My Logistic Website </h2>
      <nav>
        <Link to="/" style={{ marginRight: "15px" }}>
          Dashboard
        </Link>
        <Link to="/taixe/createtaixe" style={{ marginRight: "15px" }}>
          Tài xế
        </Link>
        <Link to="/phuongtien/new" style={{ marginRight: "15px" }}>
          Phương tiện
        </Link>
        <Link to="/khobai/createkhobai" style={{ marginRight: "15px" }}>
          Kho Bãi
        </Link>
        <Link to="/khachhang/createkhachhang" style={{ marginRight: "15px" }}>
          khách hàng
        </Link>
        <Link to="/donvan/createdonvan" style={{ marginRight: "15px" }}>
          đơn vận
        </Link>

        <Link to="/lotrinh/createlotrinh" style={{ marginRight: "15px" }}>
          Lộ trình
        </Link>
        <Link to="/donvan/createdonvan" style={{ marginRight: "15px" }}>
          đơn vận
        </Link>
        <Link to="/hanghoa/createhanghoa" style={{ marginRight: "15px" }}>
          hàng hóa
        </Link>
        <Link to="/dieuphoi" style={{ marginRight: "15px" }}>
          Điều phối
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
          <Route path="/phuongtien/new" element={<PhuongTienForm />} />
          <Route path="/taixe/createtaixe" element={<TaiXeForm />} />
          <Route path="/khachhang/createkhachhang" element={<KhachHangForm />} />
          <Route path="/khobai/createkhobai" element={<KhoBaiForm />} />
          <Route path="/lotrinh/createlotrinh" element={<LoTrinhForm />} />
          <Route path="/donvan/createdonvan" element={<DonVanForm />} />
          <Route path="/hanghoa/createhanghoa" element={<HangHoaForm />} />
          <Route path="/dieuphoi" element={<DieuPhoiLayout />} >

            <Route index element={<GanDonPage />} /> 


            <Route path="phancong" element={<ChuyenDangChay />} />
          </Route>
        </Route>  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
