import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GuruService from '../../services/GuruService';
import MapelService from '../../services/MapelService';
import './Guru.css';

const GuruForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    nip: '',
    nama: '',
    jenis_kelamin: 'L',
    alamat: '',
    no_telp: '',
    tanggal_lahir: '',
    mapel_id: '',
    foto: null
  });
  
  const [mapelList, setMapelList] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Mengambil data guru jika mode edit
  useEffect(() => {
    fetchMapelList();
    
    if (isEditMode) {
      fetchGuru();
    }
  }, [id]);
  
  // Fungsi untuk mengambil data guru berdasarkan ID
  const fetchGuru = async () => {
    try {
      setLoading(true);
      const response = await GuruService.get(id);
      const guru = response.data;
      
      // Format tanggal untuk input date
      const formattedDate = guru.tanggal_lahir ? 
        new Date(guru.tanggal_lahir).toISOString().split('T')[0] : '';
      
      setFormData({
        ...guru,
        tanggal_lahir: formattedDate,
        foto: null // Reset foto karena kita tidak ingin menimpa foto yang ada kecuali user memilih yang baru
      });
      
      if (guru.foto) {
        setPreview(`http://localhost:8000/storage/guru/${guru.foto}`);
      }
    } catch (error) {
      setError('Gagal memuat data guru');
      console.error('Error fetching guru:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fungsi untuk mengambil daftar mata pelajaran
  const fetchMapelList = async () => {
    try {
      const response = await MapelService.getAll();
      setMapelList(response.data);
    } catch (error) {
      console.error('Error fetching mapel list:', error);
      setError('Gagal memuat daftar mata pelajaran');
    }
  };
  
  // Handler untuk perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handler untuk perubahan file foto
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        foto: file
      });
      
      // Membuat preview foto
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Jika mode edit, panggil API update, jika tidak panggil API create
      if (isEditMode) {
        await GuruService.update(id, formData);
      } else {
        await GuruService.create(formData);
      }
      navigate('/guru'); // Redirect ke halaman daftar guru setelah berhasil
    } catch (error) {
      setError(
        error.response?.data?.message ||
        `Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} data guru`
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
        <p>Memuat data guru...</p>
      </div>
    );
  }
  
  return (
    <div className="guru-form">
      <h1>{isEditMode ? 'Edit Guru' : 'Tambah Guru Baru'}</h1>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="nip">NIP</label>
                <input
                  type="text"
                  id="nip"
                  name="nip"
                  value={formData.nip}
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
                <label htmlFor="mapel_id">Mata Pelajaran</label>
                <select
                  id="mapel_id"
                  name="mapel_id"
                  value={formData.mapel_id}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Pilih Mata Pelajaran</option>
                  {mapelList.map(mapel => (
                    <option key={mapel.id} value={mapel.id}>
                      {mapel.nama_mapel}
                    </option>
                  ))}
                </select>
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
              onClick={() => navigate('/guru')}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuruForm; 