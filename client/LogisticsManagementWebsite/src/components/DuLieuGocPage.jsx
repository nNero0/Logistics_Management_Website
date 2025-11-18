import React from 'react';

// Import các form của bạn
import TaiXeForm from './TaiXeForm';
import PhuongTienForm from './PhuongTienForm';
import KhoBaiForm from './KhoBaiForm';
import KhachHangForm from './KhangHangForm';
import LoTrinhForm from './LoTrinhForm';
import HangHoaForm from './HangHoaForm';
import DonVanForm from './DonVanForm';

const DuLieuGocPage = () => {
  return (
    <div>
      <h2>Quản lý Dữ liệu Gốc (Master Data)</h2>
      <p>Nơi tạo mới và quản lý các tài nguyên cốt lõi của hệ thống.</p>
      
      {/* 1. Đây là thanh điều hướng TAB */}
      <ul className="nav nav-tabs" id="masterDataTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="taixe-tab" data-bs-toggle="tab" data-bs-target="#taixe-pane" type="button" role="tab" aria-controls="taixe-pane" aria-selected="true">
            Tài xế
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="phuongtien-tab" data-bs-toggle="tab" data-bs-target="#phuongtien-pane" type="button" role="tab" aria-controls="phuongtien-pane" aria-selected="false">
            Phương tiện
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="khobai-tab" data-bs-toggle="tab" data-bs-target="#khobai-pane" type="button" role="tab" aria-controls="khobai-pane" aria-selected="false">
            Kho Bãi
          </button>
        </li>
              <li className="nav-item" role="presentation">
          <button className="nav-link" id="khachhang-tab" data-bs-toggle="tab" data-bs-target="#khachhang-pane" type="button" role="tab" aria-controls="khachhang-pane" aria-selected="false">
            Khách Hàng 
          </button>
        </li>
              <li className="nav-item" role="presentation">
          <button className="nav-link" id="lotrinh-tab" data-bs-toggle="tab" data-bs-target="#lotrinh-pane" type="button" role="tab" aria-controls="lotrinh-pane" aria-selected="false">
            Lộ Trình
          </button>
        </li>
              <li className="nav-item" role="presentation">
          <button className="nav-link" id="hanghoa-tab" data-bs-toggle="tab" data-bs-target="#hanghoa-pane" type="button" role="tab" aria-controls="hanghoa-pane" aria-selected="false">
            Hàng Hóa 
          </button>
        </li>
              <li className="nav-item" role="presentation">
          <button className="nav-link" id="donvan-tab" data-bs-toggle="tab" data-bs-target="#donvan-pane" type="button" role="tab" aria-controls="donvan-pane" aria-selected="false">
            Đơn vận 
          </button>
        </li>
        {/* Thêm các tab khác nếu cần */}
      </ul>

      {/* 2. Đây là nội dung của các TAB */}
      <div className="tab-content pt-3" id="masterDataTabContent">
        {/* Nội dung Tab 1: Tài xế */}
        <div className="tab-pane fade show active" id="taixe-pane" role="tabpanel" aria-labelledby="taixe-tab">
          <TaiXeForm />
        </div>
        
        {/* Nội dung Tab 2: Phương tiện */}
        <div className="tab-pane fade" id="phuongtien-pane" role="tabpanel" aria-labelledby="phuongtien-tab">
          <PhuongTienForm />
        </div>

        {/* Nội dung Tab 3: Kho Bãi */}
        <div className="tab-pane fade" id="khobai-pane" role="tabpanel" aria-labelledby="khobai-tab">
          <KhoBaiForm />
        </div>
          <div className="tab-pane fade" id="khachhang-pane" role="tabpanel" aria-labelledby="khachhang-tab">
          <KhachHangForm />
        </div>
        <div className="tab-pane fade" id="lotrinh-pane" role="tabpanel" aria-labelledby="lotrinh-tab">
          <LoTrinhForm />
        </div>
        <div className="tab-pane fade" id="hanghoa-pane" role="tabpanel" aria-labelledby="hanghoa-tab">
          <HangHoaForm />
        </div>
        <div className="tab-pane fade" id="donvan-pane" role="tabpanel" aria-labelledby="donvan-tab">
          <DonVanForm />
        </div>
   
      </div>
    </div>
  );
};

export default DuLieuGocPage;