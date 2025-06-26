import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiswaService from '../../services/SiswaService';
import './Siswa.css';

const SiswaList = () => {
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSiswa();
  }, []);

  const fetchSiswa = async () => {
    try {
      setLoading(true);
      const response = await SiswaService.getAll();
      setSiswa(response.data);
      setError(null);
    } catch (error) {
      setError('Gagal memuat data siswa');
      console.error('Error fetching siswa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
      try {
        await SiswaService.delete(id);
        fetchSiswa(); // Refresh data setelah menghapus
      } catch (error) {
        setError('Gagal menghapus siswa');
        console.error('Error deleting siswa:', error);
      }
    }
  };

  const filteredSiswa = siswa.filter(s => 
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nis.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="siswa-list">
      <div className="list-header">
        <h1>Daftar Siswa</h1>
        <Link to="/siswa/create" className="btn btn-primary">
          <i className="fas fa-plus"></i> Tambah Siswa
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <div className="search-box">
        <input
          type="text"
          placeholder="Cari siswa berdasarkan nama atau NIS..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
      </div>

      {filteredSiswa.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-search"></i>
          <p>Tidak ada siswa yang ditemukan</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>NIS</th>
                <th>Nama</th>
                <th>Jenis Kelamin</th>
                <th>Tanggal Lahir</th>
                <th>Alamat</th>
                <th>No. Telp</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSiswa.map((s) => (
                <tr key={s.id}>
                  <td>{s.nis}</td>
                  <td>{s.nama}</td>
                  <td>{s.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                  <td>{new Date(s.tanggal_lahir).toLocaleDateString('id-ID')}</td>
                  <td>{s.alamat}</td>
                  <td>{s.no_telp}</td>
                  <td>
                    <div className="btn-group">
                      <Link to={`/siswa/${s.id}`} className="btn btn-info btn-sm">
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link to={`/siswa/edit/${s.id}`} className="btn btn-warning btn-sm">
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="btn btn-danger btn-sm"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SiswaList; 