/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     9/30/2025 10:16:39 AM                        */
/*==============================================================*/


alter table CSC 
   drop foreign key FK_CSC_CSC_CONTA_CONTAINE;

alter table DIEMDUNGTRUNGGIAN 
   drop foreign key FK_DIEMDUNG_GHE_KHO__BAI;

alter table DIEMDUNGTRUNGGIAN 
   drop foreign key FK_DIEMDUNG_NAMTREN_LO_TRINH;

alter table DONVAN 
   drop foreign key FK_DONVAN_DATHANG_KHACH_HA;

alter table DONVAN 
   drop foreign key FK_DONVAN_DUONGDI_LO_TRINH;

alter table DONVANCONTAINER 
   drop foreign key FK_DONVANCO_CONTAINER_CONTAINE;

alter table DONVANCONTAINER 
   drop foreign key FK_DONVANCO_VCCONTAIN_DONVAN;

alter table DONVANHANGHOA 
   drop foreign key FK_DONVANHA_BUUKIENDI_HANGHOA;

alter table DONVANHANGHOA 
   drop foreign key FK_DONVANHA_VANCHUYEN_DONVAN;

alter table HANGHOA 
   drop foreign key FK_HANGHOA_CHUADUNG_CONTAINE;

alter table INVOICES 
   drop foreign key FK_INVOICES_HOADONVAN_DONVAN;

alter table PHANCONG_DONVAN 
   drop foreign key FK_PHANCONG_CHONXE_PHUONG_T;

alter table PHANCONG_DONVAN 
   drop foreign key FK_PHANCONG_DAMNHAN_TAI_XE;

alter table PHANCONG_DONVAN 
   drop foreign key FK_PHANCONG_RELATIONS_DONVAN;

alter table QUYEN 
   drop foreign key FK_QUYEN_CO_QUYEN_VAI_TRO;

alter table VAI_TRO 
   drop foreign key FK_VAI_TRO_LOAI_TAI_KHOA;

drop table if exists CONTAINER_;


alter table CSC 
   drop foreign key FK_CSC_CSC_CONTA_CONTAINE;

drop table if exists CSC;


alter table DIEMDUNGTRUNGGIAN 
   drop foreign key FK_DIEMDUNG_GHE_KHO__BAI;

alter table DIEMDUNGTRUNGGIAN 
   drop foreign key FK_DIEMDUNG_NAMTREN_LO_TRINH;

drop table if exists DIEMDUNGTRUNGGIAN;


alter table DONVAN 
   drop foreign key FK_DONVAN_DUONGDI_LO_TRINH;

alter table DONVAN 
   drop foreign key FK_DONVAN_DATHANG_KHACH_HA;

drop table if exists DONVAN;


alter table DONVANCONTAINER 
   drop foreign key FK_DONVANCO_CONTAINER_CONTAINE;

alter table DONVANCONTAINER 
   drop foreign key FK_DONVANCO_VCCONTAIN_DONVAN;

drop table if exists DONVANCONTAINER;


alter table DONVANHANGHOA 
   drop foreign key FK_DONVANHA_BUUKIENDI_HANGHOA;

alter table DONVANHANGHOA 
   drop foreign key FK_DONVANHA_VANCHUYEN_DONVAN;

drop table if exists DONVANHANGHOA;


alter table HANGHOA 
   drop foreign key FK_HANGHOA_CHUADUNG_CONTAINE;

drop table if exists HANGHOA;


alter table INVOICES 
   drop foreign key FK_INVOICES_HOADONVAN_DONVAN;

drop table if exists INVOICES;

drop table if exists KHACH_HANG;

drop table if exists KHO__BAI;

drop table if exists LO_TRINH;


alter table PHANCONG_DONVAN 
   drop foreign key FK_PHANCONG_DAMNHAN_TAI_XE;

alter table PHANCONG_DONVAN 
   drop foreign key FK_PHANCONG_CHONXE_PHUONG_T;

alter table PHANCONG_DONVAN 
   drop foreign key FK_PHANCONG_RELATIONS_DONVAN;

