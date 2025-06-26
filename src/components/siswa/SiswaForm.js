import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SiswaService from '../../services/SiswaService';
import './Siswa.css';

const SiswaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    nis: '',
    nama: '',
    jenis_kelamin: 'L',
    alamat: '',
    no_telp: '',
    tanggal_lahir: '',
    foto: null
  });
  
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (isEditMode) {
      fetchSiswa();
    }
  }, [id]);
  
  const fetchSiswa = async () => {
    try {
      setLoading(true);
      const response = await SiswaService.get(id);
      const siswa = response.data;
      
      // Format tanggal untuk input date
      const formattedDate = siswa.tanggal_lahir ? 
        new Date(siswa.tanggal_lahir).toISOString().split('T')[0] : '';
      
      setFormData({
        ...siswa,
        tanggal_lahir: formattedDate,
        foto: null // Reset foto karena kita tidak ingin menimpa foto yang ada kecuali user memilih yang baru
      });
      
      if (siswa.foto) {
        setPreview(`http://localhost:8000/storage/siswa/${siswa.foto}`);
      }
    } catch (error) {
      setError('Gagal memuat data siswa');
      console.error('Error fetching siswa:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        foto: file
      });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isEditMode) {
        await SiswaService.update(id, formData);
      } else {
        await SiswaService.create(formData);
      }
      navigate('/siswa');
    } catch (error) {
      setError(
        error.response?.data?.message ||
        `Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} data siswa`
      );
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
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
    <div className="siswa-form">
      <h1>{isEditMode ? 'Edit Siswa' : 'Tambah Siswa Baru'}</h1>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="nis">NIS</label>
                <input
                  type="text"
                  id="nis"
                  name="nis"
                  value={formData.nis}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="nama">Nama Lengkap</label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="jenis_kelamin">Jenis Kelamin</label>
                <select
                  id="jenis_kelamin"
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="tanggal_lahir">Tanggal Lahir</label>
                <input
                  type="date"
                  id="tanggal_lahir"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="alamat">Alamat</label>
                <textarea
                  id="alamat"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="no_telp">Nomor Telepon</label>
                <input
                  type="text"
                  id="no_telp"
                  name="no_telp"
                  value={formData.no_telp}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="foto">Foto</label>
                <input
                  type="file"
                  id="foto"
                  name="foto"
                  onChange={handleFileChange}
                  className="form-control"
                  accept="image/*"
                />
                {preview && (
                  <div className="mt-2">
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '200px' }}
                      className="img-thumbnail"
                    />
                  </div>
                )}
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
              onClick={() => navigate('/siswa')}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiswaForm; 