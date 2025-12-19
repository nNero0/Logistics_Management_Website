import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapController = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !bounds) return;
    try {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    } catch (e) {
      console.warn(e);
    }
  }, [bounds, map]);
  return null;
};

const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
};

function KhoBaiForm() {
  const [DiaChi, setDiaChi] = useState("");
  const [SucChuaTong, setSucChuaTong] = useState(0);
  const [TrangThai, setTrangThai] = useState("Có sẵn");
  const [LoaiKho, setLoaiKho] = useState("Lưu trữ");

  const [mapBounds, setMapBounds] = useState(null);
  const [markerPosition, setMarkerPosition] = useState([10.762622, 106.660172]);

  const [KhoBaiList, setKhoBaiList] = useState([]);
  const [loadingKB, setLoadingKB] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const apiURL = import.meta.env.VITE_APP_API;
  const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  const handleSearchMap = async () => {
    if (!DiaChi.trim()) return alert("Nhập địa chỉ!");
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(DiaChi)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        if (Number.isFinite(lat)) setMarkerPosition([lat, lon]);

        const bbox = result.boundingbox;
        if (bbox && bbox.length === 4) {
          const southWest = [parseFloat(bbox[0]), parseFloat(bbox[2])];
          const northEast = [parseFloat(bbox[1]), parseFloat(bbox[3])];
          setMapBounds([southWest, northEast]);
        }
      } else {
        alert("Không tìm thấy!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchKhoBai = async () => {
    setLoadingKB(true);
    try {
      const res = await fetch(`${apiURL}/api/khobai`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setKhoBaiList(await res.json());
    } catch (e) {
    } finally {
      setLoadingKB(false);
    }
  };
  useEffect(() => {
    fetchKhoBai();
  }, []);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    const lat = Number.isFinite(markerPosition[0]) ? markerPosition[0] : 0;
    const lng = Number.isFinite(markerPosition[1]) ? markerPosition[1] : 0;
    try {
      const res = await fetch(`${apiURL}/api/khobai/createkhobai`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ DiaChi, SucChuaTong: Number(SucChuaTong), TrangThai, LoaiKho, ViDo: lat, KinhDo: lng }),
      });
      if (res.ok) {
        alert("Thành công!");
        fetchKhoBai();
      }
    } catch (e) {
      alert("Lỗi lưu.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa?")) {
      await fetch(`${apiURL}/api/khobai/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchKhoBai();
    }
  };

  return (
    <div className="d-flex gap-4">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossorigin=""
      />

      <form onSubmit={HandleSubmit} className="p-4 border rounded bg-light flex-grow-1">
        <h3 className="mb-4">Thêm Kho Bãi</h3>

        <div
          className="mb-3 border rounded"
          style={{ height: "400px", width: "100%", position: "relative", zIndex: 0 }}
        >
          <MapContainer center={[10.762622, 106.660172]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            <MapResizer />
            <Marker position={markerPosition}>
              <Popup>{DiaChi || "Vị trí chọn"}</Popup>
            </Marker>
            <MapController bounds={mapBounds} />
          </MapContainer>
        </div>

        <div className="input-group mb-3">
          <input
            className="form-control"
            placeholder="Nhập địa chỉ..."
            value={DiaChi}
            onChange={(e) => setDiaChi(e.target.value)}
          />
          <button type="button" className="btn btn-primary" onClick={handleSearchMap} disabled={isSearching}>
            {isSearching ? "..." : "📍 Tìm"}
          </button>
        </div>

        <div className="row mb-3">
          <div className="col">
            <input
              type="number"
              className="form-control"
              value={SucChuaTong}
              onChange={(e) => setSucChuaTong(e.target.value)}
              placeholder="Sức chứa"
            />
          </div>
          <div className="col">
            <select className="form-select" value={TrangThai} onChange={(e) => setTrangThai(e.target.value)}>
              <option>Có sẵn</option>
              <option>Gần đầy</option>
              <option>Đầy</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <select className="form-select" value={LoaiKho} onChange={(e) => setLoaiKho(e.target.value)}>
            <option>Lưu trữ</option>
            <option>Điểm Trung Chuyển</option>
            <option>Điểm Giao Hàng</option>
          </select>
        </div>
        <button className="btn btn-success w-100">Lưu</button>
      </form>

      <div
        className="border rounded p-3 bg-white"
        style={{ width: "350px", height: "90vh", overflowY: "auto", position: "sticky", top: "10px" }}
      >
        <h5>Danh sách ({KhoBaiList.length})</h5>
        <input
          className="form-control mb-2"
          placeholder="Lọc..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="list-group">
          {KhoBaiList.filter((k) => k.DiaChi.toLowerCase().includes(searchTerm.toLowerCase())).map((kb) => (
            <li key={kb.id || kb.IdKhoBai} className="list-group-item d-flex justify-content-between">
              <small>{kb.DiaChi}</small>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(kb.id || kb.IdKhoBai)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default KhoBaiForm;
