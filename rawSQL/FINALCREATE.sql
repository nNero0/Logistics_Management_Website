-- =============================================================
-- Bảng Dữ Liệu Chính (Master Data Tables)
-- =============================================================

CREATE TABLE KhachHang (
    IdKhachHang     INT NOT NULL AUTO_INCREMENT,
    HoTen           NVARCHAR(255) NOT NULL,
    Sdt             VARCHAR(10) NOT NULL,
    Email           VARCHAR(255) NOT NULL,
    PRIMARY KEY (IdKhachHang),
    UNIQUE (Email),
     UNIQUE (Sdt) 

);

CREATE TABLE TaiXe (
    IdTaiXe             INT NOT NULL AUTO_INCREMENT,
    HoTen               NVARCHAR(255) NOT NULL,
    Sdt                 VARCHAR(10) NOT NULL,
    Email               VARCHAR(255) NOT NULL,
    BangLai             VARCHAR(10) NOT NULL,
    TrangThaiNghiepVu   NVARCHAR(50) NOT NULL,
    LyDoChiTiet         NVARCHAR(255) NULL,
    CCCD                VARCHAR(12) NOT NULL,
    NgayCapCCCD         DATE NOT NULL,
    NoiCapCCCD          NVARCHAR(255) NOT NULL,

    PRIMARY KEY (IdTaiXe),
    UNIQUE (Email),
     UNIQUE (Sdt) ,
     UNIQUE (CCCD)
    
);

CREATE TABLE PhuongTien (
    IdPhuongTien    INT NOT NULL AUTO_INCREMENT,
    BienSo          VARCHAR(10) NOT NULL,
    Loai            NVARCHAR(255) NOT NULL,
    TaiTrong        DECIMAL(8,2) NOT NULL,
    -- Tổng khối lượng hàng hóa đang chở
    TrongTai        DECIMAL(8,2) NOT NULL,
    -- Tổng khối lượng hàng hóa Tối đa có thể chở 
    
    TrangThai       NVARCHAR(255) NOT NULL,
    GiayDangKyXeSo  VARCHAR(10) NOT NULL,
    -- Các kích thước in Meters 
    CDaiThungChua   DECIMAL(8,2) NOT NULL,
    CRongThungChua   DECIMAL(8,2) NOT NULL,
    CCaoThungChua   DECIMAL(8,2) NOT NULL,
    PRIMARY KEY (IdPhuongTien),
    UNIQUE (BienSo),
    UNIQUE (GiayDangKyXeSo) 
);

CREATE TABLE Container (
    IdContainer     INT NOT NULL AUTO_INCREMENT,
    MaSoHuu         VARCHAR(20) NOT NULL,
    TrangThai       NVARCHAR(255) NOT NULL,
    Loai            NVARCHAR(255) NOT NULL,
    Tare            DECIMAL(8,2) NOT NULL,
    Gross          DECIMAL(8,2) NOT NULL,
    TaiHienTai      DECIMAL(8,2) NOT NULL,
    TheTich         DECIMAL(8,2) NOT NULL,
    IsoCode         VARCHAR(12) NOT NULL,
    PRIMARY KEY (IdContainer),
    UNIQUE (MaSoHuu)
);

CREATE TABLE Csc (
    IdContainer         INT NOT NULL,
    PlateNumber         VARCHAR(20) NOT NULL,
    ApprovalNumber      VARCHAR(20) NOT NULL,
    LastInspection      DATE NOT NULL,
    Expiry              DATE NOT NULL,
    PRIMARY KEY (IdContainer)
    UNIQUE(PlateNumber),
    UNIQUE(ApprovalNumber)
);

CREATE TABLE KhoBai (
    IdKhoBai            INT NOT NULL AUTO_INCREMENT,
    DiaChi              NVARCHAR(255) NOT NULL,
    SucChuaTong         DECIMAL(8,2) NOT NULL,
    TrangThai           NVARCHAR(255) NOT NULL,
    LoaiKho             NVARCHAR(255),
    PRIMARY KEY (IdKhoBai),
    UNIQUE (DiaChi)
);

