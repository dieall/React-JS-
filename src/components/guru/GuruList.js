import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GuruService from '../../services/GuruService';
import './Guru.css';

const GuruList = () => {
  const [gurus, setGurus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Mengambil data guru saat komponen dimount
  useEffect(() => {
    fetchGurus();
  }, []);

  // Fungsi untuk mengambil data guru dari API
  const fetchGurus = async () => {
    try {
      setLoading(true);
      const response = await GuruService.getAll();
      setGurus(response.data);
    } catch (error) {
      console.error('Error fetching gurus:', error);
      setError('Gagal memuat data guru. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menampilkan konfirmasi hapus
  const handleDeleteConfirm = (id) => {
    setConfirmDelete(id);
  };

  // Fungsi untuk membatalkan hapus
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // Fungsi untuk menghapus guru
  const handleDelete = async (id) => {
    try {
      await GuruService.delete(id);
      // Refresh daftar guru setelah berhasil menghapus
      fetchGurus();
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting guru:', error);
      setError('Gagal menghapus data guru.');
    }
  };

  // Tampilkan loading spinner jika sedang memuat data
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Memuat data guru...</p>
      </div>
    );
  }

  return (
    <div className="guru-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Daftar Guru</h1>
        <Link to="/guru/create" className="btn btn-primary">
          <i className="fas fa-plus"></i> Tambah Guru
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {gurus.length === 0 ? (
        <div className="alert alert-info">
          Belum ada data guru. Silakan tambahkan guru baru.
        </div>
      ) : (
        gurus.map((guru) => (
          <div className="guru-card" key={guru.id}>
            <div className="guru-photo-container">
              {guru.foto ? (
                <img
                  src={`http://localhost:8000/storage/guru/${guru.foto}`}
                  alt={guru.nama}
                  className="guru-photo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/80?text=Guru';
                  }}
                />
              ) : (
                <div className="guru-photo-placeholder">
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>
            <div className="guru-info">
              <h3>{guru.nama}</h3>
              <p><strong>NIP:</strong> {guru.nip}</p>
              <p><strong>Mata Pelajaran:</strong> {guru.mapel ? guru.mapel.nama_mapel : '-'}</p>
              <p><strong>No. Telepon:</strong> {guru.no_telp}</p>
            </div>
            <div className="guru-actions">
              <Link to={`/guru/${guru.id}`} className="btn btn-success">
                <i className="fas fa-eye"></i> Detail
              </Link>
              <Link to={`/guru/edit/${guru.id}`} className="btn btn-primary">
                <i className="fas fa-edit"></i> Edit
              </Link>
              {confirmDelete === guru.id ? (
                <>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(guru.id)}
                  >
                    <i className="fas fa-check"></i> Ya
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelDelete}
                  >
                    <i className="fas fa-times"></i> Tidak
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteConfirm(guru.id)}
                >
                  <i className="fas fa-trash"></i> Hapus
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GuruList; 