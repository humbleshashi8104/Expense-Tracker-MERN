
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

module.exports = { registerController };
