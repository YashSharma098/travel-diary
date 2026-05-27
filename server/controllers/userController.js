const User=require("../models/User");
const Post=require("../models/Post");

// userprofile-- user info+all his posts

const userProfile= async (req,res)=>{
    try {
        // user object except password
        console.log("Fetching profile for id:", req.params.id); // add this
        const user= await User.findById(req.params.id).select("-password");
        console.log("User found:", user); // add this
        if(!user){
            return res.json({message:"User not found"});
        }

        // all the posts of user and sort them by upload date
        const posts= await Post.find({author: req.params.id})
                               .sort({createdAt:-1});
                
        res.json({user,posts});

    } catch (error) {
        console.log("Profile error:", error.message); // add this
        res.status(500).json({message:"Servor Error"});
    }
}


// update profile pic of the user

const updateProfilePic = async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({ message: "No image provided" });
        }

        // update the pic and return the updated user
        const updatedUser=await User.findByIdAndUpdate(
             req.user._id,
             {profilePic:req.file.path},
             {new:true}  // return the updated user not the old one
        ).select("-password");

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports={userProfile,updateProfilePic};