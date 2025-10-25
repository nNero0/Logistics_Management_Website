-- ==============================================================
-- 1. KHACH_HANG (Customers)
-- ==============================================================
INSERT INTO `KHACH_HANG` (`ID_KHACHHANG`, `HOTEN`, `SDT`, `EMAIL`) VALUES
(1, 'Công ty TNHH Nông Sản Minh An', '0907123456', 'minhan@email.com'),
(2, 'Tập đoàn FPT - Chi nhánh Cần Thơ', '0292311223', 'fpt-cantho@fpt.com.vn'),
(3, 'Cửa hàng Vật liệu Xây dựng Hưng Phát', '0939888777', 'hungphat@email.com');

-- ==============================================================
-- 2. TAI_XE (Drivers)
-- ==============================================================
INSERT INTO `TAI_XE` (`ID_TAIXE`, `HOTEN`, `SDT`, `EMAIL`, `BANGLAI`, `TRANGTHAINGHIEPVU`) VALUES
(101, 'Nguyễn Văn An', '0918111222', 'nguyen.an@email.com', 'C', 'HD'), -- HD: Hoạt động
(102, 'Trần Minh Tuấn', '0905333444', 'tran.tuan@email.com', 'FC', 'HD'),
(103, 'Lê Hoàng Sơn', '0987555666', 'le.son@email.com', 'C', 'SS'), -- SS: Sẵn sàng
(104, 'Phạm Thành Long', '0902777888', 'pham.long@email.com', 'FC', 'SS');

-- ==============================================================
-- 3. PHUONG_TIEN (Vehicles)
-- ==============================================================
INSERT INTO `PHUONG_TIEN` (`ID_PHUONGTIEN`, `BIEN_SO`, `LOAI`, `THE_TICH_`, `TAI_TRONG`, `TRANG_THAI`) VALUES
(201, '65C-123.45', 'Xe tải 5 tấn', 30.00, 5.00, 'HD'), -- HD: Hoạt động
(202, '65C-555.88', 'Xe đầu kéo', 80.00, 25.00, 'HD'),
(203, '51C-987.65', 'Xe tải 8 tấn', 45.00, 8.00, 'SS'); -- SS: Sẵn sàng

-- ==============================================================
-- 4. KHO_BAI (Warehouses)
-- ==============================================================
INSERT INTO `KHO_BAI` (`ID_KHOBAI`, `DIA_CHI_`, `SUC_CHUA_TONG_KHO`, `SUC_CHUA_CON_LAI`, `TRANG_THAI`, `LOAI_KHO`) VALUES
(301, 'KCN Trà Nóc, Bình Thủy, Cần Thơ', 5000.00, 2500.00, 'Hoạt động', 'Kho khô'),
(302, 'Cảng Cái Cui, Cái Răng, Cần Thơ', 10000.00, 4000.00, 'Hoạt động', 'Bãi container'),
(303, 'KCN Sóng Thần, Dĩ An, Bình Dương', 8000.00, 3000.00, 'Hoạt động', 'Kho phân phối');

-- ==============================================================
-- 5. CONTAINER
-- ==============================================================
INSERT INTO `CONTAINER` (`ID_CONTAINER`, `TRANG_THAI`, `MASOHUU_`, `ECI`, `SERIAL`, `CHECKDIGIT`, `TARE`, `GROSS`, `LOAI`, `TAIHIENTAI`, `THETICH`, `ISO`, `MIEUTANOIDUNG`) VALUES
(401, 'Đang sử dụng', 'FPTU', 'U', '123456', '7', 2200.00, 24000.00, '20 feet', 15000.00, 33.00, '22G1', 'Linh kiện điện tử'),
(402, 'Sẵn sàng', 'VNNU', 'U', '654321', '4', 4800.00, 30480.00, '40 feet HC', 0.00, 76.00, '45G1', 'Trống');

-- ==============================================================
-- 6. HANGHOA (Goods)
-- ==============================================================
INSERT INTO `HANGHOA` (`ID_HANGHOA`, `ID_CONTAINER`, `NOIDUNG`, `CANNANG`, `CHIEUDAI`, `XUATSU`, `GHICHU`, `CHIEURONG`, `CHIEUCAO`) VALUES
(501, NULL, 'Gạo ST25', 5000.00, 5.00, 'VNM', 'Đóng bao 50kg', 2.00, 1.50),
(502, 401, 'Thùng máy tính', 7000.00, 12.00, 'VNM', 'Hàng dễ vỡ', 2.30, 2.20),
(503, 401, 'Màn hình LCD', 8000.00, 12.00, 'VNM', 'Hàng dễ vỡ, xếp chồng tối đa 3 lớp', 2.30, 2.20);

-- ==============================================================
-- 7. LO_TRINH (Routes)
-- ==============================================================
INSERT INTO `LO_TRINH` (`ID_LOTRINH`, `NOIBATDAU`, `NOIKETTHUC`, `TRANGTHAI`, `ETC`) VALUES
(601, 'Cần Thơ', 'TP. Hồ Chí Minh', 'Hoạt động', 150000.00),
(602, 'Cần Thơ', 'Hà Nội', 'Hoạt động', 1200000.00);

