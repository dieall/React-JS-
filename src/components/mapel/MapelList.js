import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapelService from '../../services/MapelService';
import './Mapel.css';

const MapelList = () => {
  const [mapels, setMapels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Mengambil data mapel saat komponen dimount
  useEffect(() => {
    fetchMapels();
  }, []);

  // Fungsi untuk mengambil data mapel dari API
  const fetchMapels = async () => {
    try {
      setLoading(true);
      const response = await MapelService.getAll();
      setMapels(response.data);
    } catch (error) {
      console.error('Error fetching mapels:', error);
      setError('Gagal memuat data mata pelajaran. Silakan coba lagi nanti.');
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

  // Fungsi untuk menghapus mapel
  const handleDelete = async (id) => {
    try {
      await MapelService.delete(id);
      // Refresh daftar mapel setelah berhasil menghapus
      fetchMapels();
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting mapel:', error);
      setError('Gagal menghapus data mata pelajaran. Mata pelajaran mungkin masih digunakan oleh guru.');
    }
  };

  // Tampilkan loading spinner jika sedang memuat data
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Memuat data mata pelajaran...</p>
      </div>
    );
  }

  return (
    <div className="mapel-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Daftar Mata Pelajaran</h1>
        <Link to="/mapel/create" className="btn btn-primary">
          <i className="fas fa-plus"></i> Tambah Mata Pelajaran
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {mapels.length === 0 ? (
        <div className="alert alert-info">
          Belum ada data mata pelajaran. Silakan tambahkan mata pelajaran baru.
        </div>
      ) : (
        mapels.map((mapel) => (
          <div className="mapel-card" key={mapel.id}>
            <div className="mapel-icon">
              <i className="fas fa-book"></i>
            </div>
            <div className="mapel-info">
              <h3>{mapel.nama_mapel}</h3>
              <p><strong>Kode:</strong> {mapel.kode_mapel}</p>
              <p><strong>SKS:</strong> {mapel.sks}</p>
              <p><strong>Deskripsi:</strong> {mapel.deskripsi || '-'}</p>
            </div>
            <div className="mapel-actions">
              <Link to={`/mapel/${mapel.id}`} className="btn btn-success">
                <i className="fas fa-eye"></i> Detail
              </Link>
              <Link to={`/mapel/edit/${mapel.id}`} className="btn btn-primary">
                <i className="fas fa-edit"></i> Edit
              </Link>
              {confirmDelete === mapel.id ? (
                <>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(mapel.id)}
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
                  onClick={() => handleDeleteConfirm(mapel.id)}
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

export default MapelList; 