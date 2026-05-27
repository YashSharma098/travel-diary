const express=require("express");
const router=express.Router();
const { signupUser, loginUser } = require("../controllers/authController");


// Signup route
//POST /api/auth/Signup
router.post("/signup",signupUser);

// Login route
// POST /api/auth/login
router.post("/login",loginUser);

module.exports=router;