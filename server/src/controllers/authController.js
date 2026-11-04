import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'wildtrail_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, mobile, city } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email,
        password,
        mobile: mobile || '',
        city: city || ''
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
          city: user.city
        }
      });
    }

    // Demo cloud mode fallback
    const fakeId = `user_${Date.now()}`;
    const token = generateToken(fakeId);
    res.status(201).json({
      message: 'Registration successful (Demo Mode)',
      token,
      user: {
        _id: fakeId,
        name,
        email,
        role: 'user',
        mobile: mobile || '',
        city: city || ''
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);

      return res.json({
        message: 'Login successful',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
          city: user.city
        }
      });
    }

    // Demo cloud mode fallback credentials
    if (email === 'admin@wildtrail.com' && password === 'Admin@123') {
      const token = generateToken('admin_demo_id');
      return res.json({
        message: 'Login successful (Demo Mode)',
        token,
        user: {
          _id: 'admin_demo_id',
          name: 'System Admin',
          email: 'admin@wildtrail.com',
          role: 'admin',
          mobile: '9876543210',
          city: 'New Delhi'
        }
      });
    }

    if (email === 'user@wildtrail.com' && password === 'User@123') {
      const token = generateToken('user_demo_id');
      return res.json({
        message: 'Login successful (Demo Mode)',
        token,
        user: {
          _id: 'user_demo_id',
          name: 'Rahul Sharma',
          email: 'user@wildtrail.com',
          role: 'user',
          mobile: '9123456780',
          city: 'Bangalore'
        }
      });
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

export const getProfile = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id).select('-password');
      return res.json({ user });
    }
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};
