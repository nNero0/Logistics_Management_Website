import React, { useState, useEffect, useMemo } from "react";

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h4>{title}</h4>
          <button onClick={onClose} style={styles.closeButton}>
            &times;
          </button>
        </div>
        <div style={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
};

function GanDonPage() {
  const [loTrinhList, setLoTrinhList] = useState([]);
  const [taiXeList, setTaiXeList] = useState([]);
  const [phuongTienList, setPhuongTienList] = useState([]);
  const [DonVanList, setDonVanList] = useState([]);

  const [filterLoTrinhId, setFilterLoTrinhId] = useState("");
  const [selectedDonVanIds, setSelectedDonVanIds] = useState([]);
  const [selectedTaiXeId, setSelectedTaiXeId] = useState("");
  const [selectedPhuongTienId, setSelectedPhuongTienId] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [error, setError] = useState(null);

  const apiURL = import.meta.env.VITE_APP_API;
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  useEffect(() => {
    const fetchLoTrinh = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(`${apiURL}/api/lotrinh`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Lỗi tải lộ trình");
        setLoTrinhList(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLoTrinh();
  }, [apiURL, token]);

  useEffect(() => {
    if (!filterLoTrinhId) {
      setDonVanList([]);
      setTaiXeList([]);
      setPhuongTienList([]);
      return;
    }

    const selectedLoTrinh = loTrinhList.find((lt) => lt.IdLoTrinh === Number(filterLoTrinhId));
    if (!selectedLoTrinh?.IdKhoBaiBatDau) return;

    const fetchAssets = async () => {
      setLoadingAssets(true);
      setError(null);
      try {
        const params = { khoBatDauId: selectedLoTrinh.IdKhoBaiBatDau, khoKetThucId: selectedLoTrinh.IdKhoBaiKetThuc };
        const assetParams = { trangThai: "SanSang", viTriId: selectedLoTrinh.IdKhoBaiBatDau };

        const [dvRes, txRes, ptRes] = await Promise.all([
          fetch(`${apiURL}/api/donvan?trangThai=ChoXuLy&${new URLSearchParams(params)}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${apiURL}/api/taixe?${new URLSearchParams(assetParams)}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${apiURL}/api/phuongtien?${new URLSearchParams(assetParams)}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!dvRes.ok || !txRes.ok || !ptRes.ok) throw new Error("Lỗi tải dữ liệu");

        setDonVanList(await dvRes.json());
        setTaiXeList(await txRes.json());
        setPhuongTienList(await ptRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingAssets(false);
      }
    };
    fetchAssets();
  }, [filterLoTrinhId, loTrinhList, apiURL, token]);

  const handleCheckboxChange = (id) => {
    setSelectedDonVanIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectedOrders = useMemo(
    () => DonVanList.filter((dv) => selectedDonVanIds.includes(dv.IdDonVan)),
    [DonVanList, selectedDonVanIds]
  );

  const allSelectedGoods = useMemo(() => selectedOrders.flatMap((o) => o.hangHoas || []), [selectedOrders]);

  const currentTotalWeight = useMemo(
    () => allSelectedGoods.reduce((acc, h) => acc + (Number(h.CanNang) || 0), 0),
    [allSelectedGoods]
  );

  const currentTotalVolume = useMemo(
    () =>
      allSelectedGoods.reduce((acc, h) => {
        const vol = (Number(h.ChieuDai) || 0) * (Number(h.ChieuRong) || 0) * (Number(h.ChieuCao) || 0);
        return acc + vol;
      }, 0),
    [allSelectedGoods]
  );

  const maxDimensions = useMemo(() => {
    return allSelectedGoods.reduce(
      (max, h) => ({
        l: Math.max(max.l, Number(h.ChieuDai) || 0),
        w: Math.max(max.w, Number(h.ChieuRong) || 0),
        h: Math.max(max.h, Number(h.ChieuCao) || 0),
      }),
      { l: 0, w: 0, h: 0 }
    );
  }, [allSelectedGoods]);

  const doesRequireContainer = useMemo(
    () =>
      selectedOrders.some((o) => o.YeuCauContainer === true || o.YeuCauContainer === 1 || o.YeuCauContainer === "1"),
    [selectedOrders]
  );

  const eligibleDrivers = useMemo(() => {
    return taiXeList.filter((tx) => {
      if (doesRequireContainer) return ["C", "FC"].includes(tx.BangLai);
      return true;
    });
  }, [taiXeList, doesRequireContainer]);

  const selectedDriverInfo = taiXeList.find((tx) => tx.IdTaiXe.toString() === selectedTaiXeId);
  const driverLicense = selectedDriverInfo?.BangLai || "";

  const eligibleVehicles = useMemo(() => {
    if (!selectedTaiXeId) return [];

    console.log("--- BẮT ĐẦU LỌC XE ---");
    console.log("Tổng hàng:", { weight: currentTotalWeight, vol: currentTotalVolume, dim: maxDimensions });
    console.log("Yêu cầu Container:", doesRequireContainer);

    return phuongTienList.filter((pt) => {
      const cap = Number(pt.TrongTai);

      const type = (pt.Loai || "").toLowerCase();
      const isContainerType = type.includes("xe container") || type.includes("container") || type.includes("đầu kéo");

      const vL = Number(pt.CDaiThungChua) || 0;
      const vW = Number(pt.CRongThungChua) || 0;
      const vH = Number(pt.CCaoThungChua) || 0;
      const vehicleVolume = vL * vW * vH;

      const debugTag = `[${pt.BienSo} - ${type}]`;

      if (doesRequireContainer) {
        if (!isContainerType) {
          return false;
        }
      } else {
        if (isContainerType) {
          console.log(debugTag, "BỊ LOẠI: Đơn thường không dùng xe Container");
          return false;
        }
      }

      if (driverLicense === "B2" && cap > 3500) {
        console.log(debugTag, "BỊ LOẠI: Bằng B2 không lái được xe > 3.5 tấn");
        return false;
      }

      if (cap < currentTotalWeight) {
        console.log(debugTag, `BỊ LOẠI: Quá tải (${cap} < ${currentTotalWeight})`);
        return false;
      }

      if (vehicleVolume <= 0) {
        console.log(debugTag, "BỊ LOẠI: Thể tích thùng xe = 0 hoặc thiếu dữ liệu kích thước");
        return false;
      }

      if (vL < maxDimensions.l || vW < maxDimensions.w || vH < maxDimensions.h) {
        console.log(debugTag, `BỊ LOẠI: Kích thước không vừa!`);
        console.log(`   Xe: [${vL} x ${vW} x ${vH}]`);
        console.log(`   Hàng Max: [${maxDimensions.l} x ${maxDimensions.w} x ${maxDimensions.h}]`);
        console.log(`   --> Gợi ý: Kiểm tra đơn vị đo (Mét vs Cm)?`);
        return false;
      }

      console.log(debugTag, ">>> CHẤP NHẬN <<<");
      return true;
    });
  }, [
    phuongTienList,
    selectedTaiXeId,
    doesRequireContainer,
    driverLicense,
    currentTotalWeight,
    currentTotalVolume,
    maxDimensions,
  ]);

  const handleAssignSubmit = async () => {
    if (!selectedTaiXeId || !selectedPhuongTienId) return alert("Thiếu Tài xế hoặc Phương tiện!");

    try {
      const res = await fetch(`${apiURL}/api/dieuphoi/gandon`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          DonVanIds: selectedDonVanIds,
          taiXeId: Number(selectedTaiXeId),
          phuongTienId: Number(selectedPhuongTienId),
          IdLoTrinh: Number(filterLoTrinhId),
        }),
      });

      if (!res.ok) throw new Error((await res.json()).message || "Gán thất bại");

      alert("Gán thành công!");
      setShowModal(false);
      setDonVanList((prev) => prev.filter((dv) => !selectedDonVanIds.includes(dv.IdDonVan)));
      setSelectedDonVanIds([]);
      setSelectedTaiXeId("");
      setSelectedPhuongTienId("");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  console.log("Dữ liệu Đơn vận:", DonVanList);
  if (DonVanList.length > 0 && DonVanList[0].hangHoas) {
    console.log("Soi hàng hóa đầu tiên:", DonVanList[0].hangHoas[0]);
  }
  return (
    <div>
      <h2> Trang Điều Phối</h2>

      <div style={styles.filterSection}>
        <label>Lộ Trình: </label>
        <select value={filterLoTrinhId} onChange={(e) => setFilterLoTrinhId(e.target.value)}>
          <option value="">-- Chọn lộ trình --</option>
          {loTrinhList.map((lt) => (
            <option key={lt.IdLoTrinh} value={lt.IdLoTrinh}>
              {lt.TenLoTrinh}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => setShowModal(true)}
        disabled={selectedDonVanIds.length === 0}
        style={styles.dispatchButton}
      >
        Điều phối ({selectedDonVanIds.length})
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Chọn</th>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Yêu Cầu</th>
            <th style={styles.th}>Khách Hàng</th>
            <th style={styles.th}>Chi tiết Hàng Hóa</th>
          </tr>
        </thead>
        <tbody>
          {DonVanList.map((dv) => (
            <tr key={dv.IdDonVan}>
              <td style={styles.td}>
                <input
                  type="checkbox"
                  checked={selectedDonVanIds.includes(dv.IdDonVan)}
                  onChange={() => handleCheckboxChange(dv.IdDonVan)}
                />
              </td>
              <td style={styles.td}>{dv.IdDonVan}</td>
              <td style={styles.td}>
                {dv.YeuCauContainer === true || dv.YeuCauContainer === 1 ? (
                  <span style={{ color: "red", fontWeight: "bold" }}>Container</span>
                ) : (
                  "Thường"
                )}
              </td>
              <td style={styles.td}>{dv.khachHang?.Hoten}</td>
              <td style={styles.td}>
                {dv.hangHoas && dv.hangHoas.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px" }}>
                    {dv.hangHoas.map((hh, idx) => (
                      <li key={idx}>
                        <strong>{hh.NoiDung}</strong> - {hh.CanNang}kg <br />
                        <span style={{ color: "#666" }}>
                          [{hh.ChieuDai} x {hh.ChieuRong} x {hh.ChieuCao}]
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>Không có hàng</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onClose={() => setShowModal(false)} title="Gán">
        <div style={{ background: "#f8f9fa", padding: "10px", marginBottom: "15px", borderRadius: "4px" }}>
          <p>
            <strong>Tổng khối lượng:</strong> {currentTotalWeight} kg
          </p>
          <p>
            <strong>Tổng thể tích:</strong> {currentTotalVolume.toLocaleString()} ĐVTT³
          </p>{" "}
          <p>
            <strong>Loại hình:</strong>{" "}
            {doesRequireContainer ? (
              <span style={{ color: "red" }}>Container (Yêu cầu bằng C/FC)</span>
            ) : (
              <span style={{ color: "green" }}>Xe tải thường</span>
            )}
          </p>
        </div>

        <div style={styles.modalForm}>
          <label>Chọn Tài xế ({eligibleDrivers.length} sẵn sàng):</label>
          <select
            value={selectedTaiXeId}
            onChange={(e) => {
              setSelectedTaiXeId(e.target.value);
              setSelectedPhuongTienId("");
            }}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">-- Chọn tài xế --</option>
            {eligibleDrivers.map((tx) => (
              <option key={tx.IdTaiXe} value={tx.IdTaiXe}>
                {tx.Hoten} ({tx.BangLai})
              </option>
            ))}
          </select>
          {doesRequireContainer && eligibleDrivers.length === 0 && (
            <small style={{ color: "red" }}>Không có tài xế bằng C/FC!</small>
          )}

          <label style={{ marginTop: "10px", display: "block" }}>
            Chọn Phương tiện ({eligibleVehicles.length} phù hợp):
          </label>
          <select
            value={selectedPhuongTienId}
            onChange={(e) => setSelectedPhuongTienId(e.target.value)}
            disabled={!selectedTaiXeId}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">{!selectedTaiXeId ? "-- Chọn Tài xế trước --" : "-- Chọn xe --"}</option>
            {eligibleVehicles.map((pt) => (
              <option key={pt.IdPhuongTien} value={pt.IdPhuongTien}>
                {pt.BienSo} - {pt.Loai} (Tải: {pt.TrongTai}kg) | Thùng: [{pt.CDaiThungChua}x{pt.CRongThungChua}x
                {pt.CCaoThungChua}]
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

const styles = {
  filterSection: { marginBottom: "20px", padding: "15px", background: "#f4f4f4", borderRadius: "8px" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "15px" },
  th: { background: "#333", color: "white", padding: "10px", textAlign: "left" },
  td: { padding: "8px", borderBottom: "1px solid #ddd", verticalAlign: "top" },
  dispatchButton: {
    padding: "10px 20px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    minWidth: "500px",
    maxWidth: "90%",
    zIndex: 1001,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  closeButton: { background: "none", border: "none", fontSize: "24px", cursor: "pointer" },
  modalBody: { display: "flex", flexDirection: "column" },
  modalForm: { display: "flex", flexDirection: "column", gap: "10px" },
  modalConfirmButton: {
    marginTop: "20px",
    padding: "12px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default GanDonPage;
