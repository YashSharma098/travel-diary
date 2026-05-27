const express=require("express");
const router=express.Router();
const protect=require("../middleware/protect");
const upload=require("../middleware/upload");
const { userProfile,updateProfilePic } = require("../controllers/userController");


router.get("/:id",userProfile);
router.put("/profile-pic",protect,upload.single("profilePic"),updateProfilePic);

module.exports=router;
