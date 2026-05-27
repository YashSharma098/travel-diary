import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/Postcard";
import { Link } from "react-router-dom"

const Home = () => {
   const { user } = useAuth();

   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");


   const [search, setSearch] = useState("");

   const filteredPosts = posts.filter(post =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.location.toLowerCase().includes(search.toLowerCase())
   );


   // fetch all the post
   useEffect(() => {
      const fetchPosts = async () => {
         try {
            const response = await API.get("/posts");
            setPosts(response.data);
         } catch (error) {
            console.log("Fetch error:", error);
            setError("Failed to load posts");
         }
         setLoading(false);
      };
      fetchPosts();
   }, []);


   // Loading state — show skeletons while fetching
   // if (loading) {
   //     return (
   //         <div className="max-w-6xl mx-auto px-8 py-12">
   //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
   //                 {/* Show 6 skeleton cards while loading */}
   //                 {[1, 2, 3, 4, 5, 6].map((i) => (
   //                     <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
   //                         {/* animate-pulse = pulsing gray effect */}
   //                         <div className="h-48 bg-gray-200 animate-pulse" />
   //                         <div className="p-5 space-y-3">
   //                             <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
   //                             <div className="h-6 bg-gray-200 rounded animate-pulse" />
   //                             <div className="h-4 bg-gray-200 rounded animate-pulse" />
   //                             <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
   //                         </div>
   //                     </div>
   //                 ))}
   //             </div>
   //         </div>
   //     );
   // }


   // error state
   if (error) {
      return (
         <div className="max-w-2xl mx-auto text-center p-8">
            <p className="text-red-400">{error}</p>
         </div>
      )
   }


   return (
      <div className="max-w-6xl mx-auto px-8 py-12">
         {/* page header  */}
         <div className="flex items-center justify-between mb-8 mt-2">
            <h1 className="text-4xl font-bold shadow-2xl text-blue-800">
               Travel Feed
            </h1>

            {/* show create post button only if the user is logged in  */}
            {user && (
               <Link className="bg-blue-400 font-semibold text-white rounded-full p-2 hover:bg-blue-600 transition "
                  to="/createPost"
               >
                  Share Your Story
               </Link>
            )}
         </div>


         {/* Search bar */}
         <div className="mb-8">
            <input
               type="text"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search by title or location..."
               className="w-full max-w-md border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
            />
         </div>



         {/* handle empty state or show all the posts  */}
         {posts.length === 0 ? (
            <div className="flex text-center py--20">
               <p className="text-6xl mb-4">🗺️</p>
               <h2 className="text-xl font-semibold text-gray-600 mb-4">NO Stories Yet</h2>
               <p className="text-lg text-gray-600 mb-6">Be the first to share your adventure</p>
               {user && (
                  <Link className="bg-blue-400 text-white rounded-lg font-bold hover:bg-blue-600 transition"
                     to="/createPost"
                  >
                     Share Story
                  </Link>
               )}
            </div>
         ) : (
            //  posts array not empty 
            // grid-col  : post columns on homepage acc to screen size
            <div className="m-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
               {filteredPosts.length === 0 ? (
                  <div className="col-span-3 text-center py-16">
                     <p className="text-5xl mb-4">🔍</p>
                     <p className="text-gray-500">No posts found for "{search}"</p>
                  </div>
               ) : (
                  filteredPosts.map((post) => (
                     <PostCard key={post._id} post={post} />
                  ))
               )}
            </div>
         )};
      </div>
   )

}
export default Home;