
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

// Register callback
const registerController = async (req, res) => {
    try {
        const {  name, email, password } = req.body;
        console.log("dd: ",req.body)
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        console.log("fff: ",req.body)

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            
        });

        await newUser.save();
        res.status(201).json({
            success: true,
            user: newUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error,
        });
    }
};

// Login callback
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(404).send('User Not Found');
        }

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid Credentials');
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

module.exports = { loginController, registerController };
