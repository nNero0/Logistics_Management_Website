import React, { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

function HangHoaForm() {
  const navigate = useNavigate();

  const [NoiDung, setNoiDung] = useState("");
  const [CanNang, setCanNang] = useState(0);
  const [ChieuDai, setChieuDai] = useState(0);
  const [ChieuRong, setChieuRong] = useState(0);
  const [ChieuCao, setChieuCao] = useState(0);
  const [XuatXu, setXuatXu] = useState("VN");
  const [GhiChu, setGhiChu] = useState("");

  const [error, setError] = useState(null);

  const HandleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const HangHoaData = {
      NoiDung: NoiDung,
      CanNang: parseFloat(CanNang),
      ChieuDai: parseFloat(ChieuDai),
      ChieuRong: parseFloat(ChieuRong),
      ChieuCao: parseFloat(ChieuCao),
      XuatXu: XuatXu,
      GhiChu: GhiChu,
    };

    try {
      const apiURL = import.meta.env.VITE_APP_API;
      const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

      if (!token) {
        throw new Error("User is not authenticated.");
      }

      const response = await fetch(`${apiURL}/api/hanghoa/createhanghoa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(HangHoaData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Tạo hàng hóa thất bại");
      }

      const NewHangHoa = await response.json();
      console.log("Hàng hóa được tạo: ", NewHangHoa);

      navigate("/");
    } catch (error) {
      setError(error.message);
      console.log("Error :", error.message);
    }
  };

  return (
    <form onSubmit={HandleSubmit}>


      <div>
        <label htmlFor="noiDung">Nội Dung</label>
        <input id="noiDung" type="text" value={NoiDung} onChange={(e) => setNoiDung(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="canNang">Cân Nặng (kg)</label>
        <input
          id="canNang"
          type="number"
          step="0.01"
          value={CanNang}
          onChange={(e) => setCanNang(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="chieuDai">Chiều Dài (m)</label>
        <input
          id="chieuDai"
          type="number"
          step="0.01"
          value={ChieuDai}
          onChange={(e) => setChieuDai(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="chieuRong">Chiều Rộng (m)</label>
        <input
          id="chieuRong"
          type="number"
          step="0.01"
          value={ChieuRong}
          onChange={(e) => setChieuRong(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="chieuCao">Chiều Cao (m)</label>
        <input
          id="chieuCao"
          type="number"
          step="0.01"
          value={ChieuCao}
          onChange={(e) => setChieuCao(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="xuatXu">Xuất Xứ (VD: VN, US, CN)</label>
        <input
          id="xuatXu"
          type="text"
          value={XuatXu}
          onChange={(e) => setXuatXu(e.target.value)}
          maxLength={3}
          required
        />
      </div>

      <div>
        <label htmlFor="ghiChu">Ghi Chú (Không bắt buộc)</label>
        <input id="ghiChu" type="text" value={GhiChu} onChange={(e) => setGhiChu(e.target.value)} />
      </div>

      <button type="submit"> Lưu Hàng Hóa </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default HangHoaForm;
