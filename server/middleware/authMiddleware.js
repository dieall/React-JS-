const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

// Mock data untuk demo tanpa database
const mockUsers = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  },
  {
    _id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
  },
];

// Middleware untuk melindungi rute
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Ambil token dari header
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret');

      // Check if using mock data
      if (!mongoose || !mongoose.connection || mongoose.connection.readyState !== 1) {
        console.log('Using mock data for authentication');
        const user = mockUsers.find(u => u._id === decoded.id);
        
        if (user) {
          req.user = user;
          next();
          return;
        } else {
          res.status(401);
          throw new Error('User tidak ditemukan');
        }
      }

      // Ambil user dari database (tanpa password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Token tidak valid');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Tidak ada token, akses ditolak');
  }
};

// Middleware untuk admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Bukan admin, akses ditolak');
  }
};

// Middleware untuk user biasa
const user = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    res.status(401);
    throw new Error('Bukan user, akses ditolak');
  }
};

module.exports = { protect, admin, user }; 