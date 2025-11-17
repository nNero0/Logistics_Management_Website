import React, { useState, useEffect } from "react";

function ChuyenDangChay() {
  // State để lưu danh sách các chuyến đi đã được nhóm lại
  const [chuyenDiList, setChuyenDiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiURL = import.meta.env.VITE_APP_API;
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  // --- EFFECT: Tải danh sách các chuyến đi đang chạy ---
  useEffect(() => {
    fetchChuyenDangChay();
  }, []);

  const fetchChuyenDangChay = async () => {
    setLoading(true);
    setError(null);
    try {
      // API MỚI: Bạn cần tạo API này
      const res = await fetch(`${apiURL}/api/dieuphoi/phancong?TrangThai=DangChay`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không thể tải danh sách chuyến đi");

      const phanCongData = await res.json(); // Đây là 1 mảng Phân Công (chưa nhóm)
      console.log(phanCongData);

      // --- Logic Nhóm (Group By) trên Frontend ---
      const grouped = phanCongData.reduce((acc, item) => {
        // Tạo một key duy nhất cho mỗi tổ đội
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
        acc[key].soLuongDonVan++; // Đếm số đơn
        return acc;
      }, {});

      setChuyenDiList(Object.values(grouped));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // --- HÀM XỬ LÝ HOÀN THÀNH ---
  const handleHoanThanh = async (taiXeId, phuongTienId) => {
    if (!window.confirm("Bạn chắc chắn tổ đội này đã hoàn thành chuyến đi?")) {
      return;
    }

    setError(null);
    try {
      // API "Vế Về" chúng ta đã thiết kế
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

      alert("Hoàn thành chuyến thành công! Vị trí tài sản đã được cập nhật.");

      // Tải lại danh sách (chuyến đi vừa xong sẽ biến mất)
      fetchChuyenDangChay();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Đang tải danh sách chuyến đi đang chạy...</p>;

  return (
    <div>
      <h2>📦 Các Chuyến Đang Vận Chuyển</h2>
      {error && <p style={{ color: "red" }}>Lỗi: {error}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Tài Xế</th>
            <th style={styles.th}>Phương Tiện</th>
            <th style={styles.th}>Số Đơn Đang Chở</th>
            <th style={styles.th}>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {chuyenDiList.length === 0 && (
            <tr>
              <td colSpan="4" style={styles.td}>
                Không có chuyến nào đang chạy.
              </td>
            </tr>
          )}
          {chuyenDiList.map((chuyen) => (
            <tr key={`${chuyen.taiXeId}-${chuyen.phuongTienId}`}>
              <td style={styles.td}>{chuyen.taiXe?.Hoten || "N/A"}</td>
              <td style={styles.td}>{chuyen.phuongTien?.BienSo || "N/A"}</td>
              <td style={styles.td}>{chuyen.soLuongDonVan} đơn</td>
              <td style={styles.td}>
                <button
                  style={styles.completeButton}
                  onClick={() => handleHoanThanh(chuyen.taiXeId, chuyen.phuongTienId)}
                >
                  Hoàn Thành Chuyến
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// (CSS styles)
const styles = {
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  th: { background: "#333", color: "white", padding: "10px", border: "1px solid #ddd", textAlign: "left" },
  td: { padding: "8px", border: "1px solid #ddd", textAlign: "left" },
  completeButton: {
    padding: "5px 10px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
};

export default ChuyenDangChay;