drop table if exists PHANCONG_DONVAN;

drop table if exists PHUONG_TIEN;


alter table QUYEN 
   drop foreign key FK_QUYEN_CO_QUYEN_VAI_TRO;

drop table if exists QUYEN;

drop table if exists TAI_KHOAN;

drop table if exists TAI_XE;


alter table VAI_TRO 
   drop foreign key FK_VAI_TRO_LOAI_TAI_KHOA;

drop table if exists VAI_TRO;

/*==============================================================*/
/* Table: CONTAINER_                                            */
/*==============================================================*/
create table CONTAINER_
(
   ID_CONTAINER         int not null  comment '',
   TRANG_THAI           varchar(255) not null  comment '',
   MASOHUU_             varchar(255) not null  comment '',
   ECI                  varchar(1) not null  comment '',
   SERIAL               varchar(6) not null  comment '',
   "CHECK"              varchar(1) not null  comment '',
   TARE                 decimal(15,2) not null  comment '',
   GROSS                decimal(15,2) not null  comment '',
   LOAI                 varchar(255) not null  comment '',
   TAIHIENTAI           decimal(15,2) not null  comment '',
   THETICH              decimal(15,2) not null  comment '',
   ISO                  varchar(12) not null  comment '',
   MIEUTANOIDUNG        varchar(255) not null  comment '',
   primary key (ID_CONTAINER)
);

/*==============================================================*/
/* Table: CSC                                                   */
/*==============================================================*/
create table CSC
(
   ID_CONTAINER         int not null  comment '',
   PLATENUMBER          varchar(20) not null  comment '',
   APPROVALNUMBER       varchar(20) not null  comment '',
   LASTINSPECTION       date not null  comment '',
   EXPIRY               date not null  comment ''
);

/*==============================================================*/
/* Table: DIEMDUNGTRUNGGIAN                                     */
/*==============================================================*/
create table DIEMDUNGTRUNGGIAN
(
   ID_KHOBAI            int not null  comment '',
   ID_LOTRINH           int not null  comment ''
);

/*==============================================================*/
/* Table: DONVAN                                                */
/*==============================================================*/
create table DONVAN
(
   ID_DONVAN            int not null  comment '',
   ID_LOTRINH           int not null  comment '',
   ID_KHACHHANG         int not null  comment '',
   DIADIEMGIAO          varchar(255) not null  comment '',
   PHIVANCHUYEN         decimal(15,2) not null  comment '',
   ETA                  decimal(15,2) not null  comment '',
   NGAYLAPDON           datetime not null  comment '',
   primary key (ID_DONVAN)
);

/*==============================================================*/
/* Table: DONVANCONTAINER                                       */
/*==============================================================*/
create table DONVANCONTAINER
(
   ID_CONTAINER         int not null  comment '',
   ID_DONVAN            int not null  comment ''
);

/*==============================================================*/
/* Table: DONVANHANGHOA                                         */
/*==============================================================*/
create table DONVANHANGHOA
(
   ID_DONVAN            int not null  comment '',
   ID_HANGHOA           int not null  comment ''
);

/*==============================================================*/
/* Table: HANGHOA                                               */
/*==============================================================*/
create table HANGHOA
(
   ID_HANGHOA           int not null  comment '',
   ID_CONTAINER         int  comment '',
   NOIDUNG              varchar(20) not null  comment '',
   CANNANG              decimal(15,2) not null  comment '',
   CHIEUDAI             decimal(15,2) not null  comment '',
   XUATSU               varchar(3) not null  comment '',
   GHICHU               varchar(255)  comment '',
   CHIEURONG            decimal(15,2) not null  comment '',
   CHIEUCAO             decimal(15,2) not null  comment '',
   primary key (ID_HANGHOA)
);