-- ==============================================================
-- 8. DIEMDUNGTRUNGGIAN (Intermediate Stops)
-- ==============================================================
-- Chuyến đi Hà Nội sẽ dừng ở kho Bình Dương
INSERT INTO `DIEMDUNGTRUNGGIAN` (`ID_KHOBAI`, `ID_LOTRINH`) VALUES
(303, 602);

-- ==============================================================
-- 9. DONVAN (Shipments)
-- ==============================================================
INSERT INTO `DONVAN` (`ID_DONVAN`, `ID_LOTRINH`, `ID_KHACHHANG`, `DIADIEMGIAO`, `PHIVANCHUYEN`, `ETA`, `NGAYLAPDON`) VALUES
(1001, 601, 1, 'Kho Hàng Minh An, Quận 7, TP.HCM', 3000000.00, 4.00, '2025-09-28 08:00:00'),
(1002, 602, 2, 'Kho FPT, KCN Thăng Long, Hà Nội', 25000000.00, 48.00, '2025-09-29 14:30:00');

-- ==============================================================
-- 10. PHANCONG_DONVAN (Assignments)
-- ==============================================================
-- Kịch bản 1: 1 tài xế, 1 xe cho chuyến đi TP.HCM
INSERT INTO `PHANCONG_DONVAN` (`ID_TAIXE`, `ID_PHUONGTIEN`, `ID_DONVAN`, `NGAYBATDAU`, `NGAYKETTHUC`, `TRANGTHAI`) VALUES
(101, 201, 1001, '2025-09-28', '2025-09-28', 'Hoàn thành');

-- Kịch bản 2: 2 tài xế thay phiên, 1 xe đầu kéo cho chuyến đi Hà Nội
INSERT INTO `PHANCONG_DONVAN` (`ID_TAIXE`, `ID_PHUONGTIEN`, `ID_DONVAN`, `NGAYBATDAU`, `NGAYKETTHUC`, `TRANGTHAI`) VALUES
(102, 202, 1002, '2025-09-29', '2025-10-01', 'Hoàn thành'),
(104, 202, 1002, '2025-09-29', '2025-10-01', 'Hoàn thành'); -- Tài xế thứ 2 cho cùng chuyến đi

-- ==============================================================
-- 11. DONVANHANGHOA & DONVANCONTAINER (Linking goods/containers to shipments)
-- ==============================================================
INSERT INTO `DONVANHANGHOA` (`ID_DONVAN`, `ID_HANGHOA`) VALUES
(1001, 501); -- Chuyến 1001 chở gạo

INSERT INTO `DONVANCONTAINER` (`ID_CONTAINER`, `ID_DONVAN`) VALUES
(401, 1002); -- Chuyến 1002 chở container 401

-- ==============================================================
-- 12. INVOICES (Billing)
-- ==============================================================
INSERT INTO `INVOICES` (`ID_INVOICE`, `ID_DONVAN`, `NGAYPHATHANH`, `HANDONG`, `TONGTIEN`, `DONVITT`, `TRANGTHAI`, `GHICHU`) VALUES
(9001, 1001, '2025-09-29 10:00:00', '2025-10-15 10:00:00', 3150000.00, 'VND', 'Đã thanh toán', 'Bao gồm 5% VAT'),
(9002, 1002, '2025-10-02 11:00:00', '2025-10-30 11:00:00', 26250000.00, 'VND', 'Chưa thanh toán', 'Bao gồm 5% VAT');

-- ==============================================================
-- 13. TAI_KHOAN (User Accounts)
-- ==============================================================
-- IMPORTANT: Passwords should be hashed in a real application!
INSERT INTO `TAI_KHOAN` (`ID_TAIKHOAN`, `USERNAME`, `PASSWORD`, `EMAIL`, `SDT`) VALUES
(1, 'admin', 'hashed_password_123', 'admin@logistics.com', '0909123123'),
(2, 'dieuhanh', 'hashed_password_456', 'dieuhanh@logistics.com', '0909456456');

-- ==============================================================
-- 14. VAI_TRO (Roles)
-- ==============================================================
INSERT INTO `VAI_TRO` (`ID_ROLE`, `ID_TAIKHOAN`, `ROLENAME`) VALUES
(1, 1, 'Administrator'),
(2, 2, 'Điều hành viên');

-- ==============================================================
-- 15. QUYEN (Permissions)
-- ==============================================================
INSERT INTO `QUYEN` (`ID_PERM`, `ID_ROLE`, `TENQUYEN`, `MTQUYEN`) VALUES
(1, 1, 'TaoDonVan', 'Có quyền tạo đơn vận mới'),
(2, 1, 'QuanLyNguoiDung', 'Có toàn quyền quản lý người dùng'),
(3, 2, 'TaoDonVan', 'Có quyền tạo đơn vận mới'),
(4, 2, 'XemBaoCao', 'Có quyền xem báo cáo');