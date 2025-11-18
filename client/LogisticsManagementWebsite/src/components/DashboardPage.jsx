import React, { useState, useEffect } from 'react'; // 1. Import hooks

const DashboardPage = () => {
  // 2. Tạo state để lưu trữ dữ liệu
  // Khởi tạo là rỗng, chờ API trả về
  const [stats, setStats] = useState({ donCho: 0, chuyenChay: 0, taiXeRanh: 0, xeRanh: 0 });
  const [donVanCho, setDonVanCho] = useState([]);
  
  // Thêm state để xử lý trạng thái loading và lỗi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiURL = import.meta.env.VITE_APP_API;
  // 3. Dùng useEffect để gọi API khi component được tải (chỉ 1 lần)
  useEffect(() => {
    // Định nghĩa một hàm async bên trong để có thể dùng await
    const fetchData = async () => {
      try {
        // 4. Lấy token JWT từ localStorage (hoặc nơi bạn lưu)
        const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken'); // Hoặc 'token'
        if (!token) {
          throw new Error('Chưa đăng nhập');
        }
        
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // 5. Gọi các API - (NHỚ THAY THẾ URL NÀY)
        // Dùng Promise.all để gọi nhiều API cùng lúc cho hiệu quả
        const [statsRes, donVanRes] = await Promise.all([
          // Ví dụ API lấy thẻ thống kê
        fetch(`${apiURL}/api/thongke/dashboard`, { headers }),
          // Ví dụ API lấy đơn vận chờ
          fetch(`${apiURL}/api/donvan?trangthai=ChoXuLy`, { headers })
        ]);
        console.log(statsRes );
        console.log(donVanRes);
        

        if (!statsRes.ok || !donVanRes.ok) {
          throw new Error('Lỗi khi tải dữ liệu');
        }

        // Lấy dữ liệu JSON
        const statsData = await statsRes.json();
        const donVanData = await donVanRes.json();
        console.log(donVanData);
        // 6. Cập nhật state với dữ liệu thật
        setStats(statsData);
        setDonVanCho(donVanData);

      } catch (err) {
        setError(err.message);
      } finally {
        // Dù thành công hay thất bại, cũng dừng loading
        setLoading(false);
      }
    };

    fetchData(); // Chạy hàm
  }, []); // Mảng rỗng [] nghĩa là "chỉ chạy 1 lần khi component mount"

  // 7. Xử lý trạng thái Loading và Error
  if (loading) {
    return <div className="p-4">Đang tải dữ liệu dashboard...</div>;
  }

  if (error) {
    return <div className="p-4 text-danger">Lỗi: {error}</div>;
  }

  // 8. Hiển thị dữ liệu từ STATE (không còn dữ liệu giả)
  return (
    <div className="">
      <h2>Dashboard</h2>
      
      <div className="flex row mb-4 ">
        <div className="col">
          {/* Dùng dữ liệu từ state */}
          <div className="card card-body">Đơn chờ xử lý: <strong>{stats.donCho}</strong></div>
        </div>
        <div className="col">
          <div className="card card-body">Chuyến đang chạy: <strong>{stats.chuyenChay}</strong></div>
        </div>
        <div className="col">
          <div className="card card-body">Tài xế sẵn sàng: <strong>{stats.taiXeRanh}</strong></div>
        </div>
        <div className="col">
          <div className="card card-body">Phương tiện sẵn sàng: <strong>{stats.xeRanh}</strong></div>
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
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {/* Kiểm tra nếu không có đơn nào */}
            {donVanCho.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">Không có đơn vận nào đang chờ</td>
              </tr>
            ) : (
              // Map qua mảng 'donVanCho' từ state
              donVanCho.map((dv) => (
                <tr key={dv.IdDonVan}> {/* Thay 'id' bằng key thật, ví dụ 'IdDonVan' */}
                  <td>{dv.IdDonVan}</td> {/* Thay 'id' bằng key thật, ví dụ 'MaDonVan' */}
                  <td>{dv.khachHang.Hoten}</td> {/* Ví dụ nếu dữ liệu trả về là object lồng nhau */}
                  <td>{dv.DVkhoBatDau.DiaChi}</td> {/* Ví dụ */}
                  <td>{dv.DVkhoKetThuc.DiaChi}</td> {/* Ví dụ */}
                  <td>
                    <button className="btn btn-primary btn-sm">
                      Gán chuyến
                    </button>
                  </td>
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