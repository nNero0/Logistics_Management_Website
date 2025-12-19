import React, { useState } from "react";
import TaiXeForm from "./TaiXeForm";
import PhuongTienForm from "./PhuongTienForm";
import KhoBaiForm from "./KhoBaiForm";
import KhachHangForm from "./KhangHangForm";
import LoTrinhForm from "./LoTrinhForm";
import HangHoaForm from "./HangHoaForm";
import DonVanForm from "./DonVanForm";

const DuLieuGocPage = () => {
  const [activeTab, setActiveTab] = useState("taixe");

  return (
    <div>
      <h2>Quản lý Dữ liệu Gốc </h2>

      <ul className="nav nav-tabs" id="masterDataTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="taixe-tab"
            data-bs-toggle="tab"
            data-bs-target="#taixe-pane"
            type="button"
            role="tab"
            onClick={() => setActiveTab("taixe")}
          >
            Tài xế
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="phuongtien-tab"
            data-bs-toggle="tab"
            data-bs-target="#phuongtien-pane"
            type="button"
            role="tab"
            onClick={() => setActiveTab("phuongtien")}
          >
            Phương tiện
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="khobai-tab"
            data-bs-toggle="tab"
            data-bs-target="#khobai-pane"
            type="button"
            role="tab"
            onClick={() => setActiveTab("khobai")}
          >
            Kho Bãi
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="khachhang-tab"
            data-bs-toggle="tab"
            data-bs-target="#khachhang-pane"
            type="button"
            role="tab"
            onClick={() => setActiveTab("khachhang")}
          >
            Khách Hàng
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="lotrinh-tab"
            data-bs-toggle="tab"
            data-bs-target="#lotrinh-pane"
            type="button"
            role="tab"
            onClick={() => setActiveTab("lotrinh")}
          >
            Lộ Trình
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="hanghoa-tab"
            data-bs-toggle="tab"
            data-bs-target="#hanghoa-pane"
            type="button"
            role="tab"
            onClick={() => setActiveTab("hanghoa")}
          >
            Hàng Hóa
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="donvan-tab"
            data-bs-toggle="tab"
            data-bs-target="#donvan-pane"
            type="button"
            role="tab"
            onClick={() => setActiveTab("donvan")}
          >
            Đơn vận
          </button>
        </li>
      </ul>

      <div className="tab-content pt-3" id="masterDataTabContent">
        <div className="tab-pane fade show active" id="taixe-pane" role="tabpanel">
          {activeTab === "taixe" && <TaiXeForm />}
        </div>

        <div className="tab-pane fade" id="phuongtien-pane" role="tabpanel">
          {activeTab === "phuongtien" && <PhuongTienForm />}
        </div>

        <div className="tab-pane fade" id="khobai-pane" role="tabpanel">
          {activeTab === "khobai" && <KhoBaiForm />}
        </div>

        <div className="tab-pane fade" id="khachhang-pane" role="tabpanel">
          {activeTab === "khachhang" && <KhachHangForm />}
        </div>

        <div className="tab-pane fade" id="lotrinh-pane" role="tabpanel">
          {activeTab === "lotrinh" && <LoTrinhForm />}
        </div>

        <div className="tab-pane fade" id="hanghoa-pane" role="tabpanel">
  
          {activeTab === "hanghoa" && <HangHoaForm />}
        </div>

        <div className="tab-pane fade" id="donvan-pane" role="tabpanel">
          {activeTab === "donvan" && <DonVanForm />}
        </div>
      </div>
    </div>
  );
};

export default DuLieuGocPage;
