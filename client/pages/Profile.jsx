import { useState,useEffect,useRef } from "react"
import {Link,useParams} from "react-router-dom"
import API from "../api/axios"
import {useAuth} from "../context/AuthContext"
import PostCard from "../components/Postcard"


const Profile=()=>{
    const {id}=useParams();
    const {user,login}=useAuth();

    const [profile,setProfile]=useState(null);
    const [posts,setPosts]=useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [uploadingPic, setUploadingPic] = useState(false);

    const fileInputRef = useRef(null);
    const isOwnProfile= user?.id === id || user?._id===id;


    // fetch user profile + their posts

    useEffect(()=>{
        const fetchProfile= async ()=>{
             try {
                 const response=await API.get(`/users/${id}`);
                 setProfile(response.data.user);
                 setPosts(response.data.posts);
             } catch (error) {
                  setError("User not found");
                  console.log(error);
             }
             setLoading(false);
        }
        fetchProfile();
    },[id])


    // changes in profile pic
    const handleProfilePicChange= async (e)=>{
        const file=e.target.file[0];
        if(!file) return;

        setUploadingPic(true);
        try {
            const data= new FormData();
            data.append("profilePic",file);

            const response= await API.put("/users/profile-pic",data,{
                 headers: { "Content-Type": "multipart/form-data" }
            });

            setProfile(prev=>({
                ...prev,
                profilePic: response.data.profilePic
            }));

            const updatedUser={...user,profilePic: response.data.profilePic};
            login(updatedUser,localStorage.getItem("token"));

        } catch (error) {
            console.log(error);
        }
        setUploadingPic(false);
    }

    // Format join date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
        });
    };

    if(error){
        return (
            <div className="max-w-4xl mx-auto px-8 py-12 text-center">
                <h2 className="text-xl font-semibold text-gray-700">{error}</h2>
                <Link to="/" className="text-blue-600">
                   Back to Feed
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-8 py-12 text-center">

            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <div className="flex items-center gap-6">

                    {/* Profile Picture */}
                    <div className="relative">
                        {profile?.profilePic ? (
                            <img
                                src={profile.profilePic}
                                alt={profile.name}
                                // w-24 h-24 = 96px circle
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        ) : (
                            // Fallback — large letter avatar
                            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
                                {profile?.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                         {/* Camera icon overlay — only on own profile */}
                        {isOwnProfile && (
                            <button
                                onClick={() => fileInputRef.current.click()}
                                disabled={uploadingPic}
                                // absolute bottom-0 right-0 = bottom right of avatar
                                // rounded-full = circular button
                                className="absolute bottom-0 right-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 transition text-sm"
                            >
                                {uploadingPic ? "..." : "📷"}
                            </button>
                        )}

                        {/* Hidden file input — triggered by camera button */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleProfilePicChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                     {/* User Info */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {profile?.name}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {profile?.email}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            Joined {formatDate(profile?.createdAt)}
                        </p>

                        {/* Stats */}
                        <div className="flex gap-6 mt-3">
                            <div>
                                <span className="font-bold text-gray-800">
                                    {posts.length}
                                </span>
                                <span className="text-gray-500 ml-1 text-sm">
                                    {posts.length === 1 ? "story" : "stories"}
                                </span>
                                  </div>
                            <div>
                                <span className="font-bold text-gray-800">
                                    {/* Total likes across all posts */}
                                    {posts.reduce((total, post) => 
                                        total + (post.likes?.length || 0), 0
                                    )}
                                </span>
                                <span className="text-gray-500 ml-1 text-sm">
                                    total likes
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

         {/* Posts Section */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                    {isOwnProfile ? "Your Stories" : `${profile?.name}'s Stories`}
                </h2>

                {posts.length === 0 ? (
                    // Empty state
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <p className="text-5xl mb-4">✈️</p>
                        <p className="text-gray-500 mb-4">
                            {isOwnProfile
                                ? "You haven't shared any stories yet"
                                : "No stories shared yet"
                            }
                        </p>
                         {isOwnProfile && (
                            <Link
                                to="/createpost"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                            >
                                Share Your First Story
                            </Link>
                        )}
                    </div>
                ) : (
                    // Posts grid — same as home feed
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map(post => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;