import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SiswaService from '../../services/SiswaService';
import './Siswa.css';

const SiswaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [siswa, setSiswa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSiswa();
  }, [id]);

  const fetchSiswa = async () => {
    try {
      setLoading(true);
      const response = await SiswaService.get(id);
      setSiswa(response.data);
    } catch (error) {
      setError('Gagal memuat data siswa');
      console.error('Error fetching siswa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
      try {
        await SiswaService.delete(id);
        navigate('/siswa');
      } catch (error) {
        setError('Gagal menghapus siswa');
        console.error('Error deleting siswa:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Memuat data siswa...</p>
      </div>
    );
  }

  if (error || !siswa) {
    return (
      <div className="alert alert-danger">
        {error || 'Siswa tidak ditemukan'}
      </div>
    );
  }

  return (
    <div className="siswa-detail">
      <div className="detail-header">
        <h1>Detail Siswa</h1>
        <div className="action-buttons">
          <Link to={`/siswa/edit/${id}`} className="btn btn-warning">
            <i className="fas fa-edit"></i> Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger ml-2">
            <i className="fas fa-trash"></i> Hapus
          </button>
          <Link to="/siswa" className="btn btn-secondary ml-2">
            <i className="fas fa-arrow-left"></i> Kembali
          </Link>
        </div>
      </div>

      <div className="detail-container">
        <div className="detail-card">
          <div className="detail-row">
            <div className="detail-photo">
              {siswa.foto ? (
                <img
                  src={`http://localhost:8000/storage/siswa/${siswa.foto}`}
                  alt={siswa.nama}
                  className="profile-image"
                />
              ) : (
                <div className="profile-placeholder">
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>

            <div className="detail-info">
              <h2>{siswa.nama}</h2>
              <p className="text-muted">NIS: {siswa.nis}</p>

              <div className="info-section">
                <div className="info-item">
                  <span className="info-label">Jenis Kelamin</span>
                  <span className="info-value">
                    {siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">Tanggal Lahir</span>
                  <span className="info-value">
                    {new Date(siswa.tanggal_lahir).toLocaleDateString('id-ID')}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">Alamat</span>
                  <span className="info-value">{siswa.alamat}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Nomor Telepon</span>
                  <span className="info-value">{siswa.no_telp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiswaDetail; 