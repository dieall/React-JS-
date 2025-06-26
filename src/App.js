import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
         
// Import CSS dari template Gymove
// Kita tidak perlu mengimpor CSS dari folder assets karena sudah di-load di index.html

// Components
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Login from './components/auth/Login';
import PrivateRoute from './utils/PrivateRoute';

// Siswa Components
import SiswaList from './components/siswa/SiswaList';
import SiswaDetail from './components/siswa/SiswaDetail';
import SiswaForm from './components/siswa/SiswaForm';

// Guru Components
import GuruList from './components/guru/GuruList';
import GuruForm from './components/guru/GuruForm';

// Mapel Components
import MapelList from './components/mapel/MapelList';
import MapelForm from './components/mapel/MapelForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } />
        
        {/* Siswa Routes */}
        <Route path="/siswa" element={
          <PrivateRoute>
            <Layout>
              <SiswaList />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/siswa/:id" element={
          <PrivateRoute>
            <Layout>
              <SiswaDetail />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/siswa/create" element={
          <PrivateRoute>
            <Layout>
              <SiswaForm />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/siswa/edit/:id" element={
          <PrivateRoute>
            <Layout>
              <SiswaForm />
            </Layout>
          </PrivateRoute>
        } />
        
        {/* Guru Routes */}
        <Route path="/guru" element={
          <PrivateRoute>
            <Layout>
              <GuruList />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/guru/create" element={
          <PrivateRoute>
            <Layout>
              <GuruForm />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/guru/edit/:id" element={
          <PrivateRoute>
            <Layout>
              <GuruForm />
            </Layout>
          </PrivateRoute>
        } />
        
        {/* Mapel Routes */}
        <Route path="/mapel" element={
          <PrivateRoute>
            <Layout>
              <MapelList />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/mapel/create" element={
          <PrivateRoute>
            <Layout>
              <MapelForm />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/mapel/edit/:id" element={
          <PrivateRoute>
            <Layout>
              <MapelForm />
            </Layout>
          </PrivateRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
