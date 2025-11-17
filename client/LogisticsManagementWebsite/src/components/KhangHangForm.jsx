import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function KhachHangForm() {
  // State for KhachHang (Customer) fields
  const [Hoten, setHoten] = useState("");

  const [Sdt, setSdt] = useState("");
  const [Email, setEmail] = useState("");

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const HandleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const KhachHangData = {
      Hoten: Hoten,
      Sdt: Sdt,
      Email: Email,
    };

    try {
      const apiURL = import.meta.env.VITE_APP_API;
      const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

      if (!token) {
        throw new Error("User is not authenticated.");
      }

      // You will need to create this backend endpoint
      const response = await fetch(`${apiURL}/api/khachhang/createkhachhang`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(KhachHangData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Tạo khách hàng thất bại");
      }

      const NewKhachHang = await response.json();
      console.log("Khách hàng được tạo: ", NewKhachHang);

      // Reset form or navigate away
      // For this pattern, let's navigate to a custom er list page
      navigate("/"); // Or '/dashboard'
    } catch (error) {
      setError(error.message);
      console.log("Error :", error.message);
    }
  };

  return (
    <form onSubmit={HandleSubmit}>
      <h3> Thêm Khách Hàng Mới </h3>
      <div>
        <label htmlFor="tenKhachHang">Tên Khách Hàng / Công Ty</label>
        <input
          id="tenKhachHang"
          type="text"
          value={Hoten}
          onChange={(e) => setHoten(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="sdt">Số điện thoại</label>
        <input id="sdt" type="text" value={Sdt} onChange={(e) => setSdt(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={Email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <button type="submit"> Lưu Khách Hàng </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default KhachHangForm;
