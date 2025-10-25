import React, { useState } from 'react';

// This component receives a function 'onAddItem' from its parent
function HangHoaItemForm({ onAddItem }) {
  // State for a SINGLE item
  const [NoiDung, setNoiDung] = useState('');
  const [CanNang, setCanNang] = useState(0);
  const [ChieuDai, setChieuDai] = useState(0);
  const [ChieuRong, setChieuRong] = useState(0);
  const [ChieuCao, setChieuCao] = useState(0);
  const [XuatXu, setXuatXu] = useState('VN');
  const [GhiChu, setGhiChu] = useState('');

  // This is a LOCAL submit. It does NOT call the API.
  const handleLocalSubmit = (e) => {
    e.preventDefault();
    
    // 1. Create the new item object
    const newItem = {
      NoiDung,
      CanNang: parseFloat(CanNang),
      ChieuDai: parseFloat(ChieuDai),
      ChieuRong: parseFloat(ChieuRong),
      ChieuCao: parseFloat(ChieuCao),
      XuatXu,
      GhiChu,
    };
    
    // 2. Pass this object UP to the parent component
    onAddItem(newItem);

    // 3. Reset the form for the next item
    setNoiDung('');
    setCanNang(0);
    // ... reset other fields
  };

  return (
    <form onSubmit={handleLocalSubmit} className="hang-hoa-item-form">
      <h4>Thêm Hàng Hoá</h4>
      {/* ... all your input fields ... */}
      <div>
        <label>Nội Dung</label>
        <input type="text" value={NoiDung} onChange={(e) => setNoiDung(e.target.value)} required />
      </div>
      <div>
        <label>Cân Nặng (kg)</label>
        <input type="number" value={CanNang} onChange={(e) => setCanNang(e.target.value)} required />
      </div>
      {/* ... other inputs for ChieuDai, ChieuRong, etc... */}
      
      <button type="submit">+ Thêm Hàng vào Đơn</button>
    </form>
  );
}

export default HangHoaItemForm;