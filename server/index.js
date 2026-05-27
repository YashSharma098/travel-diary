require("dotenv").config();
const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")

const authRoutes=require("./routes/authRoutes");
const postRoutes=require("./routes/postRoutes");
const userRoutes=require("./routes/userRoutes");

const app=express();

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "https://travel-diary-cyan.vercel.app",
    ],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json())

app.use("/api/auth",authRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/users",userRoutes);

app.get("/",(req,res)=>{
    res.json({message:"backend server running"});
});

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(5000,()=>console.log("server is running on PORT:5000"));
})
.catch((error)=>{
    console.log("mongo db error",error);
})

