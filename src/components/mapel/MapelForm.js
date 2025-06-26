import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MapelService from '../../services/MapelService';
import './Mapel.css';

const MapelForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    kode_mapel: '',
    nama_mapel: '',
    deskripsi: '',
    sks: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Mengambil data mapel jika mode edit
  useEffect(() => {
    if (isEditMode) {
      fetchMapel();
    }
  }, [id]);
  
  // Fungsi untuk mengambil data mapel berdasarkan ID
  const fetchMapel = async () => {
    try {
      setLoading(true);
      const response = await MapelService.get(id);
      setFormData(response.data);
    } catch (error) {
      setError('Gagal memuat data mata pelajaran');
      console.error('Error fetching mapel:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handler untuk perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'sks' ? parseInt(value) : value
    });
  };
  
  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Jika mode edit, panggil API update, jika tidak panggil API create
      if (isEditMode) {
        await MapelService.update(id, formData);
      } else {
        await MapelService.create(formData);
      }
      navigate('/mapel'); // Redirect ke halaman daftar mapel setelah berhasil
    } catch (error) {
      setError(
        error.response?.data?.message ||
        `Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} data mata pelajaran`
      );
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Tampilkan loading spinner jika sedang memuat data
  if (loading && isEditMode) {
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
    <div className="mapel-form">
      <h1>{isEditMode ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}</h1>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="kode_mapel">Kode Mata Pelajaran</label>
                <input
                  type="text"
                  id="kode_mapel"
                  name="kode_mapel"
                  value={formData.kode_mapel}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="nama_mapel">Nama Mata Pelajaran</label>
                <input
                  type="text"
                  id="nama_mapel"
                  name="nama_mapel"
                  value={formData.nama_mapel}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="deskripsi">Deskripsi</label>
                <textarea
                  id="deskripsi"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="sks">SKS</label>
                <input
                  type="number"
                  id="sks"
                  name="sks"
                  value={formData.sks}
                  onChange={handleChange}
                  className="form-control"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-group mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              type="button"
              className="btn btn-secondary ml-2"
              onClick={() => navigate('/mapel')}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MapelForm; 