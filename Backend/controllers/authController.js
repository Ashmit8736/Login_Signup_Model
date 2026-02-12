const User = require('../models/user_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc Register a new user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token,
                 user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
             });
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error during registration' });
    }
};

// @desc Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token ,
                                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }

            });
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error during login' });
    }
};

// @desc Get user profile (Protected)
exports.getProfile = async (req, res) => {
    try {
        // req.user.id hume 'auth' middleware se milti hai
        const user = await User.findById(req.user.id).select('-password'); // Password hide rakhein
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};  

// fetch all user data
exports.getAllUsers = async (req, res) => {
    try {
        // -1 ka matlab hai descending order (Newest first)
        const users = await User.find().sort({ createdAt: -1 }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// User delete logic 
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
