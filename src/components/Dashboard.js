import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SiswaService from '../services/SiswaService';
import GuruService from '../services/GuruService';
import MapelService from '../services/MapelService';
import './Dashboard.css';
import ApexCharts from 'apexcharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    siswa: 0,
    guru: 0,
    mapel: 0,
    loading: true,
    error: null
  });
  
  const chartTimelineRef = useRef(null);
  const chartBarRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [siswaRes, guruRes, mapelRes] = await Promise.all([
          SiswaService.getAll(),
          GuruService.getAll(),
          MapelService.getAll()
        ]);

        setStats({
          siswa: siswaRes.data.length,
          guru: guruRes.data.length,
          mapel: mapelRes.data.length,
          loading: false,
          error: null
        });
      } catch (error) {
        setStats({
          ...stats,
          loading: false,
          error: 'Gagal memuat data statistik'
        });
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (!stats.loading && chartTimelineRef.current && chartBarRef.current) {
      // Inisialisasi chart timeline
      const optionsTimeline = {
        chart: {
          type: "bar",
          height: 320,
          stacked: true,
          toolbar: {
            show: false
          },
          sparkline: {},
          backgroundBarRadius: 5,
          offsetX: -10,
        },
        series: [
          {
            name: "Siswa Baru",
            data: [15, 10, 20, 15, 25, 18, 30, 20, 15, 10, 20, 15]
          },
          {
            name: "Siswa Aktif",
            data: [-12, -8, -15, -12, -20, -15, -25, -18, -12, -8, -15, -12]
          }
        ],
        plotOptions: {
          bar: {
            columnWidth: "20%",
            endingShape: "rounded",
            colors: {
              backgroundBarColors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)'],
              backgroundBarOpacity: 1,
              backgroundBarRadius: 5,
              opacity: 0
            },
          },
          distributed: true
        },
        colors: ['#0B2A97', '#FF9432'],
        grid: {
          show: true,
        },
        legend: {
          show: false
        },
        fill: {
          opacity: 1
        },
        dataLabels: {
          enabled: false,
          colors: ['#0B2A97', '#FF9432'],
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 1,
            opacity: 1
          }
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
          labels: {
            style: {
              colors: '#787878',
              fontSize: '13px',
              fontFamily: 'Poppins',
              fontWeight: 400
            },
          },
          axisBorder: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: '#787878',
              fontSize: '13px',
              fontFamily: 'Poppins',
              fontWeight: 400
            },
          },
        },
        tooltip: {
          x: {
            show: true
          }
        }
      };

      // Inisialisasi chart bar
      const optionsBar = {
        series: [{
          name: "Aktivitas",
          type: 'line',
          data: [90, 120, 70, 130, 80, 140, 50]
        }],
        chart: {
          height: 200,
          type: 'area',
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 3,
            color: '#000',
            opacity: 0.1
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [3],
          colors: ['#0b2a97'],
          curve: 'smooth'
        },
        markers: {
          strokeWidth: [3],
          strokeColors: ['#0B2A97'],
          border: 0,
          colors: ['#fff'],
          hover: {
            size: 5,
          }
        },
        xaxis: {
          categories: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
          axisTicks: false,
          labels: {
            style: {
              colors: '#818995',
              fontSize: '12px',
              fontFamily: 'Poppins',
              fontWeight: 50,
            },
          },
        },
        yaxis: {
          labels: {
            offsetX: -16,
            style: {
              colors: '#818995',
              fontSize: '12px',
              fontFamily: 'Poppins',
              fontWeight: 50,
            },
          },
        },
        fill: {
          colors: ['#0b2a97'],
          type: 'solid',
          opacity: 1
        },
        colors: ['#0B2A97'],
        grid: {
          borderColor: 'transparent',
          xaxis: {
            lines: {
              show: true
            }
          }
        }
      };

      // Render chart
      try {
        const chartTimeline = new ApexCharts(chartTimelineRef.current, optionsTimeline);
        chartTimeline.render();

        const chartBar = new ApexCharts(chartBarRef.current, optionsBar);
        chartBar.render();
      } catch (error) {
        console.error("Error rendering charts:", error);
      }
    }
  }, [stats.loading]);

  if (stats.loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Memuat data...</p>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="alert alert-danger">
        {stats.error}
      </div>
    );
  }

  return (
    <>
      {/* Row */}
      <div className="row">
        <div className="col-xl-3 col-xxl-3 col-lg-6 col-md-6 col-sm-6">
          <div className="widget-stat card">
            <div className="card-body p-4">
              <div className="media ai-icon">
                <span className="me-3 bgl-primary text-primary">
                  <i className="flaticon-381-user"></i>
                </span>
                <div className="media-body">
                  <h3 className="mb-0 text-black"><span className="counter ms-0">{stats.siswa}</span></h3>
                  <p className="mb-0">Total Siswa</p>
                  <Link to="/siswa" className="badge badge-primary">Lihat Detail</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-3 col-lg-6 col-md-6 col-sm-6">
          <div className="widget-stat card">
            <div className="card-body p-4">
              <div className="media ai-icon">
                <span className="me-3 bgl-warning text-warning">
                  <i className="flaticon-381-user-7"></i>
                </span>
                <div className="media-body">
                  <h3 className="mb-0 text-black"><span className="counter ms-0">{stats.guru}</span></h3>
                  <p className="mb-0">Total Guru</p>
                  <Link to="/guru" className="badge badge-warning">Lihat Detail</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-3 col-lg-6 col-md-6 col-sm-6">
          <div className="widget-stat card">
            <div className="card-body p-4">
              <div className="media ai-icon">
                <span className="me-3 bgl-success text-success">
                  <i className="flaticon-381-notebook"></i>
                </span>
                <div className="media-body">
                  <h3 className="mb-0 text-black"><span className="counter ms-0">{stats.mapel}</span></h3>
                  <p className="mb-0">Total Mata Pelajaran</p>
                  <Link to="/mapel" className="badge badge-success">Lihat Detail</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-xxl-3 col-lg-6 col-md-6 col-sm-6">
          <div className="widget-stat card">
            <div className="card-body p-4">
              <div className="media ai-icon">
                <span className="me-3 bgl-danger text-danger">
                  <i className="flaticon-381-calendar-1"></i>
                </span>
                <div className="media-body">
                  <h3 className="mb-0 text-black"><span className="counter ms-0">{new Date().getFullYear()}</span></h3>
                  <p className="mb-0">Tahun Ajaran</p>
                  <span className="badge badge-danger">Aktif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row */}
      <div className="row">
        <div className="col-xl-8 col-xxl-8">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Statistik Siswa</h4>
            </div>
            <div className="card-body">
              <div ref={chartTimelineRef} className="chart-timeline"></div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-xxl-4">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Akses Cepat</h4>
            </div>
            <div className="card-body">
              <div className="widget-todo dz-scroll">
                <ul className="timeline">
                  <li>
                    <div className="timeline-badge primary"></div>
                    <Link to="/siswa/create" className="timeline-panel text-muted">
                      <span>Tambah Siswa Baru</span>
                    </Link>
                  </li>
                  <li>
                    <div className="timeline-badge success"></div>
                    <Link to="/guru/create" className="timeline-panel text-muted">
                      <span>Tambah Guru Baru</span>
                    </Link>
                  </li>
                  <li>
                    <div className="timeline-badge warning"></div>
                    <Link to="/mapel/create" className="timeline-panel text-muted">
                      <span>Tambah Mata Pelajaran</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row untuk Chart Bar */}
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Aktivitas Bulanan</h4>
            </div>
            <div className="card-body">
              <div ref={chartBarRef} className="chartBar"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard; 