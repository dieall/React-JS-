const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Mock data untuk demo tanpa database
const mockUsers = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$10$eCc/ZVlfBs.LQ9./7E8N9.MJD.nLVEsgRfMu8k.Xn5ZZSqCXDXWha', // 'password123'
    role: 'admin',
  },
  {
    _id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    password: '$2a$10$eCc/ZVlfBs.LQ9./7E8N9.MJD.nLVEsgRfMu8k.Xn5ZZSqCXDXWha', // 'password123'
    role: 'user',
  },
];

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_jwt_secret', {
    expiresIn: '30d',
  });
};

// Check if MongoDB is connected
const isDbConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if using mock data
    if (!mongoose || !mongoose.connection || mongoose.connection.readyState !== 1) {
      console.log('Using mock data for login');
      const user = mockUsers.find(u => u.email === email);
      
      if (user && password === 'password123') {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
        return;
      } else {
        res.status(401);
        throw new Error('Email atau password tidak valid');
      }
    }
    
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Email atau password tidak valid');
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if using mock data
    if (!mongoose || !mongoose.connection || mongoose.connection.readyState !== 1) {
      console.log('Using mock data for registration');
      
      const userExists = mockUsers.find(u => u.email === email);
      
      if (userExists) {
        res.status(400);
        throw new Error('User sudah ada');
      }
      
      const newUser = {
        _id: Date.now().toString(),
        name,
        email,
        password: '$2a$10$eCc/ZVlfBs.LQ9./7E8N9.MJD.nLVEsgRfMu8k.Xn5ZZSqCXDXWha',
        role: role || 'user',
      };
      
      mockUsers.push(newUser);
      
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser._id),
      });
      return;
    }
    
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User sudah ada');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Data user tidak valid');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // Check if using mock data
    if (!mongoose || !mongoose.connection || mongoose.connection.readyState !== 1) {
      console.log('Using mock data for user profile');
      
      const userId = req.user._id;
      const user = mockUsers.find(u => u._id === userId);
      
      if (user) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
        return;
      } else {
        res.status(404);
        throw new Error('User tidak ditemukan');
      }
    }
    
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404);
      throw new Error('User tidak ditemukan');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { authUser, registerUser, getUserProfile }; 