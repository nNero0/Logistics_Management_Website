import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // 1. Bỏ useNavigate

function LoTrinhForm() {
  // const navigate = useNavigate(); // 1. Bỏ navigate

  // --- State cho Form (Giữ nguyên) ---
  const [TenLoTrinh, setTenLoTrinh] = useState("");
  const [TrangThai, setTrangThai] = useState("Sẵn sàng");
  const [ETC, setETC] = useState(0);
  const [KhoangCach, setKhoangCach] = useState(0);

  const [khoBaiList, setKhoBaiList] = useState([]);
  const [selectedKhoId, setSelectedKhoId] = useState("");
  const [dsTramDung, setDsTramDung] = useState([]);

  const [error, setError] = useState(null);
  const [loadingKhoBai, setLoadingKhoBai] = useState(true); // 2. Đổi tên 'loading'

  // --- 3. STATE MỚI: Cho Panel Danh Sách ---
  const [loTrinhList, setLoTrinhList] = useState([]);
  const [loadingLoTrinhList, setLoadingLoTrinhList] = useState(true);

  const apiURL = import.meta.env.VITE_APP_API;
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  // --- Fetch Kho Bãi (cho Dropdown) ---
  useEffect(() => {
    const fetchKhoBai = async () => {
      try {
        const response = await fetch(`${apiURL}/api/khobai`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setKhoBaiList(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingKhoBai(false); // 2. Sửa tên state
      }
    };
    fetchKhoBai();
  }, [apiURL, token]); // Thêm dependencies

  // --- 4. FETCH MỚI: Tải danh sách Lộ Trình (cho Panel) ---
  const fetchLoTrinhList = async () => {
    setLoadingLoTrinhList(true);
    try {
      // Giả sử API GET lộ trình của bạn là /api/lotrinh
      const res = await fetch(`${apiURL}/api/lotrinh`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không tải được danh sách lộ trình");
      const data = await res.json();
      setLoTrinhList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingLoTrinhList(false);
    }
  };

  // Tải danh sách lộ trình khi component load
  useEffect(() => {
    fetchLoTrinhList();
  }, [apiURL, token]); // Thêm dependencies

  // --- Logic Thêm/Xóa/Di chuyển trạm (Giữ nguyên) ---
  const handleThemTram = () => {
    if (!selectedKhoId) return alert("Vui lòng chọn một kho bãi để thêm.");
    const daTonTai = dsTramDung.some((tram) => tram.IdKhoBai === parseInt(selectedKhoId));
    if (daTonTai) return alert("Kho bãi này đã có trong lộ trình.");
    const khoToAdd = khoBaiList.find((kho) => kho.IdKhoBai === parseInt(selectedKhoId));
    if (khoToAdd) {
      setDsTramDung([...dsTramDung, khoToAdd]);
      setSelectedKhoId("");
    }
  };
  const handleXoaTram = (id) => setDsTramDung(dsTramDung.filter((tram) => tram.IdKhoBai !== id));
  const moveTramUp = (i) => {
    if (i === 0) return;
    const newList = [...dsTramDung];
    [newList[i - 1], newList[i]] = [newList[i], newList[i - 1]];
    setDsTramDung(newList);
  };
  const moveTramDown = (i) => {
    if (i === dsTramDung.length - 1) return;
    const newList = [...dsTramDung];
    [newList[i], newList[i + 1]] = [newList[i + 1], newList[i]];
    setDsTramDung(newList);
  };

  // --- 5. Cập nhật HandleSubmit ---
  const HandleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    if (dsTramDung.length < 2) return setError("Một lộ trình phải có ít nhất 2 trạm dừng.");
    if (!TenLoTrinh) return setError("Vui lòng nhập tên lộ trình.");

    const dsKhoBaiIds = dsTramDung.map((tram) => tram.IdKhoBai);
    const LoTrinhData = {
      TenLoTrinh,
      trangThai: TrangThai,
      etc: parseFloat(ETC),
      khoangCach: parseFloat(KhoangCach),
      dsKhoBai: dsKhoBaiIds,
    };

    try {
      const response = await fetch(`${apiURL}/api/lotrinh/createlotrinh`, {
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

      // navigate("/createlotrinh"); // Bỏ dòng này
      
      // Reset form
      setTenLoTrinh("");
      setTrangThai("Sẵn sàng");
      setETC(0);
      setKhoangCach(0);
      setDsTramDung([]);
      setSelectedKhoId("");
      setError(null);

      alert("Tạo lộ trình thành công!");
      fetchLoTrinhList(); // Tải lại danh sách bên phải

    } catch (error) {
      setError(error.message);
    }
  };
  
  // === 6. HÀM MỚI: Xử lý Xóa ===
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa lộ trình này?")) return;
    try {
      // Giả sử API Xóa của bạn là /api/lotrinh/delete/:id
      const res = await fetch(`${apiURL}/api/lotrinh/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      fetchLoTrinhList(); // Tải lại danh sách
    } catch (err) {
      setError(err.message);
    }
  };


  if (loadingKhoBai) return <p>Loading location data...</p>;

  return (
    // === 7. BỐ CỤC MỚI ===
    <div className="d-flex gap-4">
      
      {/* --- Form bên trái --- */}
      <form onSubmit={HandleSubmit} className="p-4 border rounded bg-light flex-grow-1">
        <h3 className="mb-4">Tạo Lộ Trình Chi Tiết</h3>

        {/* Thông tin chung */}
        <div className="mb-3">
          <label htmlFor="TenLoTrinh" className="form-label">Tên Lộ Trình</label>
          <input
            type="text"
            id="TenLoTrinh"
            className="form-control"
            placeholder="Ví dụ: Tuyến HCM - Hà Nội (Qua Đà Nẵng)"
            value={TenLoTrinh}
            onChange={(e) => setTenLoTrinh(e.target.value)}
            required
          />
        </div>

        {/* Xây dựng Lộ Trình */}
        <h4 className="mt-4">Các Trạm Dừng</h4>
        <div className="border p-3 rounded mb-3">
          <div className="input-group mb-3">
            <select
              className="form-select"
              value={selectedKhoId}
              onChange={(e) => setSelectedKhoId(e.target.value)}
            >
              <option value="">-- Chọn kho bãi để thêm --</option>
              {khoBaiList.map((kho) => (
                <option key={kho.IdKhoBai} value={kho.IdKhoBai}>{kho.DiaChi} (ID: {kho.IdKhoBai})</option>
              ))}
            </select>
            <button type="button" className="btn btn-primary ms-2" onClick={handleThemTram}>
              Thêm
            </button>
          </div>

          <ol
            style={{
              paddingLeft: "20px",
              maxHeight: "300px",
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="no-scrollbar"
          >
            {dsTramDung.map((tram, index) => (
              <li
                key={tram.IdKhoBai}
                style={{ marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <span>
                  {index + 1}. {tram.TenKhoBai} ({tram.DiaChi})
                </span>
                <div>
                  <button type="button" onClick={() => moveTramUp(index)} disabled={index === 0} style={{ marginRight: "5px", border: '1px solid #ccc' }} className="btn btn-sm">↑</button>
                  <button type="button" onClick={() => moveTramDown(index)} disabled={index === dsTramDung.length - 1} style={{ marginRight: "5px", border: '1px solid #ccc' }} className="btn btn-sm">↓</button>
                  <button type="button" onClick={() => handleXoaTram(tram.IdKhoBai)} className="btn btn-sm btn-outline-danger">Xóa</button>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Thông tin chi tiết */}
        <div className="mb-3">
          <label htmlFor="TrangThai" className="form-label">Trạng thái</label>
          <select
            id="TrangThai"
            className="form-select"
            value={TrangThai}
            onChange={(e) => setTrangThai(e.target.value)}
            required
          >
            <option value="Sẵn sàng">Sẵn sàng</option>
            <option value="Cần sự cố">Cần sự cố</option>
            <option value="Không thể vận hành">Không thể vận hành</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="ETC" className="form-label">Thời gian dự kiến (giờ)</label>
          <input
            type="number"
            id="ETC"
            className="form-control"
            value={ETC}
            onChange={(e) => setETC(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="khoangCach" className="form-label">Khoảng Cách (km)</label>
          <input
            type="number"
            id="khoangCach"
            className="form-control"
            value={KhoangCach}
            onChange={(e) => setKhoangCach(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">Lưu Lộ Trình</button>
        {error && <div className="text-danger mt-2">{error}</div>}
      </form>

      {/* --- Sticky Panel bên phải (MỚI) --- */}
      <div className="border rounded p-3 bg-white" style={{ width: "400px", height: "90vh", overflowY: "auto", position: "sticky", top: "10px" }}>
        <h5>Danh sách lộ trình</h5>
        {loadingLoTrinhList ? <p>Đang tải...</p> : (
          <ul className="list-group">
            {loTrinhList.map(lt => (
              // Giả sử API trả về có IdLoTrinh
              <li key={lt.IdLoTrinh} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{lt.TenLoTrinh}</strong>
                  <br/>
                  <small>Khoảng cách: {lt.khoangCach}km - Trạng thái: {lt.trangThai}</small>
                </div>
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => handleDelete(lt.IdLoTrinh)} // Giả sử API xóa dùng IdLoTrinh
                >
                  Xóa
                </button>
              </li>
            ))}
            {loTrinhList.length === 0 && <li className="list-group-item">Không có lộ trình nào</li>}
          </ul>
        )}
      </div>
    </div>
  );
}

export default LoTrinhForm;