/*==============================================================*/
/* Table: INVOICES                                              */
/*==============================================================*/
create table INVOICES
(
   ID_INVOICE           int not null  comment '',
   ID_DONVAN            int not null  comment '',
   NGAYPHATHANH         datetime not null  comment '',
   HANDONG              datetime not null  comment '',
   TONGTIEN             float(8,2) not null  comment '',
   DONVITT              varchar(3) not null  comment '',
   TRANGTHAI            varchar(100) not null  comment '',
   GHICHU               varchar(255)  comment '',
   primary key (ID_INVOICE)
);

/*==============================================================*/
/* Table: KHACH_HANG                                            */
/*==============================================================*/
create table KHACH_HANG
(
   HOTEN                varchar(255) not null  comment '',
   SDT                  varchar(10) not null  comment '',
   EMAIL                varchar(255) not null  comment '',
   ID_KHACHHANG         int not null  comment '',
   primary key (ID_KHACHHANG)
);

/*==============================================================*/
/* Table: KHO__BAI                                              */
/*==============================================================*/
create table KHO__BAI
(
   ID_KHOBAI            int not null  comment '',
   DIA_CHI_             varchar(255) not null  comment '',
   SUC_CHUA_TONG_KHO    decimal(15,2) not null  comment '',
   SUC_CHUA_CON_LAI     decimal(15,2) not null  comment '',
   TRANG_THAI           varchar(255) not null  comment '',
   LOAI_KHO             varchar(255)  comment '',
   primary key (ID_KHOBAI)
);

/*==============================================================*/
/* Table: LO_TRINH                                              */
/*==============================================================*/
create table LO_TRINH
(
   ID_LOTRINH           int not null  comment '',
   NOIBATDAU            varchar(255) not null  comment '',
   NOIKETTHUC           varchar(255) not null  comment '',
   TRANGTHAI            varchar(255) not null  comment '',
   ETC                  decimal(15,2) not null  comment '',
   primary key (ID_LOTRINH)
);

/*==============================================================*/
/* Table: PHANCONG_DONVAN                                       */
/*==============================================================*/
create table PHANCONG_DONVAN
(
   ID_TAIXE             int not null  comment '',
   ID_PHUONGTIEN        int not null  comment '',
   ID_DONVAN            int not null  comment '',
   NGAYBATDAU           date not null  comment '',
   NGAYKETTHUC          date not null  comment '',
   TRANGTHAI            varchar(255)  comment ''
);

/*==============================================================*/
/* Table: PHUONG_TIEN                                           */
/*==============================================================*/
create table PHUONG_TIEN
(
   ID_PHUONGTIEN        int not null  comment '',
   BIEN_SO              varchar(10) not null  comment '',
   LOAI                 varchar(255) not null  comment '',
   THE_TICH_            decimal(15,2) not null  comment '',
   TAI_TRONG            decimal(15,2) not null  comment '',
   TRANG_THAI           varchar(255) not null  comment '',
   primary key (ID_PHUONGTIEN)
);

/*==============================================================*/
/* Table: QUYEN                                                 */
/*==============================================================*/
create table QUYEN
(
   ID_PERM              int not null  comment '',
   ID_ROLE              int not null  comment '',
   TENQUYEN             varchar(255) not null  comment '',
   MTQUYEN              varchar(255) not null  comment '',
   primary key (ID_PERM)
);

/*==============================================================*/
/* Table: TAI_KHOAN                                             */
/*==============================================================*/
create table TAI_KHOAN
(
   ID_TAIKHOAN          int not null  comment '',
   USERNAME             varchar(255) not null  comment '',
   PASSWORD             varchar(255) not null  comment '',
   EMAIL                varchar(255) not null  comment '',
   SDT                  varchar(10) not null  comment '',
   primary key (ID_TAIKHOAN)
);

/*==============================================================*/
/* Table: TAI_XE                                                */
/*==============================================================*/
create table TAI_XE
(
   ID_TAIXE             int not null  comment '',
   HOTEN                varchar(255) not null  comment '',
   SDT                  varchar(10) not null  comment '',
   EMAIL                varchar(255) not null  comment '',
   BANGLAI              varchar(5) not null  comment '',
   TRANGTHAINGHIEPVU    varchar(5) not null  comment '',
   primary key (ID_TAIXE)
);

