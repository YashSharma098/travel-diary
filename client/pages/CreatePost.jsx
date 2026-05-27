import {useNavigate} from "react-router-dom"
import { useState } from "react";
import API from "../api/axios"

const CreatePost = () => {
    const navigate=useNavigate();

    const [formData,setFormdata]=useState({
        title: "",
        location: "",
        story: "",
    })

    const [images,setImages]=useState([]);  // post images array
    const [previews,setPreviews]=useState([]);  // temp array of images url for preview

    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");

    // 4-handler func:
    // func-1
    const handleChange=(e)=>{
        setFormdata({
            ...formData,
            [e.target.name]:e.target.value,
        });
    };

    // func-2
    const handleImageChange=(e)=>{
        const files=e.target.files;
        setImages(files);

        // Array.from converts FileList to regular array
        // so we can use .map() on it
       const previewURLs=Array.from(files).map((file)=>{
           return URL.createObjectURL(file); // it creats a temp url
       });
      setPreviews(previewURLs);
   };

  // func-3
   const removeImage=(index)=>{
       const updatedImages=Array.from(images).filter((_,i)=> i!==index );
       const updatedPreview=previews.filter((_,i)=> i!==index );

       setImages(updatedImages);
       setPreviews(updatedPreview);
   }

   // func-4
   const handleSubmit= async (e)=>{

      e.preventDefault();
      setError("");

      // basic check
      if(!formData.title || !formData.location || !formData.story){
         setError("all fields are required");
         return;
      }
       
      setLoading(true);
          
      try {
          const data=new FormData();
          data.append("title",formData.title);
          data.append("story",formData.story);
          data.append("location",formData.location);

          Array.from(images).forEach(image => {
              data.append("images",image);
          });

          await API.post("/posts",data,{
             headers:{"Content-Type":"multipart/form-data"}
          });

          navigate("/");
      } catch (error) {
          console.log(error);
          setError(error.response?.data?.message || "Something went wrong");
      }

      setLoading(false);
   };
  

   return(
        <div className="max-w-2xl mx-auto px-8 py-12 bg-white">

            {/* header */}
            <div className="mb-8">
                <h1 className="font-bold text-2xl text-blue-400">Share Your Adventure</h1>
            </div>

            {/* error message */}
            {error && (
                <div className="font-bold text-sm p-4 m-4 text-red-400 rounded-lg bg-red-50">{error}</div>
            )}


            <form onSubmit={handleSubmit} className="space-y-6">
                {/* title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trip Title
                    </label>
                    <input className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                       type="text"
                       name="title"
                       value={formData.title}
                       onChange={handleChange}
                       placeholder="e.g. My Ladakh Adventure"
                     />
                </div>

                {/* location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                    </label>
                    <input className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                       type="text"
                       name="location"
                       value={formData.location}
                       onChange={handleChange}
                       placeholder="eg. Leh-Ladakh,India" 
                    />
                </div>

                {/* story */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your trip story
                    </label>
                    <input className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                       type="text"
                       name="story"
                       value={formData.story}
                       onChange={handleChange}
                       placeholder="Tell us about your trip" 
                    />
                </div>

                {/* image upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                       Photos
                    </label>
                    
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                        <div className="text-center">
                            <p className="text-4xl mb-2">📷</p>
                            <p classname="text-sm text-gray-500">Click to upload photos</p>
                        </div>

                        <input 
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden" 
                        />
                    </label>

                    {/* image preview */}
                  {previews.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4">
                            {previews.map((url, index) => (
                                // relative = needed so the X button can be positioned absolutely
                                <div key={index} className="relative">
                                  <img
                                        src={url}
                                        alt={`preview ${index + 1}`}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                    {/* X button to remove this image */}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {loading ? "Uploading your story..." : "Publish Post"}
                </button>
            </form>
        </div>
   )

}
export default CreatePost;