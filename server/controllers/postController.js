const Post=require("../models/Post");

// 1) get all posts -- for home page all posts
const getAllPosts = async(req,res)=>{
    try {

        // .populate() replaces the author id with actual user data
        // "author", "name profilePic" means: populate the author field
        // but only bring name and profilePic — not email or password
        // .sort({ createdAt: -1 }) means newest posts come first
        // -1 = descending, 1 = ascending
        const posts=await Post.find()
                          .populate("author","name profilePic")
                          .sort({createdAt:-1});
        
        res.json(posts);
    } catch (error) {
        res.status(500).json({message:"Servor Error"});
    }
};



// 2) get post by id-- to read a single post
const getPostById = async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)
                        .populate("author","name profilePic");
        
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error" }); 
    }
}


// 3) create post 
const createPost=async(req,res)=>{
    try{
    const {title,story,location}=req.body;

    if (!title || !story || !location) {
            return res.status(400).json({ 
                message: "Title, story and location are required" 
            });
    }

     // req.files is added by multer after uploading to Cloudinary
     // each file has a .path property which is the Cloudinary URL
     // we map over them to get just the URLs
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const post= new Post({
        title,
        location,
        story,
        images:imageUrls,
        author:req.user._id,
    });
    
    // save the post
    const saved=await post.save();
    await saved.populate("author","name profilePic");

    res.status(201).json(saved);
}
   catch(error){
      console.log(error);
      res.status(500).json({ message: "Server error" });
   }
}


// 4) Delete post

const deletePost= async (req,res)=>{
    try {
        const post= await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ message: "Post not found" });
        }
        
        // check if the post is users own post or not
        if(post.author.toString()!== req.user._id.toString()){
            return res.status(403).json({message:"you can only delete your own posts"});
        }
        
        await Post.findByIdAndDelete(req.params.id);
        res.json({message:"post deleted succesfully"});

    } catch (error) {
        res.status(500).json({message:"Servor Error"});
    }
}



// 5) like post 

const likePost= async (req,res)=>{
    try {
         const post=await Post.findById(req.params.id);

        if(!post){
          return res.status(404).json({ message: "Post not found" });
        }
 
        //check if already liked the post
        const alreadyLiked=post.likes.some(
            id=> id.toString()=== req.user._id.toString()
        );

        if(alreadyLiked){
            // unlike the post because the user cliked again
            post.likes=post.likes.filter(
                id=>id.toString()!==req.user._id.toString()
            );
        }else{
            // like the post
            post.likes.push(req.user._id);
        }

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

// 6) update post -- except the images 
const updatePost = async (req,res)=>{
    try {
        const post=await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // only the author can update
        if(post.author.toString()!==req.user._id.toString()){
            return res.status(403).json({ message: "Not authorized" });
        }
        
        post.title=req.body.title || post.title;
        post.story = req.body.story || post.story;
        post.location = req.body.location || post.location;

        const updated= await post.save();
        res.json(updated);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports={
    getAllPosts,
    getPostById,
    createPost,
    deletePost,
    likePost,
    updatePost
};