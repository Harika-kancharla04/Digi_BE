const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = new User(userData);
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', newUser });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', err });
    }
};

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ message: 'Signup successful', user: newUser, token });
    } catch (err) {
        res.status(500).json({ message: 'Error during signup', err });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ message: 'Login successful', user, token });
    } catch (err) {
        res.status(500).json({ message: 'Error during login', err });
    }
};

const guestLogin = (req, res) => {
    try {
        const guestUser = { id: 'guest', email: 'guest@demo.com', name: 'Guest User' };
        const token = jwt.sign(guestUser, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ message: 'Guest login successful', user: guestUser, token });
    } catch (err) {
        res.status(500).json({ message: 'Error during guest login', err });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', err });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', err });
    }
};

const updateUserById = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', err });
    }
};

const deleteUserById = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', err });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // Remove sensitive information before sending response
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(200).json(userResponse);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err.message });
    }
};
const updateUser = async (req, res) => {
    try {
      const userId = req.user.id;
      const { 
        name, 
        email, 
        phone, 
        currentPassword, 
        newPassword, 
        theme, 
        language 
      } = req.body;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Password change validation
      if (currentPassword && newPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
        
        user.password = await bcrypt.hash(newPassword, 10);
      }
  
      // Update other fields
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.theme = theme || user.theme;
      user.language = language || user.language;
  
      await user.save();
  
      // Remove sensitive information before sending response
      const userResponse = user.toObject();
      delete userResponse.password;
  
      res.status(200).json({ 
        message: 'User updated successfully', 
        user: userResponse 
      });
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ 
        message: 'Error updating user', 
        error: err.message 
      });
    }
  };
  
  const deleteUser = async (req, res) => {
    try {
      const userId = req.user.id;
      await User.findByIdAndDelete(userId);
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
  };


module.exports = { createUser, signup, login, guestLogin, getAllUsers, getUserById, updateUserById, deleteUserById, getCurrentUser,updateUser,deleteUser };
