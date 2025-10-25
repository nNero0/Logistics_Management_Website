/*==============================================================*/
/* Table: KHACH_HANG                                            */
/*==============================================================*/
CREATE TABLE KHACH_HANG (
    ID_KHACHHANG   INT NOT NULL,
    HOTEN          VARCHAR(255) NOT NULL,
    SDT            VARCHAR(10) NOT NULL,
    EMAIL          VARCHAR(255) NOT NULL,
    PRIMARY KEY (ID_KHACHHANG)
);

/*==============================================================*/
/* Table: TAI_XE                                                */
/*==============================================================*/
CREATE TABLE TAI_XE (
    ID_TAIXE             INT NOT NULL,
    HOTEN                VARCHAR(255) NOT NULL,
    SDT                  VARCHAR(10) NOT NULL,
    EMAIL                VARCHAR(255) NOT NULL,
    BANGLAI              VARCHAR(5) NOT NULL,
    TRANGTHAINGHIEPVU    VARCHAR(5) NOT NULL,
    PRIMARY KEY (ID_TAIXE)
);

/*==============================================================*/
/* Table: PHUONG_TIEN                                           */
/*==============================================================*/
CREATE TABLE PHUONG_TIEN (
    ID_PHUONGTIEN    INT NOT NULL,
    BIEN_SO          VARCHAR(10) NOT NULL,
    LOAI             VARCHAR(255) NOT NULL,
    THE_TICH_        DECIMAL(15,2) NOT NULL,
    TAI_TRONG        DECIMAL(15,2) NOT NULL,
    TRANG_THAI       VARCHAR(255) NOT NULL,
    PRIMARY KEY (ID_PHUONGTIEN)
);

/*==============================================================*/
/* Table: KHO_BAI                                               */
/*==============================================================*/
CREATE TABLE KHO_BAI (
    ID_KHOBAI          INT NOT NULL,
    DIA_CHI_           VARCHAR(255) NOT NULL,
    SUC_CHUA_TONG_KHO  DECIMAL(15,2) NOT NULL,
    SUC_CHUA_CON_LAI   DECIMAL(15,2) NOT NULL,
    TRANG_THAI         VARCHAR(255) NOT NULL,
    LOAI_KHO           VARCHAR(255),
    PRIMARY KEY (ID_KHOBAI)
);


/*==============================================================*/
/* Table: CONTAINER                                             */
/*==============================================================*/
CREATE TABLE CONTAINER (
    ID_CONTAINER     INT NOT NULL,
    TRANG_THAI       VARCHAR(255) NOT NULL,
    MASOHUU_         VARCHAR(255) NOT NULL,
    ECI              VARCHAR(1) NOT NULL,
    SERIAL           VARCHAR(6) NOT NULL,
    CHECKDIGIT       VARCHAR(1) NOT NULL,
    TARE             DECIMAL(15,2) NOT NULL,
    GROSS            DECIMAL(15,2) NOT NULL,
    LOAI             VARCHAR(255) NOT NULL,
    TAIHIENTAI       DECIMAL(15,2) NOT NULL,
    THETICH          DECIMAL(15,2) NOT NULL,
    ISO              VARCHAR(12) NOT NULL,
    MIEUTANOIDUNG    VARCHAR(255) NOT NULL,
    PRIMARY KEY (ID_CONTAINER)
);

/*==============================================================*/
/* Table: CSC                                                   */
/*==============================================================*/
CREATE TABLE CSC (
    ID_CONTAINER     INT NOT NULL,
    PLATENUMBER      VARCHAR(20) NOT NULL,
    APPROVALNUMBER   VARCHAR(20) NOT NULL,
    LASTINSPECTION   DATE NOT NULL,
    EXPIRY           DATE NOT NULL
);

ALTER TABLE CSC ADD CONSTRAINT FK_CSC_CONTAINER FOREIGN KEY (ID_CONTAINER)
    REFERENCES CONTAINER (ID_CONTAINER) ON DELETE RESTRICT ON UPDATE RESTRICT;

/*==============================================================*/
/* Table: HANGHOA                                               */
/*==============================================================*/
CREATE TABLE HANGHOA (
    ID_HANGHOA       INT NOT NULL,
    ID_CONTAINER     INT,
    NOIDUNG          VARCHAR(20) NOT NULL,
    CANNANG          DECIMAL(15,2) NOT NULL,
    CHIEUDAI         DECIMAL(15,2) NOT NULL,
    XUATSU           VARCHAR(3) NOT NULL,
    GHICHU           VARCHAR(255),
    CHIEURONG        DECIMAL(15,2) NOT NULL,
    CHIEUCAO         DECIMAL(15,2) NOT NULL,
    PRIMARY KEY (ID_HANGHOA)
);