/*==============================================================*/
/* Table: VAI_TRO                                               */
/*==============================================================*/
create table VAI_TRO
(
   ID_ROLE              int not null  comment '',
   ID_TAIKHOAN          int not null  comment '',
   ROLENAME             varchar(255) not null  comment '',
   primary key (ID_ROLE)
);

alter table CSC add constraint FK_CSC_CSC_CONTA_CONTAINE foreign key (ID_CONTAINER)
      references CONTAINER_ (ID_CONTAINER) on delete restrict on update restrict;

alter table DIEMDUNGTRUNGGIAN add constraint FK_DIEMDUNG_GHE_KHO__BAI foreign key (ID_KHOBAI)
      references KHO__BAI (ID_KHOBAI) on delete restrict on update restrict;

alter table DIEMDUNGTRUNGGIAN add constraint FK_DIEMDUNG_NAMTREN_LO_TRINH foreign key (ID_LOTRINH)
      references LO_TRINH (ID_LOTRINH) on delete restrict on update restrict;

alter table DONVAN add constraint FK_DONVAN_DATHANG_KHACH_HA foreign key (ID_KHACHHANG)
      references KHACH_HANG (ID_KHACHHANG) on delete restrict on update restrict;

alter table DONVAN add constraint FK_DONVAN_DUONGDI_LO_TRINH foreign key (ID_LOTRINH)
      references LO_TRINH (ID_LOTRINH) on delete restrict on update restrict;

alter table DONVANCONTAINER add constraint FK_DONVANCO_CONTAINER_CONTAINE foreign key (ID_CONTAINER)
      references CONTAINER_ (ID_CONTAINER) on delete restrict on update restrict;

alter table DONVANCONTAINER add constraint FK_DONVANCO_VCCONTAIN_DONVAN foreign key (ID_DONVAN)
      references DONVAN (ID_DONVAN) on delete restrict on update restrict;

alter table DONVANHANGHOA add constraint FK_DONVANHA_BUUKIENDI_HANGHOA foreign key (ID_HANGHOA)
      references HANGHOA (ID_HANGHOA) on delete restrict on update restrict;

alter table DONVANHANGHOA add constraint FK_DONVANHA_VANCHUYEN_DONVAN foreign key (ID_DONVAN)
      references DONVAN (ID_DONVAN) on delete restrict on update restrict;

alter table HANGHOA add constraint FK_HANGHOA_CHUADUNG_CONTAINE foreign key (ID_CONTAINER)
      references CONTAINER_ (ID_CONTAINER) on delete restrict on update restrict;

alter table INVOICES add constraint FK_INVOICES_HOADONVAN_DONVAN foreign key (ID_DONVAN)
      references DONVAN (ID_DONVAN) on delete restrict on update restrict;

alter table PHANCONG_DONVAN add constraint FK_PHANCONG_CHONXE_PHUONG_T foreign key (ID_PHUONGTIEN)
      references PHUONG_TIEN (ID_PHUONGTIEN) on delete restrict on update restrict;

alter table PHANCONG_DONVAN add constraint FK_PHANCONG_DAMNHAN_TAI_XE foreign key (ID_TAIXE)
      references TAI_XE (ID_TAIXE) on delete restrict on update restrict;

alter table PHANCONG_DONVAN add constraint FK_PHANCONG_RELATIONS_DONVAN foreign key (ID_DONVAN)
      references DONVAN (ID_DONVAN) on delete restrict on update restrict;

alter table QUYEN add constraint FK_QUYEN_CO_QUYEN_VAI_TRO foreign key (ID_ROLE)
      references VAI_TRO (ID_ROLE) on delete restrict on update restrict;

alter table VAI_TRO add constraint FK_VAI_TRO_LOAI_TAI_KHOA foreign key (ID_TAIKHOAN)
      references TAI_KHOAN (ID_TAIKHOAN) on delete restrict on update restrict;

