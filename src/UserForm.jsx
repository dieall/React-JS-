import { useState } from 'react' // Mengimpor useState dari React untuk state lokal

function UserForm() { // Komponen UserForm
  const [nama, setNama] = useState('') // State untuk input nama
  const [email, setEmail] = useState('') // State untuk input email
  const [pesan, setPesan] = useState('') // State untuk input pesan
  const [submitted, setSubmitted] = useState(false) // State untuk status submit

  const handleSubmit = (e) => { // Fungsi saat form disubmit
    e.preventDefault() // Mencegah reload halaman
    setSubmitted(true) // Mengubah status submitted menjadi true
  }

  return (
    <div className="form-container"> {/* Container form */}
      <h2>Form Pengguna</h2> {/* Judul form */}
      
      {submitted ? ( // Jika form sudah disubmit
        <div className="success-message"> {/* Pesan sukses */}
          <h3>Terima kasih, {nama}!</h3> {/* Menampilkan nama */}
          <p>Email: {email}</p> {/* Menampilkan email */}
          <p>Pesan: {pesan}</p> {/* Menampilkan pesan */}
          <button onClick={() => setSubmitted(false)}>Isi Form Lagi</button> {/* Tombol untuk mengisi form lagi */}
        </div>
      ) : ( // Jika form belum disubmit
        <form onSubmit={handleSubmit}> {/* Form input */}
          <div className="form-group"> {/* Group input nama */}
            <label htmlFor="nama">Nama:</label>
            <input
              type="text"
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)} // Update state nama
              required
            />
          </div>
          
          <div className="form-group"> {/* Group input email */}
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>
          
          <div className="form-group"> {/* Group input pesan */}
            <label htmlFor="pesan">Pesan:</label>
            <textarea
              id="pesan"
              value={pesan}
              onChange={(e) => setPesan(e.target.value)} // Update state pesan
              rows="4"
              required
            />
          </div>
          
          <button type="submit">Kirim</button> {/* Tombol submit */}
        </form>
      )}
    </div>
  )
}

export default UserForm // Mengekspor komponen UserForm