import React, { useState } from "react";

function KhoBaiForm() {
  const [DiaChi, setDiaChi] = useState("");
  const [SucChuaTong, setSucChuaTong] = useState(0);
  const [TrangThai, setTrangThai] = useState("có sẵn");
  const [LoaiKho, setLoaiKho] = useState("Lưu trữ");
  const [error, setError] = useState(null);

  const HandleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const KhoBaiData = {
      DiaChi: DiaChi,
      SucChuaTong: Number(SucChuaTong),
      TrangThai: TrangThai,
      LoaiKho: LoaiKho,
    };

    try {
      const apiURL = import.meta.env.VITE_APP_API;
      const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

      if (!token) {
        throw new Error("User is not authenticated.");
      }

      const response = await fetch(`${apiURL}/api/khobai/createkhobai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(KhoBaiData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Tạo kho bãi thất bại");
      }

      const NewKhoBai = await response.json();
      console.log("Kho bãi được tạo: ", NewKhoBai);

      setDiaChi("");
      setSucChuaTong("");
      setTrangThai("có sẵn");
      setLoaiKho("Lưu trữ");
    } catch (error) {
      setError(error.message);
      console.log("Error :", error.message);
    }
  };

  return (
    <form onSubmit={HandleSubmit}>
      <h3> Thêm Kho Bãi / Địa Điểm Mới </h3>
      <div>
        <label htmlFor="diaChi">Địa Chỉ</label>
        <input id="diaChi" type="text" value={DiaChi} onChange={(e) => setDiaChi(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="SucChuaTong">Sức chứa tổng</label>
        <input
          id="SucChuaTong"
          type="text"
          value={SucChuaTong}
          onChange={(e) => setSucChuaTong(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="TrangThai">Trạng thái</label>
        <select id="TrangThai" value={TrangThai} onChange={(e) => setTrangThai(e.target.value)}>
          <option value="Có sẵn">Có sẵn</option>
          <option value="Gần đầy">Gần đầy</option>
          <option value="Đầy">Đầy</option>
        </select>
      </div>
      <div>
        <label htmlFor="LoaiKho">Loại Kho Bãi</label>
        <select id="LoaiKho" value={LoaiKho} onChange={(e) => setLoaiKho(e.target.value)}>
          <option value="Lưu trữ">Lưu trữ</option>
          <option value="Điểm Trung Chuyển">Điểm Trung Chuyển</option>
          <option value="Điểm Giao Hàng">Điểm Giao Hàng</option>
        </select>
      </div>

      <button type="submit"> Lưu Địa Điểm </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default KhoBaiForm;
