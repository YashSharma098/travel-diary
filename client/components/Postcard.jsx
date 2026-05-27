import {Link} from 'react-router-dom'

const PostCard=({post})=>{
     return (
        <Link to={`/post/${post._id}`} className='group block p-2 rounded'>
            <div className='bg-white rounded-xl shadow-sm hover:shadow-xl transition'>

                {/* cover image */}
                {post.images && post.images.length>0?(
                    <div className='h-48 overflow-hidden'>
                        <img className='w-full h-full group-hover:scale-100 transiton duration-300'
                         src={post.images[0]} 
                         alt={post.title} 
                         />
                    </div>
                ):(
                    <div className='h-48 bg-gray-300 flex items-center justify-center'>
                         <span className='text-5xl'>🗺️</span>
                    </div>
                )}

                {/* card content */}
                <div className='p-5'>

                     {/* location */}
                    <span className='inline-flex items-center bg-green-50 text-green-700 text-xs font-medium rounded-full px-2 py-2'>
                        📍 {post.location}
                    </span>

                    {/* title */}
                    <h1 className="mt-3 text-lg font-bold text-gray-700 line-clamp-1"> 
                        {post.title}
                    </h1>

                    {/* story */}
                    <p className='mt-2 text-sm text-gray-500'>
                        {post.story}
                    </p>

                    {/* foooter */}
                    <div className='flex justify-between items-center mt-4 pt-4 border-t border-gray-200'>
                        {/* author info */}
                        <div className='flex items-center gap-2'>
                            {post.author.profilePic? (
                                <img className='w-7 h-7 rounded-full object-cover'
                                    src={post.author.profilePic}
                                    alt={post.author.name}
                                />
                            ):(
                                <div className='w-7 h-7 rounded-full flex justify-center items-center bg-amber-600 text-white text-xs'>
                                      {post.author?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}

                            <span className='text-sm text-gray-600'>
                                {post.author.name}
                            </span>
                        </div>

                        {/* likes count */}
                        <div className='flex items-center text-md gap-1 text-gray-500'>
                            <span>❤️</span>
                            <span>{post.likes?.length || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
     );
};

export default PostCard;