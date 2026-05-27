const jwt=require("jsonwebtoken");
const User=require("../models/User");


const protect= async (req,res,next)=>{
    try{
    const authHeader=req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"not authorized"});
    }

    const token=authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // select(-password) to exclude password in user object and send everythig else
    req.user = await User.findById(decoded.id).select("-password");
    
    next();
    }
    catch(error){
        console.log("JWT Error:", error.message);
        res.status(401).json({ message: "Token invalid or expired" });
    }
}

module.exports=protect;