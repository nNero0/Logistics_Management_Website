import React, { useState } from "react";

function TaiXeForm() {
  // State for TaiXe (Driver) fields
  const [HoTen, setHoTen] = useState("");
  const [Sdt, setSdt] = useState("");
  const [Email, setEmail] = useState("");
  const [BangLai, setBangLai] = useState("");
  const [TrangThaiNghiepVu, setTrangThaiNghiepVu] = useState("");
  const [LyDoChiTiet, setLyDoChiTiet] = useState(""); // Optional field
  const [CCCD, setCCCD] = useState("");
  const [NgayCapCCCD, setNgayCapCCCD] = useState("");
  const [NoiCapCCCD, setNoiCapCCCD] = useState("");

  const HandleSubmit = async (event) => {
    event.preventDefault();

    const TaiXeData = {
      HoTen: HoTen,
      Sdt: Sdt,
      Email: Email,
      BangLai: BangLai,
      TrangThaiNghiepVu: TrangThaiNghiepVu,
      LyDoChiTiet: LyDoChiTiet || null, // Send null if empty
      CCCD: CCCD,
      NgayCapCCCD: NgayCapCCCD,
      NoiCapCCCD: NoiCapCCCD,
    };

    try {
      const apiURL = process.env.VITE_APP_API;
      const token = localStorage.getItem('userToken'); // Get auth token

      if (!token) {
        throw new Error("User is not authenticated.");
      }

      // Update the API endpoint for creating a driver
      const response = await fetch(`${apiURL}/api/taixe/createtaixe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add the Authorization token
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(TaiXeData),
      });

      if (!response.ok) {
        console.error("Error:", response.status, response.statusText);
        throw new Error("Tai Xe Creation Failed");
      }

      const NewTaiXe = await response.json();
      console.log("TaiXe duoc tao ", NewTaiXe);

      // Reset all form fields
      setHoTen("");
      setSdt("");
      setEmail("");
      setBangLai("");
      setTrangThaiNghiepVu("");
      setLyDoChiTiet("");
      setCCCD("");
      setNgayCapCCCD("");
      setNoiCapCCCD("");

    } catch (error) {
      console.log("Error :", error.message);
    }
  };

  return (
    <form onSubmit={HandleSubmit}>
      <h3> Thêm tài xế mới </h3>
      <div>
        <label htmlFor="hoTen">Họ Tên</label>
        <input id="hoTen" type="text" value={HoTen} onChange={(e) => setHoTen(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="sdt">Số điện thoại</label>
        <input id="sdt" type="text" value={Sdt} onChange={(e) => setSdt(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={Email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="bangLai">Bằng Lái</label>
        <input id="bangLai" type="text" value={BangLai} onChange={(e) => setBangLai(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="trangThai">Trạng Thái Nghiệp Vụ</label>
        <input id="trangThai" type="text" value={TrangThaiNghiepVu} onChange={(e) => setTrangThaiNghiepVu(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="cccd">CCCD</label>
        <input id="cccd" type="text" value={CCCD} onChange={(e) => setCCCD(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="ngayCap">Ngày Cấp CCCD</label>
        <input id="ngayCap" type="date" value={NgayCapCCCD} onChange={(e) => setNgayCapCCCD(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="noiCap">Nơi Cấp CCCD</label>
        <input id="noiCap" type="text" value={NoiCapCCCD} onChange={(e) => setNoiCapCCCD(e.target.value)} required />
      </div>
       <div>
        <label htmlFor="lyDo">Lý Do Chi Tiết (Nếu có)</label>
        <input id="lyDo" type="text" value={LyDoChiTiet} onChange={(e) => setLyDoChiTiet(e.target.value)} />
      </div>
      <button type="submit"> Lưu tài xế </button>
    </form>
  );
}

export default TaiXeForm;