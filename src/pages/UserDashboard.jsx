import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../template/css/style.css';

function UserDashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fungsi untuk menginisialisasi template dan menghapus preloader
  const initializeTemplate = () => {
    // Inisialisasi MetisMenu jika sudah dimuat
    if (window.$ && window.$.fn.metisMenu) {
      window.$('#menu').metisMenu();
    }

    // Tambahkan class show ke main-wrapper
    const mainWrapper = document.getElementById('main-wrapper');
    if (mainWrapper) {
      mainWrapper.classList.add('show');
      mainWrapper.classList.remove('loading');
    }

    // Hapus preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
        document.body.classList.remove('loading');
      }, 300);
    }

    // Aktifkan toggle sidebar
    const navControl = document.querySelector('.nav-control');
    if (navControl) {
      navControl.addEventListener('click', function() {
        const mainWrapper = document.getElementById('main-wrapper');
        if (mainWrapper) {
          mainWrapper.classList.toggle('menu-toggle');
        }
        this.querySelector('.hamburger').classList.toggle('is-active');
      });
    }
  };

  useEffect(() => {
    // Cek jika user sudah login
    const user = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
      
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Jika user adalah admin, redirect ke admin dashboard
    if (user.role === 'admin') {
      navigate('/admin');
      return;
    }
    
    setUserInfo(user);
    
    const fetchUserProfile = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        // Tambahkan timeout untuk menghindari loading terlalu lama
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 detik timeout
        
        try {
          await axios.get('http://localhost:5000/api/users/profile', {
            ...config,
            signal: controller.signal
          });
          clearTimeout(timeoutId);
        } catch (error) {
          if (error.name === 'AbortError') {
            console.log('Request timeout, but continuing anyway');
          } else {
            throw error;
          }
        }
        
        setLoading(false);
        
        // Inisialisasi template setelah loading selesai
        initializeTemplate();
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Jangan logout user jika hanya masalah koneksi ke backend
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('userInfo');
          navigate('/login');
        } else {
          // Jika error lain, tetap tampilkan dashboard
          setLoading(false);
          
          // Inisialisasi template setelah loading selesai
          initializeTemplate();
        }
      }
    };
    
    fetchUserProfile();
    
    // Tambahkan timeout fallback untuk memastikan loading tidak terlalu lama
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
      initializeTemplate();
    }, 3000); // 3 detik maksimum loading
    
    return () => clearTimeout(fallbackTimer);
  }, [navigate]);

  // Tambahkan event listener untuk document ready
  useEffect(() => {
    // Inisialisasi template ketika DOM sudah siap
    if (document.readyState === 'complete') {
      initializeTemplate();
    } else {
      window.addEventListener('load', initializeTemplate);
      return () => window.removeEventListener('load', initializeTemplate);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  if (loading) {
    return (
      <div id="main-wrapper" className="loading">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="main-wrapper" className="show">
      {/* Nav header start */}
      <div className="nav-header">
        <a href="/" className="brand-logo" aria-label="Gymove">
          <img className="logo-abbr" src="/logo-small.png" alt="" />
          <img className="logo-compact" src="/logo-text.png" alt="" />
          <img className="brand-title" src="/logo-text.png" alt="" />
        </a>

        <div className="nav-control">
          <div className="hamburger">
            <span className="line"></span><span className="line"></span><span className="line"></span>
          </div>
        </div>
      </div>
      {/* Nav header end */}

      {/* Header start */}
      <header className="header">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left">
                <div className="dashboard_bar">
                  Dashboard User
                </div>
              </div>
              <ul className="navbar-nav header-right">
                <li className="nav-item dropdown header-profile">
                  <a className="nav-link" href="javascript:void(0)" role="button" data-bs-toggle="dropdown">
                    <img src="/avatar.png" width="20" alt="" />
                    <div className="header-info">
                      <span className="text-black"><strong>{userInfo?.name}</strong></span>
                      <p className="fs-12 mb-0">User</p>
                    </div>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <a href="/profile" className="dropdown-item ai-icon">
                      <svg id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      <span className="ms-2">Profile </span>
                    </a>
                    <a href="#" onClick={handleLogout} className="dropdown-item ai-icon">
                      <svg id="icon-logout" xmlns="http://www.w3.org/2000/svg" className="text-danger" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      <span className="ms-2">Logout </span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
      {/* Header end */}

      {/* Sidebar start */}
      <div className="deznav">
        <div className="deznav-scroll">
          <ul className="metismenu" id="menu">
            <li>
              <a className="has-arrow ai-icon" href="javascript:void(0)" aria-expanded="false">
                <i className="flaticon-381-networking"></i>
                <span className="nav-text">Dashboard</span>
              </a>
              <ul aria-expanded="false">
                <li><a href="/user">Dashboard User</a></li>
                <li><a href="/profile">Profil Saya</a></li>
                <li><a href="/settings">Pengaturan</a></li>
              </ul>
            </li>
            <li>
              <a className="has-arrow ai-icon" href="javascript:void(0)" aria-expanded="false">
                <i className="flaticon-381-television"></i>
                <span className="nav-text">Aplikasi</span>
              </a>
              <ul aria-expanded="false">
                <li><a href="/tasks">Tugas Saya</a></li>
                <li><a href="/messages">Pesan</a></li>
                <li><a href="/calendar">Kalender</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      {/* Sidebar end */}

      {/* Content body start */}
      <div className="content-body default-height">
        {/* row */}
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-6 col-xxl-12">
              <div className="row">
                <div className="col-sm-6">
                  <div className="card avtivity-card">
                    <div className="card-body">
                      <div className="media align-items-center">
                        <span className="activity-icon bgl-success me-md-4 me-3">
                          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip2)">
                            <path d="M14.6406 24.384C14.4639 24.1871 14.421 23.904 14.5305 23.6633C15.9635 20.513 14.4092 18.7501 14.564 11.6323C14.5713 11.2944 14.8346 10.9721 15.2564 10.9801C15.6201 10.987 15.905 11.2962 15.8971 11.6598C15.8902 11.9762 15.8871 12.2939 15.8875 12.6123C15.888 12.9813 16.1893 13.2826 16.5583 13.2776C17.6426 13.2628 19.752 12.9057 20.5684 10.4567L20.9744 9.23876C21.7257 6.9847 20.4421 4.55115 18.1335 3.91572L13.9816 2.77294C12.3274 2.31768 10.5363 2.94145 9.52387 4.32498C4.66826 10.9599 1.44452 18.5903 0.0754914 26.6727C-0.300767 28.8937 0.754757 31.1346 2.70222 32.2488C13.6368 38.5051 26.6023 39.1113 38.35 33.6379C39.3524 33.1709 40.0002 32.1534 40.0002 31.0457V19.1321C40.0002 18.182 39.5322 17.2976 38.7484 16.7664C34.5339 13.91 29.1672 14.2521 25.5723 18.0448C25.2519 18.3828 25.3733 18.937 25.8031 19.1166C27.4271 19.7957 28.9625 20.7823 30.2439 21.9475C30.5225 22.2008 30.542 22.6396 30.2654 22.9155C30.0143 23.1658 29.6117 23.1752 29.3485 22.9376C25.9907 19.9053 21.4511 18.5257 16.935 19.9686C16.658 20.0571 16.4725 20.3193 16.477 20.61C16.496 21.8194 16.294 22.9905 15.7421 24.2172C15.5453 24.6544 14.9607 24.7409 14.6406 24.384Z" fill="#27BC48"/>
                            </g>
                            <defs>
                            <clipPath id="clip2">
                            <rect width="40" height="40" fill="white"/>
                            </clipPath>
                            </defs>
                          </svg>
                        </span>
                        <div className="media-body">
                          <p className="fs-14 mb-2">Tugas Selesai</p>
                          <span className="title text-black font-w600">12</span>
                        </div>
                      </div>
                      <div className="progress" style={{ height: '5px' }}>
                        <div className="progress-bar bg-success" style={{ width: '60%', height: '5px' }} aria-label="Progress-success" role="progressbar">
                          <span className="sr-only">60% Complete</span>
                        </div>
                      </div>
                    </div>
                    <div className="effect bg-success"></div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card avtivity-card">
                    <div className="card-body">
                      <div className="media align-items-center">
                        <span className="activity-icon bgl-secondary me-md-4 me-3">
                          <svg width="40" height="37" viewBox="0 0 40 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.64826 26.5285C0.547125 26.7394 -0.174308 27.8026 0.0366371 28.9038C0.222269 29.8741 1.07449 30.5491 2.02796 30.5491C2.15453 30.5491 2.28531 30.5364 2.41188 30.5112L10.7653 28.908C11.242 28.8152 11.6682 28.5578 11.9719 28.1781L15.558 23.6554L14.3599 23.0437C13.4739 22.5965 12.8579 21.7865 12.6469 20.8035L9.26338 25.0688L1.64826 26.5285Z" fill="#A02CFA"/>
                            <path d="M31.3999 8.89345C33.8558 8.89345 35.8467 6.90258 35.8467 4.44673C35.8467 1.99087 33.8558 0 31.3999 0C28.9441 0 26.9532 1.99087 26.9532 4.44673C26.9532 6.90258 28.9441 8.89345 31.3999 8.89345Z" fill="#A02CFA"/>
                            <path d="M21.6965 3.33297C21.2282 2.85202 20.7937 2.66217 20.3169 2.66217C20.1439 2.66217 19.971 2.68748 19.7853 2.72967L12.1534 4.53958C11.0986 4.78849 10.4489 5.84744 10.6979 6.89795C10.913 7.80079 11.7146 8.40831 12.6048 8.40831C12.7567 8.40831 12.9086 8.39144 13.0605 8.35347L19.5618 6.81357C19.9837 7.28187 22.0974 9.57273 22.4813 9.97775C19.7938 12.855 17.1064 15.7281 14.4189 18.6054C14.3767 18.6519 14.3388 18.6982 14.3008 18.7446C13.5161 19.7445 13.7566 21.3139 14.9379 21.9088L23.1774 26.1151L18.8994 33.0467C18.313 34.0002 18.6083 35.249 19.5618 35.8396C19.8951 36.0464 20.2621 36.1434 20.6249 36.1434C21.3042 36.1434 21.9707 35.8017 22.3547 35.1815L27.7886 26.3766C28.0882 25.8915 28.1683 25.305 28.0122 24.7608C27.8561 24.2123 27.4806 23.7567 26.9702 23.4993L21.3885 20.66L27.2571 14.3823L31.6869 18.1371C32.0539 18.4493 32.5054 18.6012 32.9526 18.6012C33.4335 18.6012 33.9145 18.424 34.2899 18.078L39.3737 13.3402C40.1669 12.6019 40.2133 11.3615 39.475 10.5684C39.0868 10.1549 38.5637 9.944 38.0406 9.944C37.5638 9.944 37.0829 10.117 36.7074 10.4671L32.9019 14.0068C32.8977 14.011 23.363 5.04163 21.6965 3.33297Z" fill="#A02CFA"/>
                          </svg>
                        </span>
                        <div className="media-body">
                          <p className="fs-14 mb-2">Pesan Baru</p>
                          <span className="title text-black font-w600">5</span>
                        </div>
                      </div>
                      <div className="progress" style={{ height: '5px' }}>
                        <div className="progress-bar bg-secondary" style={{ width: '50%', height: '5px' }} aria-label="Progress-secondary" role="progressbar">
                          <span className="sr-only">50% Complete</span>
                        </div>
                      </div>
                    </div>
                    <div className="effect bg-secondary"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Content body end */}

      {/* Footer start */}
      <div className="footer">
        <div className="copyright">
          <p>Copyright © Designed &amp; Developed by <a href="http://dexignzone.com/" target="_blank" rel="noreferrer">DexignZone</a> 2023</p>
        </div>
      </div>
      {/* Footer end */}
    </div>
  );
}

export default UserDashboard; 