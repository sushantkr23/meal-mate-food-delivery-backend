const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = "MynameissushantYouTubeChannel$#"

// Route: Create User
router.post("/creatuser", [
    body('email').isEmail(),
    body('name', 'Invalid Name').isLength({ min: 5 }),
    body('password', 'Incorrect Password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt)

    try {
        await User.create({
            name: req.body.name,
            password: secPassword,   // plain text (not secure)
            email: req.body.email,
            location: req.body.location
        });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
});

// Route: Login User
router.post("/loginuser", [
    body('email').isEmail(),
    body('password', 'Incorrect Password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // find user by email
        let userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ errors: "User does not exist. Try registering first." });
        }
        const pwdCompare = await bcrypt.compare(req.body.password,userData.password)
        // check password (plain comparison, no bcrypt)
        if (!pwdCompare) {
            return res.status(400).json({ errors: "Incorrect password." });
        }
        const data = {
            user:{
                id:userData.id
            }
        }
        const authToken = jwt.sign(data,jwtSecret)
        return res.json({ success: true, authToken:authToken });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
})

module.exports = router;
