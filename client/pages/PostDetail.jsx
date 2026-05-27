import {Link,useNavigate,useParams} from "react-router-dom"
import { useEffect, useState } from "react";
import API from "../api/axios"
import {useAuth} from "../context/AuthContext"

const PostDetail = () => {
    const {id}=useParams();
    const {user}=useAuth();
    const navigate=useNavigate();

    const [post,setPost]=useState(null);
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState("");
    const [likeLoading, setLikeLoading] = useState(false);

    // Lightbox state — which image is currently fullscreen
    const [lightboxImage,setLightboxImage]=useState(null);

    // fetch post
    useEffect(()=>{
        const fetchPost= async()=>{
            try {
                const response=await API.get(`/posts/${id}`);
                setPost(response.data);
            } catch (error) {
                 setError("Post not found");
                 console.log(error);
            }
            setLoading(false);
        }
        fetchPost();
    },[id])


    // check if logged in user already liked the post
    const isLiked= user && post?.likes?.some(
        likedid=> likedid===user.id || likedid==user._id
    );

    // handle like feature

    const handleLike= async ()=>{
        // if not logged in redirect to login page
        if(!user){
            <p className="text-red-500"> Login Required </p>
             navigate("/login");
            return;
        }

        setLikeLoading(true);

        try {
            const response= await API.put(`/posts/${id}/like`);
            setPost(prev=>({...prev,likes:response.data.likes}));
        } catch (error) {
            console.log(error);
        }
        setLikeLoading(false);
    }


    // delete post
    const handleDelete= async ()=>{
        
        // confirm before deleting
        if(!window.confirm("Are you sure you want to delete this post ?")) return;

        try {
            await API.delete(`/posts/${id}`);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }
    
    // formatdate eg: "january 15, 2024"
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-8 py-12">
                {/* Skeleton for hero image */}
                <div className="h-96 bg-gray-200 rounded-xl animate-pulse mb-8" />
                <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-2/3" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
            </div>
        );
    }

    // error state
    if(error){
        return (
            <div className="max-w-3xl mx-auto px-8 py-12 text-center">  
                <h2 className="text-xl font-semibold text-red-400 mb-2">{error}</h2>
                <Link to="/" className="text-blue-500 hover:underline"> Back to Feed</Link>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-8 py-12">

             {/* first image of the post - hero section*/}
             {post.images && post.images.length>0 && (
                <div className="max-h-96 rounded-xl overflow-hidden mb-8">
                    <img className="w-full max-h-96 object-contain hover:opacity-95 transition"
                      src={post.images[0]} 
                      alt={post.title}
                      onClick={()=>setLightboxImage(post.images[0])}
                    />
                </div>
             )}

             {/* post header  */}
             <div className="mb-6">
                {/* location  */}
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-sm font-medium p-2 rounded-full"> 📍 {post.location} </span>

                {/* title */}
                <h1 className="text-3xl font-bold text-gray-600"> {post.title} </h1>

                {/* author info + date + actions */}
               
                <div className="flex justify-between items-center mt-4">

                    {/* author info  */}
                   <Link className="flex items-center gap-3"
                     to={`/profile/${post.author?._id}`}
                   >
                    {post.author?.profilePic ? (
                        <img className="w-10 h-10 rounded-full object-cover"
                        src={post.author.profilePic} 
                        alt={post.author.name} 
                        />
                    ):(
                        <div className="w-10 h-10 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold">
                            {post.author?.name?.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div>
                        <p className="text-gray-800 font-medium">
                            {post.author.name}
                        </p>
                        <p className="text-sm text-gray-500">
                               {formatDate(post.createdAt)}
                        </p>
                    </div>
                </Link>

                {/* like+delete buttons  */}
                <div className="flex items-center gap-3">
                    {/* like button  */}
                    <button className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                                isLiked
                                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                       onClick={handleLike}
                       disabled={likeLoading}
                    >
                          <span  className="text-2xl">{isLiked ? "❤️" : "🤍" }</span>
                          <span>{post?.likes?.length || 0}</span>
                    </button>

                    {/* delete button  */}
                    {user && user.id===post.author?._id?.toString() && (
                        <button 
                           onClick={handleDelete}
                           className="bg-red-50 text-red-400 px-4 py-2 rounded-lg fond-medium hover:bg-red-300 transition"
                        >
                               Delete Post
                        </button>
                    )}
                </div>
             </div>
           </div>
  
           {/* divider  */}
           <hr className="border-gray-300 mb-6"/>

           {/* story element  */}
           <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
              {post.story}
           </p>

           {/* photo gallery  -- to show all images if more than one */}
           {post.images && post.images.length>1 && (
               <div className="mt-10">
                   <h3 className="text-lg font-semibold text-gray-700">
                       📸 Photos
                   </h3>

                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {post.images.map((image,index)=>(
                              <div   className="aspect-square overflow-hidden rounded-lg"
                                    key={index}
                                    onClick={()=>setLightboxImage(image)}
                              >
                                 <img  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                   src={image} alt={post.title}
                                 />
                              </div>
                        ))}
                   </div>
               </div>
           )}


           {/* back to feed linkk  */}
           <div className="mt-10">
               <Link  className="text-blue-400 hover:underline felx items-center fond-semibold gap-1"
                   to="/"
                >
                   Back to Feed
               </Link>
           </div>
 

       {/* ligthbox -- for showing a selected image in fullscreen  */}
       {lightboxImage && (
           // fixed inset-0 = covers entire screen and z-50 ie above everything else
           <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
             onClick={()=>setLightboxImage(null)}
           >
               <img  className="max-w-4xl max-h-screen rounded-lg object-contain"
                  src={lightboxImage} 
                  alt={"Lightbox view"}
                  onClick={(e) => e.stopPropagation()}
               />

               {/* close image button  */}
               <button className="absolute top-6 right-18 text-white text-4xl hover:text-blue-500 transition"
                   onClick={()=>setLightboxImage(null)}
               >
                  X
               </button>
           </div>
       )}

      </div>
    )
}
export default PostDetail;