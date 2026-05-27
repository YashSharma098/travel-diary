const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// SIgnup
const signupUser= async (req,res)=>{
    try{
        const {name,email,password}=req.body;

        if(!name || !email || !password){
            return res.status(400).json({message:"all the fiels are required"});
        }

        // check if already someone is using this email
        const alreadyUser= await User.findOne({email});
        if(alreadyUser){
            return res.status(400).json({message: "email already registered"});
        }
        
        // now we hash the password before saving user credentials
        const salt= await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        // now create new user and save its info
        const user=new User({
            name,
            email,
            password:hashedPassword,
        });
        await user.save();

        // now we create the jwt token for the user to stay logged in 
        const token=jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );

        // sent back the token + basic user info
        res.status(201).json({
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                profilePic:user.profilePic,
            }
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Server error"});
    }
};


//Login
const loginUser = async (req,res)=>{
    try {
       const {email,password}=req.body;

       if(!email || !password){
          res.status(400).json({message:"both email and password are required"});
       }

       // verify email
       const user=await User.findOne({email});
       if(!user){
         res.status(400).json({message:"Invalid credentials"});
       }

       // verify password
       const passVerify= await bcrypt.compare(password,user.password);
       if(!passVerify){
          res.status(400).json({message:"Invalid credentials"});
       }

       // now create token after the user is verified
       const token=jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
       );

       // send userinfo and token
       res.json({
          token,
          user:{
            id:user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
          }
       });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"server error"});
    }
};

module.exports = { signupUser, loginUser };