const express = require("express");
const { TokenExpiredError } = require("jsonwebtoken");
const { decode } = require("punycode");
const authController = require("../controllers/auth");
const router = express.Router();


router.get('/register', (req, res) => {
    res.sendFile("register.html", { root: './public/' })
});
router.get('/login', (req, res) => {
    res.sendFile("login.html", { root: './public/' })
});
router.get('/profile', authController.isLoggedIn, (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile("profile.html", { root: './public/' })
    } else {
        res.sendFile("login.html", { root: './public/' });
    }
})
module.exports = router;