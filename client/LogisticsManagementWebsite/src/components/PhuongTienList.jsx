import React, { useState, useEffect } from "react";

function PhuongTienList() {
  const [PhuongTien, SetPhuongTien] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPhuongTien = async () => {
    try {
      setLoading(true);
      const response = await fetch("/phuongtien");
      if (!response.ok) {
        throw new Error("Faild to fetch");
      }
      const data = await response.json();
      SetPhuongTien(data);
    } catch (error) {
      console.log("ERROR: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhuongTien();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa ?")) {
      try {
        await fetch(`/phuongtien/${id}`, { method: "DELETE" });
      } catch (error) {
        console.log("Error deleting:", error);
      }
    }
  };

  if (loading) {
    return <p>Loading PhuongTien ....</p>;
  }

  return (
    <div>
      <h3>Danh sách phương tiện</h3>
      <table>
        <thead>
          <tr>
            <th>Biển số </th>
            <th>Loại xe</th>
            <th>Tải Trọng </th>
            <th>Trọng Tải </th>
          </tr>
        </thead>
        <tbody>
          {PhuongTien.map((PT) => (
            <tr key={PT.id}>
              <td> {PT.BienSo}</td>
              <td>{PT.Loai}</td>
              <td>{PT.TaiTrong} kg</td>
              <td>{PT.TrongTai} kg</td>
              <td>
                <button> Sửa</button> // LINK TO EDIT
                <button onClick={() => handleDelete(PT.id)}> Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PhuongTienList;
