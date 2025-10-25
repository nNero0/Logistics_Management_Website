import React, { useState } from "react";

function PhuongTienForm() {
  const [BienSo, SetBienSo] = useState("");
  const [Loai, SetLoai] = useState("");
  const [TaiTrong, SetTaiTrong] = useState(0);
  const [TrongTai, SetTrongTai] = useState(0);
  const [TrangThai, SetTrangThai] = useState("");
  const [GiayDangKyXeSo, SetGiayDangKyXeSo] = useState("");
  const [CDaiThungChua, SetCDaiThungChua] = useState(0);
  const [CRongThungChua, SetCRongThungChua] = useState(0);
  const [CCaoThungChua, SetCCaoThungChua] = useState(0);

  const HandleSubmit = async (event) => {
    event.preventDefault();

    const PhuongTienData = {
      BienSo: BienSo,
      Loai: Loai,
      TaiTrong: Number(TaiTrong),
      TrongTai: Number(TrongTai),
      TrangThai: TrangThai,
      GiayDangKyXeSo: GiayDangKyXeSo,
      CDaiThungChua: Number(CDaiThungChua),
      CRongThungChua: Number(CRongThungChua),
      CCaoThungChua: Number(CCaoThungChua),
    };
    try {
      const apiURL = process.env.VITE_APP_API;

      const response = await fetch(`${apiURL}/api/phuongtien/createphuongtien`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // AUTH TOKEN
        },
        body: JSON.stringify(PhuongTienData),
      });
      if (!response.ok) {
        console.error("Error:", response.status, response.statusText);

        throw new Error("Phuong Tien Creation Failed ");
      }
      const NewPhuongTien = await response.json();
      console.log("PhuongTien duoc tao ", NewPhuongTien);

      SetBienSo("");
      SetLoai("");
      SetTaiTrong(0);
      SetTrongTai(0);
      SetTrangThai("");
      SetGiayDangKyXeSo("");
      SetCDaiThungChua(0);
      SetCRongThungChua(0);
      SetCCaoThungChua(0);
    } catch (error) {
      console.log("Error :", error);
    }
  };
  return (
    <form onSubmit={HandleSubmit}>
      <h3> Thêm phương tiện mới </h3>
      <div>
        <label htmlFor="">Biển số</label>
        <input type="text" value={BienSo} onChange={(e) => SetBienSo(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="">Loại Phương tiện</label>
        <input type="text" value={Loai} onChange={(e) => SetLoai(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="">TaiTrong</label>
        <input type="text" value={TaiTrong} onChange={(e) => SetTaiTrong(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="">TrongTai</label>
        <input type="text" value={TrongTai} onChange={(e) => SetTrongTai(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="">TrangThai</label>
        <input type="text" value={TrangThai} onChange={(e) => SetTrangThai(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="">GiayDangKyXeSo</label>
        <input type="text" value={GiayDangKyXeSo} onChange={(e) => SetGiayDangKyXeSo(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="">CDaiThungChua</label>
        <input type="text" value={CDaiThungChua} onChange={(e) => SetCDaiThungChua(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="">CRongThungChua</label>
        <input type="text" value={CRongThungChua} onChange={(e) => SetCRongThungChua(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="">CCaoThungChua</label>
        <input type="text" value={CCaoThungChua} onChange={(e) => SetCCaoThungChua(e.target.value)} required />
      </div>
      <button type="submit"> Lưu phương tiện </button>
    </form>
  );
}

export default PhuongTienForm;