ALTER TABLE HANGHOA ADD CONSTRAINT FK_HANGHOA_CONTAINER FOREIGN KEY (ID_CONTAINER)
    REFERENCES CONTAINER (ID_CONTAINER) ON DELETE RESTRICT ON UPDATE RESTRICT;

    /*==============================================================*/
/* Table: LO_TRINH                                              */
/*==============================================================*/
CREATE TABLE LO_TRINH (
    ID_LOTRINH     INT NOT NULL,
    NOIBATDAU      VARCHAR(255) NOT NULL,
    NOIKETTHUC     VARCHAR(255) NOT NULL,
    TRANGTHAI      VARCHAR(255) NOT NULL,
    ETC            DECIMAL(15,2) NOT NULL,
    PRIMARY KEY (ID_LOTRINH)
);

/*==============================================================*/
/* Table: DIEMDUNGTRUNGGIAN                                     */
/*==============================================================*/
CREATE TABLE DIEMDUNGTRUNGGIAN (
    ID_KHOBAI      INT NOT NULL,
    ID_LOTRINH     INT NOT NULL
);

ALTER TABLE DIEMDUNGTRUNGGIAN ADD CONSTRAINT FK_DIEMDUNG_KHOBAI FOREIGN KEY (ID_KHOBAI)
    REFERENCES KHO_BAI (ID_KHOBAI) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE DIEMDUNGTRUNGGIAN ADD CONSTRAINT FK_DIEMDUNG_LOTRINH FOREIGN KEY (ID_LOTRINH)
    REFERENCES LO_TRINH (ID_LOTRINH) ON DELETE RESTRICT ON UPDATE RESTRICT;

    /*==============================================================*/
/* Table: DONVAN                                                */
/*==============================================================*/
CREATE TABLE DONVAN (
    ID_DONVAN        INT NOT NULL,
    ID_LOTRINH       INT NOT NULL,
    ID_KHACHHANG     INT NOT NULL,
    DIADIEMGIAO      VARCHAR(255) NOT NULL,
    PHIVANCHUYEN     DECIMAL(15,2) NOT NULL,
    ETA              DECIMAL(15,2) NOT NULL,
    NGAYLAPDON       DATETIME NOT NULL,
    PRIMARY KEY (ID_DONVAN)
);

ALTER TABLE DONVAN ADD CONSTRAINT FK_DONVAN_KHACHHANG FOREIGN KEY (ID_KHACHHANG)
    REFERENCES KHACH_HANG (ID_KHACHHANG) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE DONVAN ADD CONSTRAINT FK_DONVAN_LOTRINH FOREIGN KEY (ID_LOTRINH)
    REFERENCES LO_TRINH (ID_LOTRINH) ON DELETE RESTRICT ON UPDATE RESTRICT;

/*==============================================================*/
/* Table: PHANCONG_DONVAN                                       */
/*==============================================================*/
CREATE TABLE PHANCONG_DONVAN (
    ID_TAIXE         INT NOT NULL,
    ID_PHUONGTIEN    INT NOT NULL,
    ID_DONVAN        INT NOT NULL,
    NGAYBATDAU       DATE NOT NULL,
    NGAYKETTHUC      DATE NOT NULL,
    TRANGTHAI        VARCHAR(255)
);

ALTER TABLE PHANCONG_DONVAN ADD CONSTRAINT FK_PHANCONG_PHUONGTIEN FOREIGN KEY (ID_PHUONGTIEN)
    REFERENCES PHUONG_TIEN (ID_PHUONGTIEN) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE PHANCONG_DONVAN ADD CONSTRAINT FK_PHANCONG_TAIXE FOREIGN KEY (ID_TAIXE)
    REFERENCES TAI_XE (ID_TAIXE) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE PHANCONG_DONVAN ADD CONSTRAINT FK_PHANCONG_DONVAN FOREIGN KEY (ID_DONVAN)
    REFERENCES DONVAN (ID_DONVAN) ON DELETE RESTRICT ON UPDATE RESTRICT;

