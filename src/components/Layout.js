import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './Layout.css';
import ApexCharts from 'apexcharts';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const currentYear = new Date().getFullYear();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    document.body.classList.toggle('menu-toggle');
  };
  
  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };
  
  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'mm-active' : '';
  };
  
  const user = AuthService.getCurrentUser();
  
  useEffect(() => {
    // Menambahkan class untuk preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
    
    // Membuat ApexCharts tersedia secara global
    window.ApexCharts = ApexCharts;
  }, []);

  return (
    <div id="main-wrapper" className={sidebarOpen ? 'show' : 'show menu-toggle'}>
      {/* Preloader */}
      <div id="preloader">
        <div className="sk-three-bounce">
          <div className="sk-child sk-bounce1"></div>
          <div className="sk-child sk-bounce2"></div>
          <div className="sk-child sk-bounce3"></div>
        </div>
      </div>

      {/* Nav header */}
      <div className="nav-header">
        <Link to="/dashboard" className="brand-logo">
          <img className="logo-abbr" src="/assets/images/logo.png" alt="" />
          <img className="logo-compact" src="/assets/images/logo-text.png" alt="" />
          <img className="brand-title" src="/assets/images/logo-text.png" alt="" />
        </Link>

        <div className="nav-control">
          <div className="hamburger" onClick={toggleSidebar}>
            <span className="line"></span><span className="line"></span><span className="line"></span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="header">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left">
                <div className="dashboard_bar">
                  {location.pathname === '/dashboard' ? 'Dashboard' : 
                   location.pathname.startsWith('/siswa') ? 'Siswa' :
                   location.pathname.startsWith('/guru') ? 'Guru' :
                   location.pathname.startsWith('/mapel') ? 'Mata Pelajaran' : ''}
                </div>
              </div>

              <ul className="navbar-nav header-right">
                <li className="nav-item dropdown header-profile">
                  <a className="nav-link" href="#" role="button" data-toggle="dropdown">
                    <div className="header-info">
                      <span className="text-black">{user?.name || 'Admin'}</span>
                      <p className="fs-12 mb-0">Admin</p>
                    </div>
                    <img src="/assets/images/profile/17.jpg" width="20" alt="" />
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    <a href="#" className="dropdown-item ai-icon" onClick={handleLogout}>
                      <svg id="icon-logout" xmlns="http://www.w3.org/2000/svg" className="text-danger" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span className="ml-2">Logout</span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      {/* Sidebar */}
      <div className="deznav">
        <div className="deznav-scroll">
          <ul className="metismenu" id="menu">
            <li className={isActive('/dashboard')}>
              <Link to="/dashboard" className="ai-icon" aria-expanded="false">
                <i className="flaticon-381-networking"></i>
                <span className="nav-text">Dashboard</span>
              </Link>
            </li>
            
            <li className={isActive('/siswa')}>
              <Link to="/siswa" className="ai-icon" aria-expanded="false">
                <i className="flaticon-381-user"></i>
                <span className="nav-text">Siswa</span>
              </Link>
            </li>
            
            <li className={isActive('/guru')}>
              <Link to="/guru" className="ai-icon" aria-expanded="false">
                <i className="flaticon-381-user-7"></i>
                <span className="nav-text">Guru</span>
              </Link>
            </li>
            
            <li className={isActive('/mapel')}>
              <Link to="/mapel" className="ai-icon" aria-expanded="false">
                <i className="flaticon-381-notebook"></i>
                <span className="nav-text">Mata Pelajaran</span>
              </Link>
            </li>
          </ul>
          
          <div className="copyright">
            <p>© {currentYear} Sistem Informasi Pendidikan</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content-body">
        <div className="container-fluid">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="copyright">
          <p>{currentYear} Sistem Informasi Pendidikan</p>
        </div>
      </div>
    </div>
  );
};

export default Layout; 