CREATE TABLE LoTrinh (
    IdLoTrinh       INT NOT NULL AUTO_INCREMENT,
    TenLoTrinh      NVARCHAR(255) NOT NULL,
    IdKhoBaiBatDau  INT NOT NULL,
    IdKhoBaiKetThuc INT NOT NULL,
    TrangThai       NVARCHAR(255) NOT NULL,
    ETC           DECIMAL(8,2) NOT NULL,
    KhoangCach         DECIMAL(8,2) NOT NULL,
    PRIMARY KEY (IdLoTrinh)
    
);

-- =============================================================
-- Bảng Phân Quyền (Authorization Tables)
-- =============================================================

CREATE TABLE TaiKhoan (
    IdTaiKhoan      INT NOT NULL AUTO_INCREMENT,
    Username        VARCHAR(255) NOT NULL,
    PasswordHash    VARCHAR(255) NOT NULL,
    Email           VARCHAR(255) NOT NULL,
    Sdt             VARCHAR(10) NOT NULL,
    PRIMARY KEY (IdTaiKhoan),
    UNIQUE (Username),
    UNIQUE (Email)

);

CREATE TABLE VaiTro (
    IdRole          INT NOT NULL AUTO_INCREMENT,
    IdTaiKhoan      INT NOT NULL,
    RoleName        NVARCHAR(255) NOT NULL,
    PRIMARY KEY (IdRole)
);

CREATE TABLE Quyen (
    IdPerm          INT NOT NULL AUTO_INCREMENT,
    IdRole          INT NOT NULL,
    TenQuyen        NVARCHAR(255) NOT NULL,
    MoTaQuyen       NVARCHAR(255) NOT NULL,
    PRIMARY KEY (IdPerm)
);

-- =============================================================
-- Bảng Giao Dịch (Transactional Tables)
-- =============================================================

CREATE TABLE DonVan (
    IdDonVan        INT NOT NULL AUTO_INCREMENT,
    IdKhoBaiBatDau       INT NOT NULL,
    IdKhoBaiKetThuc       INT NOT NULL,
    IdKhachHang     INT NOT NULL,
    ETA             DATETIME NOT NULL,
    NgayLapDon      DATETIME NOT NULL,
    PRIMARY KEY (IdDonVan)
);

CREATE TABLE HangHoa (
    IdHangHoa       INT NOT NULL AUTO_INCREMENT,
    IdDonVan        INT NOT NULL,
    NoiDung         NVARCHAR(200) NOT NULL,
    CanNang         DECIMAL(8,2) NOT NULL,
    XuatXu          VARCHAR(3) NOT NULL,
    GhiChu          NVARCHAR(255),
    ChieuDai        DECIMAL(8,2) NOT NULL,
    ChieuRong        DECIMAL(8,2) NOT NULL,
    ChieuCao        DECIMAL(8,2) NOT NULL,
    NgayTao         DATE NOT NULL,
    
    PRIMARY KEY (IdHangHoa)
);

CREATE TABLE Invoices (
    IdInvoice       INT NOT NULL AUTO_INCREMENT,
    IdDonVan        INT NOT NULL,
    NgayPhatHanh    DATETIME NOT NULL,
    HanDong         DATETIME NOT NULL,
    TongTien        DECIMAL(15,2) NOT NULL,
    DonViTT         VARCHAR(3) NOT NULL,
    TrangThai       NVARCHAR(100) NOT NULL,
    GhiChu          NVARCHAR(255),
    PRIMARY KEY (IdInvoice)
);

CREATE TABLE PhanCongDonVan (
    IdPhanCong      INT NOT NULL AUTO_INCREMENT,
    IdTaiXe         INT NOT NULL,
    IdPhuongTien    INT NOT NULL,
    IdDonVan        INT NOT NULL,
    NgayBatDau      DATE NOT NULL,
    NgayKetThuc     DATE NOT NULL,
    TrangThai       NVARCHAR(255),
    PRIMARY KEY (IdPhanCong)
);

CREATE TABLE ChiTietLoTrinh (
    IdChiTietLoTrinh INT PRIMARY KEY AUTO_INCREMENT,
    IdLoTrinh INT NOT NULL,            -- Liên kết với bảng LoTrinh
    IdKhoBai INT NOT NULL,     -- Liên kết với bảng KhoBai
    ThuTu INT NOT NULL,                -- Rất quan trọng: 1, 2, 3...

    FOREIGN KEY (IdLoTrinh) REFERENCES LoTrinh(IdLoTrinh),
    FOREIGN KEY (IdKhoBai) REFERENCES KhoBai(IdKhoBai),
    UNIQUE KEY UQ_LoTrinh_ThuTu (IdLoTrinh, ThuTu)
);


