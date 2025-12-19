import React, { useState, useEffect } from "react";

function ChuyenDangChay() {
  const [chuyenDiList, setChuyenDiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiURL = import.meta.env.VITE_APP_API;
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  useEffect(() => {
    fetchChuyenDangChay();
  }, []);

  const fetchChuyenDangChay = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiURL}/api/dieuphoi/phancong?TrangThai=DangChay`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không thể tải danh sách chuyến đi");
      const phanCongData = await res.json();

      const grouped = phanCongData.reduce((acc, item) => {
        const key = `${item.IDTaiXe}-${item.IDPhuongTien}`;
        if (!acc[key]) {
          acc[key] = {
            taiXeId: item.IdTaiXe,
            phuongTienId: item.IdPhuongTien,
            taiXe: item.taiXe,
            phuongTien: item.phuongTien,
            soLuongDonVan: 0,
          };
        }
        acc[key].soLuongDonVan++;
        return acc;
      }, {});
      setChuyenDiList(Object.values(grouped));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleHoanThanh = async (taiXeId, phuongTienId) => {
    if (!window.confirm("Bạn chắc chắn tổ đội này đã hoàn thành chuyến đi?")) return;
    setError(null);
    try {
      const response = await fetch(`${apiURL}/api/dieuphoi/hoanthanh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taiXeId, phuongTienId }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Hoàn thành chuyến thất bại");
      }

      fetchChuyenDangChay();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Đang tải danh sách chuyến đi đang chạy...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📦 Các Chuyến Đang Vận Chuyển</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Tài Xế</th>
              <th>Phương Tiện</th>
              <th>Số Đơn Đang Chở</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {chuyenDiList.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  Không có chuyến nào đang chạy.
                </td>
              </tr>
            )}
            {chuyenDiList.map((chuyen) => (
              <tr key={`${chuyen.taiXeId}-${chuyen.phuongTienId}`}>
                <td>{chuyen.taiXe?.Hoten || "N/A"}</td>
                <td>{chuyen.phuongTien?.BienSo || "N/A"}</td>
                <td>{chuyen.soLuongDonVan} đơn</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleHoanThanh(chuyen.taiXeId, chuyen.phuongTienId)}
                  >
                    Hoàn Thành
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ChuyenDangChay;
