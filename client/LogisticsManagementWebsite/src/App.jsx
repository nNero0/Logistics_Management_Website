import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react"; // Xóa useState và Link vì không dùng ở đây

// CSS của bạn
import "./App.css";

// Các trang/components chính
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoutes";

// 1. Import Layout mới
import MainLayout from "./components/MainLayout"; 

// 2. Import các trang con mới
import DashboardPage from "./components/DashboardPage"; 
import DuLieuGocPage from "./components/DuLieuGocPage"; 

// 3. Vẫn giữ layout điều phối
import DieuPhoiLayout from "./components/DieuPhoiLayout";
import GanDonPage from "./components/GanDonPage";
import ChuyenDangChay from "./components/ChuyenDangChay";
import InvoicePage from "./components/InvoicePage";

// 4. Các form này sẽ được gọi bên trong 'DuLieuGocPage',
//    nên không cần import ở đây nữa
// import PhuongTienForm from "./components/PhuongTienForm";
// import TaiXeForm from "./components/TaiXeForm";
// ... (Không cần import các form khác ở đây)

// === XÓA TOÀN BỘ component 'DashBoard' (thanh nav cũ) Ở ĐÂY ===

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các route công khai (Login, Register) */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* --- Các route được bảo vệ --- */}
        <Route element={<ProtectedRoute />}>
          
          {/* Sử dụng MainLayout làm layout cha.
            Tất cả các route con bên trong sẽ được render 
            bên trong <Outlet /> của MainLayout.
          */}
          <Route element={<MainLayout />}>
            
            {/* Trang Dashboard thực sự (trang chủ) */}
            <Route index element={<DashboardPage />} /> 
            {/* 'index' có nghĩa là nó khớp với route cha ('/') */}
            
            {/* Trang gom các Form bằng Tab */}
            <Route path="/du-lieu-goc" element={<DuLieuGocPage />} />

            {/* Trang Điều phối (cấu trúc này của bạn đã tốt) */}
            <Route path="/dieuphoi" element={<DieuPhoiLayout />}>
              <Route index element={<GanDonPage />} />
              <Route path="phancong" element={<ChuyenDangChay />} />
              <Route path="invoice" element={<InvoicePage />} />
            </Route>
      

          </Route>{/* Kết thúc MainLayout */}

        </Route>{/* Kết thúc ProtectedRoute */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;