/*==============================================================*/
/* Table: DONVANCONTAINER                                       */
/*==============================================================*/
CREATE TABLE DONVANCONTAINER (
    ID_CONTAINER     INT NOT NULL,
    ID_DONVAN        INT NOT NULL
);

ALTER TABLE DONVANCONTAINER ADD CONSTRAINT FK_DONVANCONTAINER_CONTAINER FOREIGN KEY (ID_CONTAINER)
    REFERENCES CONTAINER (ID_CONTAINER) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE DONVANCONTAINER ADD CONSTRAINT FK_DONVANCONTAINER_DONVAN FOREIGN KEY (ID_DONVAN)
    REFERENCES DONVAN (ID_DONVAN) ON DELETE RESTRICT ON UPDATE RESTRICT;

/*==============================================================*/
/* Table: DONVANHANGHOA                                         */
/*==============================================================*/
CREATE TABLE DONVANHANGHOA (
    ID_DONVAN        INT NOT NULL,
    ID_HANGHOA       INT NOT NULL
);

ALTER TABLE DONVANHANGHOA ADD CONSTRAINT FK_DONVANHANGHOA_HANGHOA FOREIGN KEY (ID_HANGHOA)
    REFERENCES HANGHOA (ID_HANGHOA) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE DONVANHANGHOA ADD CONSTRAINT FK_DONVANHANGHOA_DONVAN FOREIGN KEY (ID_DONVAN)
    REFERENCES DONVAN (ID_DONVAN) ON DELETE RESTRICT ON UPDATE RESTRICT;

    /*==============================================================*/
/* Table: INVOICES                                              */
/*==============================================================*/
CREATE TABLE INVOICES (
    ID_INVOICE       INT NOT NULL,
    ID_DONVAN        INT NOT NULL,
    NGAYPHATHANH     DATETIME NOT NULL,
    HANDONG          DATETIME NOT NULL,
    TONGTIEN         DECIMAL(15,2) NOT NULL, -- Changed from FLOAT to DECIMAL for accuracy
    DONVITT          VARCHAR(3) NOT NULL,
    TRANGTHAI        VARCHAR(100) NOT NULL,
    GHICHU           VARCHAR(255),
    PRIMARY KEY (ID_INVOICE)
);

ALTER TABLE INVOICES ADD CONSTRAINT FK_INVOICES_DONVAN FOREIGN KEY (ID_DONVAN)
    REFERENCES DONVAN (ID_DONVAN) ON DELETE RESTRICT ON UPDATE RESTRICT;

    /*==============================================================*/
/* Table: TAI_KHOAN                                             */
/*==============================================================*/
CREATE TABLE TAI_KHOAN (
    ID_TAIKHOAN      INT NOT NULL,
    USERNAME         VARCHAR(255) NOT NULL,
    PASSWORD         VARCHAR(255) NOT NULL, -- Remember to store hashed passwords
    EMAIL            VARCHAR(255) NOT NULL,
    SDT              VARCHAR(10) NOT NULL,
    PRIMARY KEY (ID_TAIKHOAN)
);

/*==============================================================*/
/* Table: VAI_TRO                                               */
/*==============================================================*/
CREATE TABLE VAI_TRO (
    ID_ROLE          INT NOT NULL,
    ID_TAIKHOAN      INT NOT NULL,
    ROLENAME         VARCHAR(255) NOT NULL,
    PRIMARY KEY (ID_ROLE)
);

ALTER TABLE VAI_TRO ADD CONSTRAINT FK_VAITRO_TAIKHOAN FOREIGN KEY (ID_TAIKHOAN)
    REFERENCES TAI_KHOAN (ID_TAIKHOAN) ON DELETE RESTRICT ON UPDATE RESTRICT;

/*==============================================================*/
/* Table: QUYEN                                                 */
/*==============================================================*/
CREATE TABLE QUYEN (
    ID_PERM          INT NOT NULL,
    ID_ROLE          INT NOT NULL,
    TENQUYEN         VARCHAR(255) NOT NULL,
    MTQUYEN          VARCHAR(255) NOT NULL,
    PRIMARY KEY (ID_PERM)
);

ALTER TABLE QUYEN ADD CONSTRAINT FK_QUYEN_VAITRO FOREIGN KEY (ID_ROLE)
    REFERENCES VAI_TRO (ID_ROLE) ON DELETE RESTRICT ON UPDATE RESTRICT;