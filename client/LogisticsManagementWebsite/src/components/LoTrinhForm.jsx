import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Giả sử bạn có một thư viện để kéo-thả, ví dụ 'react-beautiful-dnd'
// Nếu không, chúng ta sẽ làm phiên bản không kéo-thả trước.
// Ở đây tôi sẽ làm phiên bản đơn giản (không kéo-thả) để dễ hiểu.

function LoTrinhForm() {
  // --- State cho thông tin chung ---
  const [TenLoTrinh, setTenLoTrinh] = useState(""); // <-- STATE MỚI
  const [TrangThai, setTrangThai] = useState("Sẵn sàng"); // Đặt giá trị mặc định
  const [ETC, setETC] = useState(0);
  const [KhoangCach, setKhoangCach] = useState(0);

  // --- State cho việc xây dựng lộ trình ---
  const [khoBaiList, setKhoBaiList] = useState([]); // Master list các kho
  const [selectedKhoId, setSelectedKhoId] = useState(""); // Kho đang được chọn trong dropdown
  const [dsTramDung, setDsTramDung] = useState([]); // <-- STATE MỚI: Các trạm đã thêm vào lộ trình

  // --- State cho UI ---
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch danh sách kho bãi (master list)
  useEffect(() => {
    const fetchKhoBai = async () => {
      try {
        const apiURL = import.meta.env.VITE_APP_API;
        const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
        const response = await fetch(`${apiURL}/api/khobai`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setKhoBaiList(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchKhoBai();
  }, []);

  // --- Logic thêm/xóa trạm dừng ---

  /**
   * Thêm kho được chọn vào danh sách trạm dừng
   */
  const handleThemTram = () => {
    if (!selectedKhoId) {
      alert("Vui lòng chọn một kho bãi để thêm.");
      return;
    }

    // Kiểm tra xem kho này đã được thêm chưa
    const daTonTai = dsTramDung.some((tram) => tram.IdKhoBai === parseInt(selectedKhoId));
    if (daTonTai) {
      alert("Kho bãi này đã có trong lộ trình.");
      return;
    }

    // Tìm thông tin đầy đủ của kho từ master list
    const khoToAdd = khoBaiList.find((kho) => kho.IdKhoBai === parseInt(selectedKhoId));

    if (khoToAdd) {
      setDsTramDung([...dsTramDung, khoToAdd]); // Thêm kho vào danh sách
      setSelectedKhoId(""); // Reset dropdown
    }
  };

  /**
   * Xóa một trạm dừng khỏi danh sách
   */
  const handleXoaTram = (idKhoBaiToRemove) => {
    setDsTramDung(dsTramDung.filter((tram) => tram.IdKhoBai !== idKhoBaiToRemove));
  };

  /**
   * Di chuyển trạm lên
   */
  const moveTramUp = (index) => {
    if (index === 0) return; // Không thể di chuyển item đầu tiên

    // Tạo một bản sao mới của mảng
    const newList = [...dsTramDung];

    // Dùng array destructuring để swap (hoán đổi) 2 phần tử
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];

    setDsTramDung(newList); // Cập nhật state với mảng đã sắp xếp
  };

  /**
   * Di chuyển trạm xuống
   */
  const moveTramDown = (index) => {
    if (index === dsTramDung.length - 1) return; // Không thể di chuyển item cuối cùng

    // Tạo một bản sao mới của mảng
    const newList = [...dsTramDung];

    // Dùng array destructuring để swap (hoán đổi) 2 phần tử
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];

    setDsTramDung(newList); // Cập nhật state với mảng đã sắp xếp
  };

  // --- Xử lý Submit Form ---

  const HandleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // Validation
    if (dsTramDung.length < 2) {
      setError("Một lộ trình phải có ít nhất 2 trạm dừng (điểm đầu và cuối).");
      return;
    }
    if (!TenLoTrinh) {
      setError("Vui lòng nhập tên cho lộ trình.");
      return;
    }

    // Lấy danh sách ID kho bãi theo đúng thứ tự
    const dsKhoBaiIds = dsTramDung.map((tram) => tram.IdKhoBai);

    // Đây là object data khớp với API Controller chúng ta đã tạo
    const LoTrinhData = {
      TenLoTrinh: TenLoTrinh,
      trangThai: TrangThai,
      etc: parseFloat(ETC),
      khoangCach: parseFloat(KhoangCach),
      dsKhoBai: dsKhoBaiIds, // Mảng các ID [1, 5, 3]
    };

    console.log("Submitting Lộ Trình Data:", LoTrinhData);

    try {
      const apiURL = import.meta.env.VITE_APP_API;
      const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

      // API endpoint đã thay đổi theo thiết kế controller mới
      const response = await fetch(`${apiURL}/api/lotrinh/createlotrinh`, {
        // URL đã sửa
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(LoTrinhData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Tạo lộ trình thất bại");
      }

      console.log("Lộ trình được tạo!");
      navigate("/createlotrinh"); // Điều hướng về trang chính
    } catch (error) {
      setError(error.message);
      console.log("Error :", error.message);
    }
  };

  if (loading) {
    return <p>Loading location data...</p>;
  }

  return (
    <form onSubmit={HandleSubmit} style={{ maxWidth: "600px", margin: "auto" }}>
      <h3>Tạo Lộ Trình Chi Tiết</h3>

      {/* Phần 1: Thông tin chung */}
      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="TenLoTrinh">Tên Lộ Trình</label>
        <input
          id="TenLoTrinh"
          type="text"
          value={TenLoTrinh}
          onChange={(e) => setTenLoTrinh(e.target.value)}
          required
          placeholder="Ví dụ: Tuyến HCM - Hà Nội (Qua Đà Nẵng)"
        />
      </div>

      {/* Phần 2: Xây dựng Lộ Trình */}
      <h4>Các Trạm Dừng</h4>
      <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
        {/* Dropdown để Thêm trạm */}
        <div style={{ display: "flex", marginBottom: "10px" }}>
          <select
            value={selectedKhoId}
            onChange={(e) => setSelectedKhoId(e.target.value)}
            style={{ flexGrow: 1, marginRight: "10px" }}
          >
            <option value="">-- Chọn kho bãi để thêm --</option>
            {khoBaiList.map((kho) => (
              <option key={kho.IdKhoBai} value={kho.IdKhoBai}>
                {kho.DiaChi} (ID: {kho.IdKhoBai})
              </option>
            ))}
          </select>
          <button type="button" onClick={handleThemTram}>
            Thêm
          </button>
        </div>

        {/* Danh sách các trạm đã thêm */}
        <p>Thứ tự lộ trình: (Trạm đầu tiên là điểm bắt đầu, trạm cuối là điểm kết thúc)</p>
        <ol style={{ paddingLeft: "20px" }}>
          {dsTramDung.map((tram, index) => (
            <li
              key={tram.IdKhoBai}
              style={{ marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <span>
                {index + 1}. {tram.DiaChi}
              </span>
              <div>
                <button
                  type="button"
                  onClick={() => moveTramUp(index)}
                  disabled={index === 0}
                  style={{ marginRight: "5px" }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveTramDown(index)}
                  disabled={index === dsTramDung.length - 1}
                  style={{ marginRight: "5px" }}
                >
                  ↓
                </button>
                <button type="button" onClick={() => handleXoaTram(tram.IdKhoBai)} style={{ color: "red" }}>
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ol>
        {dsTramDung.length === 0 && <p style={{ textAlign: "center", color: "#888" }}>Chưa có trạm dừng nào</p>}
      </div>

      <h4 style={{ marginTop: "20px" }}>Thông tin chi tiết</h4>

      <div>
        <label htmlFor="TrangThai">Trạng thái</label>
        <select id="TrangThai" value={TrangThai} onChange={(e) => setTrangThai(e.target.value)} required>
          <option value="Sẵn sàng">Sẵn sàng</option>
          <option value="Cần sự cố">Cần sự cố</option>
          <option value="Không thể vận hành">Không thể vận hành</option>
        </select>
      </div>

      <div>
        <label htmlFor="ETC">Thời gian dự kiến ( giờ )</label>
        <input id="ETC" type="number" value={ETC} onChange={(e) => setETC(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="khoangCach">Khoảng Cách (km)</label>
        <input
          id="khoangCach"
          type="number"
          value={KhoangCach}
          onChange={(e) => setKhoangCach(e.target.value)}
          required
        />
      </div>

      {/* Nút Submit */}
      <button type="submit" style={{ width: "100%", padding: "10px", marginTop: "20px" }}>
        Lưu Lộ Trình
      </button>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </form>
  );
}

export default LoTrinhForm;
