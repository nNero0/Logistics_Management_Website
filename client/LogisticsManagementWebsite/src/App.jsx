import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

import "./App.css";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoutes";

import MainLayout from "./components/MainLayout";

import DashboardPage from "./components/DashboardPage";
import DuLieuGocPage from "./components/DuLieuGocPage";

import DieuPhoiLayout from "./components/DieuPhoiLayout";
import GanDonPage from "./components/GanDonPage";
import ChuyenDangChay from "./components/ChuyenDangChay";
import InvoicePage from "./components/InvoicePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<DashboardPage />} />

            <Route path="/du-lieu-goc" element={<DuLieuGocPage />} />

            <Route path="/dieuphoi" element={<DieuPhoiLayout />}>
              <Route index element={<GanDonPage />} />
              <Route path="phancong" element={<ChuyenDangChay />} />
              <Route path="invoice" element={<InvoicePage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
