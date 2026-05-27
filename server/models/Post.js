const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true,
    },
    
     story:{
        type: String,
        required: true,
    },

    location:{
        type: String,
        required: true,
    },

    images:[String],

    author:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true,
    },

    likes:[
        {
            type:mongoose.Types.ObjectId,
            ref:"User",
        }
    ]

},{timestamps:true});

module.exports=mongoose.model("Post",postSchema);