import React, { useState, useEffect } from "react";
const DashboardPage = () => {
  const [stats, setStats] = useState({ donCho: 0, chuyenChay: 0, taiXeRanh: 0, xeRanh: 0 });
  const [donVanCho, setDonVanCho] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiURL = import.meta.env.VITE_APP_API;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
        if (!token) {
          throw new Error("Chưa đăng nhập");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [statsRes, donVanRes] = await Promise.all([
          fetch(`${apiURL}/api/thongke/dashboard`, { headers }),
          fetch(`${apiURL}/api/donvan?trangthai=ChoXuLy`, { headers }),
        ]);
        console.log(statsRes);
        console.log(donVanRes);

        if (!statsRes.ok || !donVanRes.ok) {
          throw new Error("Lỗi khi tải dữ liệu");
        }

        const statsData = await statsRes.json();
        const donVanData = await donVanRes.json();
        console.log(donVanData);
        setStats(statsData);
        setDonVanCho(donVanData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (loading) {
    return <div className="p-4">Đang tải dữ liệu dashboard...</div>;
  }

  if (error) {
    return <div className="p-4 text-danger">Lỗi: {error}</div>;
  }

  return (
    <div className="">
      <h2>Dashboard</h2>

      <div className="flex row mb-4 ">
        <div className="col">
          <div className="card card-body">
            Đơn chờ xử lý: <strong>{stats.donCho}</strong>
          </div>
        </div>
        <div className="col">
          <div className="card card-body">
            Chuyến đang chạy: <strong>{stats.chuyenChay}</strong>
          </div>
        </div>
        <div className="col">
          <div className="card card-body">
            Tài xế sẵn sàng: <strong>{stats.taiXeRanh}</strong>
          </div>
        </div>
        <div className="col">
          <div className="card card-body">
            Phương tiện sẵn sàng: <strong>{stats.xeRanh}</strong>
          </div>
        </div>
      </div>

      <h3>Đơn vận mới chờ gán</h3>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Mã Đơn Vận</th>
              <th>Khách hàng</th>
              <th>Từ</th>
              <th>Đến</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {donVanCho.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Không có đơn vận nào đang chờ
                </td>
              </tr>
            ) : (
              donVanCho.map((dv) => (
                <tr key={dv.IdDonVan}>
                  {" "}
                  <td>{dv.IdDonVan}</td>
                  <td>{dv.khachHang.Hoten}</td>
                  <td>{dv.DVkhoBatDau.DiaChi}</td>
                  <td>{dv.DVkhoKetThuc.DiaChi}</td>
                  <td>{dv.TrangThai}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
