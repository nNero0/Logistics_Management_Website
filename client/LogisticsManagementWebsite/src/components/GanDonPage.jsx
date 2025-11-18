import React, { useState, useEffect } from "react";


const Modal = ({ show, onClose, title, children }) => {
  if (!show) {
    return null;
  }
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h4>{title}</h4>
          <button onClick={onClose} style={styles.closeButton}>&times;</button>
        </div>
        <div style={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
};


function GanDonPage() {
  // --- State cho dữ liệu ---
  const [loTrinhList, setLoTrinhList] = useState([]); // Tải lúc đầu
  const [taiXeList, setTaiXeList] = useState([]); // Tải khi lọc
  const [phuongTienList, setPhuongTienList] = useState([]); // Tải khi lọc
  const [DonVanList, setDonVanList] = useState([]); // Tải khi lọc

  // --- State cho UI ---
  const [filterLoTrinhId, setFilterLoTrinhId] = useState("");
  const [selectedDonVanIds, setSelectedDonVanIds] = useState([]);
  const [selectedTaiXeId, setSelectedTaiXeId] = useState("");
  const [selectedPhuongTienId, setSelectedPhuongTienId] = useState("");
  
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true); // Loading trang ban đầu
  const [loadingAssets, setLoadingAssets] = useState(false); // Loading khi lọc
  const [error, setError] = useState(null);

  const apiURL = import.meta.env.VITE_APP_API;
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  // --- EFFECT 1: Tải Lộ Trình (chỉ 1 lần khi tải trang) ---
  useEffect(() => {
    const fetchLoTrinh = async () => {
      if (!token) {
        setError("Bạn chưa đăng nhập.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // API này CẦN 'include' khoBatDau, khoKetThuc
        const res = await fetch(`${apiURL}/api/lotrinh`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        if (!res.ok) throw new Error("Không thể tải Lộ trình");
        
        const loTrinhData = await res.json();
        setLoTrinhList(loTrinhData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchLoTrinh();
  }, [apiURL, token]);

  // --- EFFECT 2: Tải Đơn Vận, Tài Xế, Phương Tiện KHI Lộ Trình thay đổi ---
  useEffect(() => {
    // 1. Nếu không chọn Lộ trình, xóa hết danh sách con
    if (!filterLoTrinhId) {
      setDonVanList([]);
      setTaiXeList([]);
      setPhuongTienList([]);
      return;
    }

    // 2. Tìm Lộ trình được chọn từ state
    const selectedLoTrinh = loTrinhList.find(
      (lt) => lt.IdLoTrinh === Number(filterLoTrinhId)
    );
    if (!selectedLoTrinh) return;

    // 3. Lấy Kho Bắt Đầu từ Lộ trình đó
    // (Giả sử API Lộ trình trả về IdKhoBaiBatDau)
    const { IdKhoBaiBatDau, IdKhoBaiKetThuc } = selectedLoTrinh;
    
    if (!IdKhoBaiBatDau) {
        setError("Lộ trình này thiếu Kho Bắt Đầu. Không thể lọc.");
        setDonVanList([]);
        setTaiXeList([]);
        setPhuongTienList([]);
        return;
    }

    const fetchAssets = async () => {
      setLoadingAssets(true);
      setError(null);
      try {
        // Query cho Đơn Vận
        const DonVanQuery = new URLSearchParams({
          trangThai: "ChoXuLy",
          khoBatDauId: IdKhoBaiBatDau,
          khoKetThucId: IdKhoBaiKetThuc 
        }).toString();
        
        // Query cho Tài sản (Tài xế & Xe)
        const assetQuery = new URLSearchParams({
          trangThai: "SanSang",     // Chỉ lấy tài sản "Sẵn sàng"
          viTriId: IdKhoBaiBatDau  // Chỉ lấy tài sản tại kho bắt đầu
        }).toString();

        // 4. Gọi 3 API cùng lúc
        const [DonVanRes, taiXeRes, phuongTienRes] = await Promise.all([
          fetch(`${apiURL}/api/donvan?${DonVanQuery}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiURL}/api/taixe?${assetQuery}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiURL}/api/phuongtien?${assetQuery}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (!DonVanRes.ok || !taiXeRes.ok || !phuongTienRes.ok) {
          throw new Error("Lỗi khi tải Đơn vận, Tài xế hoặc Phương tiện");
        }

        const DonVanData = await DonVanRes.json();
        const taiXeData = await taiXeRes.json();
        const phuongTienData = await phuongTienRes.json();
        
        setDonVanList(DonVanData);
        setTaiXeList(taiXeData);
        setPhuongTienList(phuongTienData);
        setLoadingAssets(false);

      } catch (err) {
        setError(err.message);
        setLoadingAssets(false);
      }
    };

    fetchAssets();
  }, [filterLoTrinhId, loTrinhList, apiURL, token]); // Chạy lại khi filterLoTrinhId thay đổi

  
  // --- Xử lý Checkbox ---
  const handleCheckboxChange = (DonVanId) => {
    setSelectedDonVanIds(prevIds => {
      if (prevIds.includes(DonVanId)) {
        return prevIds.filter(id => id !== DonVanId); // Bỏ check
      } else {
        return [...prevIds, DonVanId]; // Check
      }
    });
  };

  // --- Xử lý Submit Modal (Gán Đơn) ---
  const handleAssignSubmit = async () => {
    if (!selectedTaiXeId || !selectedPhuongTienId) {
      alert("Vui lòng chọn cả Tài xế VÀ Phương tiện.");
      return;
    }
    if (selectedDonVanIds.length === 0) {
      alert("Vui lòng chọn ít nhất một đơn vận để gán.");
      return;
    }

    try {
      // API NÀY SẼ THỰC HIỆN LOGIC "findOrCreate KetHop"
      const response = await fetch(`${apiURL}/api/dieuphoi/gandon `, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          DonVanIds: selectedDonVanIds,
          taiXeId: Number(selectedTaiXeId),
          phuongTienId: Number(selectedPhuongTienId),
          // Gửi IdLoTrinh để API biết cập nhật trạng thái
          IdLoTrinh: Number(filterLoTrinhId) 
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Gán đơn thất bại");
      }

      alert(`Đã gán thành công ${selectedDonVanIds.length} đơn vận!`);
      setShowModal(false);
      
      // Tải lại danh sách (bằng cách xóa các đơn đã gán khỏi state)
      const newDonVanList = DonVanList.filter(dv => !selectedDonVanIds.includes(dv.IdDonVan));
      setDonVanList(newDonVanList);

      // Reset
      setSelectedDonVanIds([]);
      setSelectedTaiXeId("");
      setSelectedPhuongTienId("");
      
      // (Nâng cao: Cập nhật lại danh sách tài xế/xe mà không cần reload)

    } catch (err) {
      setError(err.message);
    }
  };
  
  if (loading) {
    return <p>Đang tải danh sách Lộ trình...</p>;
  }

  return (
    <div>
      <h2>🚚 Trang Điều Phối (Lọc theo Vị trí)</h2>

      {/* --- BỘ LỌC LỘ TRÌNH --- */}
      <div style={styles.filterSection}>
        <label htmlFor="loTrinhFilter">Chọn Lộ Trình (Để lọc Đơn và Tài sản):</label>
        <select 
          id="loTrinhFilter" 
          value={filterLoTrinhId} 
          onChange={(e) => setFilterLoTrinhId(e.target.value)}
        >
          <option value="">-- Chọn một lộ trình --</option>
          {loTrinhList.map(lt => (
            // API /api/lotrinh CẦN 'include' khoBatDau
            <option key={lt.IdLoTrinh} value={lt.IdLoTrinh}>
              {lt.TenLoTrinh} (Bắt đầu từ: {lt.khoBatDau?.TenKhoBai || 'N/A'})
            </option>
          ))}
        </select>
      </div>
      
      {error && <p style={{ color: "red" }}>Lỗi: {error}</p>}
      
      {/* --- NÚT HÀNH ĐỘNG --- */}
      <button 
        onClick={() => setShowModal(true)}
        disabled={selectedDonVanIds.length === 0}
        style={styles.dispatchButton}
      >
        Điều phối {selectedDonVanIds.length} đơn đã chọn
      </button>

      {/* Thông báo loading/kết quả */}
      {loadingAssets && <p>Đang tải tài sản và đơn vận...</p>}
      {!loadingAssets && filterLoTrinhId && DonVanList.length === 0 && (
          <p style={{color: 'gray'}}>Không có đơn vận "Chờ điều phối" nào khớp với lộ trình này.</p>
      )}

      {/* Bảng Đơn Vận */}
      <h3 style={{marginTop: '20px'}}>Đơn Vận Chờ Gán</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Chọn</th>
            <th style={styles.th}>ID Đơn</th>
            <th style={styles.th}>Khách Hàng</th>
            <th style={styles.th}>Kho Lấy Hàng</th>
            <th style={styles.th}>Kho Giao Hàng</th>
          </tr>
        </thead>
         <tbody>
            {DonVanList.map(dv => (
              <tr key={dv.IdDonVan}>
                <td style={styles.td}>
                  <input 
                    type="checkbox"
                    checked={selectedDonVanIds.includes(dv.IdDonVan)}
                    onChange={() => handleCheckboxChange(dv.IdDonVan)}
                  />
                </td>
                <td style={styles.td}>{dv.IdDonVan}</td>
                {/* API /api/donvan CẦN 'include' khachHang, DVkho... */}
                <td style={styles.td}>{dv.khachHang?.Hoten || 'N/A'}</td> 
                <td style={styles.td}>{dv.DVkhoBatDau?.TenKhoBai || 'N/A'}</td>
                <td style={styles.td}>{dv.DVkhoKetThuc?.TenKhoBai || 'N/A'}</td>
              </tr>
            ))}
         </tbody>
      </table>

      {/* --- MODAL ĐIỀU PHỐI --- */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title="Gán Tài xế & Phương tiện">
        <p>Bạn đang gán <strong>{selectedDonVanIds.length}</strong> đơn vận.</p>
        <div style={styles.modalForm}>
          
          <label htmlFor="taiXeSelect">Chọn Tài xế (Sẵn sàng tại kho):</label>
          <select 
            id="taiXeSelect"
            value={selectedTaiXeId}
            onChange={(e) => setSelectedTaiXeId(e.target.value)}
            style={{ width: '100%' }}
            disabled={taiXeList.length === 0}
          >
            <option value="">
              {loadingAssets ? "Đang tải..." : taiXeList.length === 0 ? "Không có tài xế nào rảnh" : "-- Chọn tài xế --"}
            </option>
            {taiXeList.map(tx => (
              <option key={tx.IdTaiXe} value={tx.IdTaiXe}>
                {tx.Hoten} (Bằng: {tx.BangLai})
              </option>
            ))}
          </select>

          <label htmlFor="phuongTienSelect">Chọn Phương tiện (Sẵn sàng tại kho):</label>
          <select 
            id="phuongTienSelect"
            value={selectedPhuongTienId}
            onChange={(e) => setSelectedPhuongTienId(e.target.value)}
            style={{ width: '100%' }}
            disabled={phuongTienList.length === 0}
          >
            <option value="">
              {loadingAssets ? "Đang tải..." : phuongTienList.length === 0 ? "Không có xe nào rảnh" : "-- Chọn phương tiện --"}
            </option>
            {phuongTienList.map(pt => (
              <option key={pt.IdPhuongTien} value={pt.IdPhuongTien}>
                {pt.BienSo} (Tải: {pt.TaiTrong}kg)
              </option>
            ))}
          </select>

          <button onClick={handleAssignSubmit} style={styles.modalConfirmButton}>
            Xác nhận Gán
          </button>
        </div>
      </Modal>

    </div>
  );
}

// (styles giữ nguyên)
const styles = {
  filterSection: { marginBottom: '20px', padding: '10px', background: '#f4f4f4', borderRadius: '5px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  th: { background: '#333', color: 'white', padding: '10px', border: '1px solid #ddd', textAlign: 'left' },
  td: { padding: '8px', border: '1px solid #ddd', textAlign: 'left' },
  dispatchButton: { padding: '10px 15px', background: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', disabled: { background: 'grey' } },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: 'white', padding: '20px', borderRadius: '5px', minWidth: '400px', zIndex: 1001 },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '10px' },
  closeButton: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' },
  modalBody: { paddingTop: '10px' },
  modalForm: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' },
  modalConfirmButton: { marginTop: '10px', padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }
};

export default GanDonPage;