-- =============================================================
-- Bảng Nối (Junction Tables)
-- =============================================================


CREATE TABLE DonVanContainer (  
    IdContainer     INT NOT NULL,
    IdDonVan        INT NOT NULL,
    PRIMARY KEY (IdContainer, IdDonVan)
);

-- =============================================================
-- Định Nghĩa Khóa Ngoại (Foreign Key Constraints)
-- =============================================================


ALTER TABLE DonVan
ADD CONSTRAINT FK_DonVan_KhoBatDau
FOREIGN KEY (IdKhoBaiBatDau) REFERENCES KhoBai(IdKhoBai);
ALTER TABLE DonVan
ADD CONSTRAINT FK_DonVan_KhoKetThuc
FOREIGN KEY (IdKhoBaiKetThuc) REFERENCES KhoBai(IdKhoBai);
ALTER TABLE LoTrinh
ADD CONSTRAINT FK_LoTrinh_KhoBatDau
FOREIGN KEY (IdKhoBaiBatDau) REFERENCES KhoBai(IdKhoBai);

ALTER TABLE LoTrinh
ADD CONSTRAINT FK_LoTrinh_KhoKetThuc
FOREIGN KEY (IdKhoBaiKetThuc) REFERENCES KhoBai(IdKhoBai);
ALTER TABLE Csc ADD CONSTRAINT FK_Csc_Container FOREIGN KEY (IdContainer) REFERENCES Container (IdContainer);
ALTER TABLE DiemDungTrungGian ADD CONSTRAINT FK_DDTG_KhoBai FOREIGN KEY (IdKhoBai) REFERENCES KhoBai (IdKhoBai);
ALTER TABLE DiemDungTrungGian ADD CONSTRAINT FK_DDTG_LoTrinh FOREIGN KEY (IdLoTrinh) REFERENCES LoTrinh (IdLoTrinh);
ALTER TABLE DonVan ADD CONSTRAINT FK_DonVan_KhachHang FOREIGN KEY (IdKhachHang) REFERENCES KhachHang (IdKhachHang);
ALTER TABLE DonVan ADD CONSTRAINT FK_DonVan_LoTrinh FOREIGN KEY (IdLoTrinh) REFERENCES LoTrinh (IdLoTrinh);
ALTER TABLE DonVanContainer ADD CONSTRAINT FK_DVC_Container FOREIGN KEY (IdContainer) REFERENCES Container (IdContainer);
ALTER TABLE DonVanContainer ADD CONSTRAINT FK_DVC_DonVan FOREIGN KEY (IdDonVan) REFERENCES DonVan (IdDonVan);
ALTER TABLE HangHoa ADD CONSTRAINT FK_HangHoa_DonVan FOREIGN KEY (IdDonVan) REFERENCES DonVan (IdDonVan);
ALTER TABLE Invoices ADD CONSTRAINT FK_Invoices_DonVan FOREIGN KEY (IdDonVan) REFERENCES DonVan (IdDonVan);
ALTER TABLE PhanCongDonVan ADD CONSTRAINT FK_PCDV_PhuongTien FOREIGN KEY (IdPhuongTien) REFERENCES PhuongTien (IdPhuongTien);
ALTER TABLE PhanCongDonVan ADD CONSTRAINT FK_PCDV_TaiXe FOREIGN KEY (IdTaiXe) REFERENCES TaiXe (IdTaiXe);
ALTER TABLE PhanCongDonVan ADD CONSTRAINT FK_PCDV_DonVan FOREIGN KEY (IdDonVan) REFERENCES DonVan (IdDonVan);
ALTER TABLE Quyen ADD CONSTRAINT FK_Quyen_VaiTro FOREIGN KEY (IdRole) REFERENCES VaiTro (IdRole);
ALTER TABLE VaiTro ADD CONSTRAINT FK_VaiTro_TaiKhoan FOREIGN KEY (IdTaiKhoan) REFERENCES TaiKhoan (IdTaiKhoan);