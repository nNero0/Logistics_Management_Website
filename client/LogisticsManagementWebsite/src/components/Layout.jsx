import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const LayoutStyle = {
  dislay: 'flex',

  height: '100vh'
}

const SidebarStyle = {
  width: '250px',
  background: 'black',
  color: 'white',
  padding: '20px'
}

const NavLinkStyle = {
  display: 'block',
  color: 'white',
  textDecoration: 'none',
  marginBottom: '15px',
  fontSize: '1.5em'
}

const ContentStyle = {
  flex: 1,
  padding: '20px',
  overflowY: 'auto'
}

function Layout() {
  return (
    <div style={LayoutStyle}>
      This yo sidebar
      <nav style={SidebarStyle}>
        <h2>Quản lý Logistics </h2>
        <Link to='/' style={NavLinkStyle}>
          Dashboard
        </Link>
        <h4>Phương Tiện</h4>
        <Link to='/phuongtien' style={NavLinkStyle}>
          &raquo; Danh sách phương tiện{' '}
        </Link>
        <Link to='/phuongtien/new ' style={NavLinkStyle}>
          &raquo; Thêm phương tiện {' '}
          
        </Link>
           <h4>Tài Xế</h4>
        <Link to='/taixe' style={NavLinkStyle}>
          &raquo; Danh sách tài xế{' '}
        </Link>
        <Link to='/taixe/new ' style={NavLinkStyle}>
          &raquo; Thêm tài xế{' '}
        </Link>
      </nav>
    This yo main conter
        <main style={ContentStyle} >
            <Outlet/>
             </main>

    </div>
  )
}

export default Layout
