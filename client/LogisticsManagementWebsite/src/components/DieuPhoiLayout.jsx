import React, { useState } from "react";

import GanDonPage from "./GanDonPage";
import ChuyenDangChay from "./ChuyenDangChay";
import InvoiceForm from "./InvoicePage";

function DieuPhoiLayout() {
  const [activeTab, setActiveTab] = useState("gandon");

  return (
    <div className="container mt-4">
      <h2 className="mb-4"> Quản Lý Điều Phối</h2>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "gandon" ? "active" : ""}`}
            onClick={() => setActiveTab("gandon")}
          >
            Gán Đơn
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "phancong" ? "active" : ""}`}
            onClick={() => setActiveTab("phancong")}
          >
            Chuyến Đang Chạy
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "invoice" ? "active" : ""}`}
            onClick={() => setActiveTab("invoice")}
          >
            Thanh toán
          </button>
        </li>
      </ul>

      <div className="tab-content p-3 border rounded">
        {activeTab === "gandon" && <GanDonPage />}

        {activeTab === "phancong" && <ChuyenDangChay />}

        {activeTab === "invoice" && <InvoiceForm />}
      </div>
    </div>
  );
}

export default DieuPhoiLayout;
