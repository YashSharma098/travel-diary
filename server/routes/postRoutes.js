const express=require("express");
const router=express.Router();
const protect=require("../middleware/protect");
const upload=require("../middleware/upload");

const {getAllPosts,getPostById,createPost,deletePost,likePost,updatePost}=require("../controllers/postController");


// routes
router.get("/",getAllPosts);
router.get("/:id",getPostById);

// create post route-- protect middleware to verify user is loged in or not before posting
// upload.array("images",10) -- max 10 photos per post
router.post("/",protect,upload.array("images",10),createPost);

router.delete("/:id",protect,deletePost);
router.put("/:id/like",protect,likePost);
router.put("/:id",protect,updatePost);

module.exports=router;
