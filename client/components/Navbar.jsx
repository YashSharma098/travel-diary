import { Link,useNavigate } from 'react-router-dom'
import {useAuth} from "../context/AuthContext"

function Navbar() {

  const {user,logout}=useAuth();
  const navigate=useNavigate();
  
  const handleLogout=()=>{
    logout();
    // send to login page after logout
    navigate("/login");
  }

  return (
    <nav className='sticky top-0 z-50 bg-gray-50 shadow-md md:px-8 py-4 flex justify-between items-center'>

        {/* logo */}
        <Link to="/" className='hover: border-amber-600 transition text-2xl font-bold text-blue-400'>
            ✈️ TRAVEL DIARY
        </Link>

        {/* links for all the pages on navbar*/}
        <div className='flex gap-6 items-center'>
            
         { user ? (
            // if logged in show these routes on navgar
           <>
              <Link to="/" className='text-gray-700 font-bold hover:text-blue-600 transiton'>Feed</Link>
              <Link to="/createpost" className='text-gray-700 font-bold hover:text-blue-600 transiton'>Create Post</Link>
              
              {/* clicking name goes to the profile page */}
              <Link to={`/profile/${user.id}`} className='flex items-center gap-2 text-gray-700 font-bold hover:text-blue-600 transition'>
          
                {user.profilePic ? (
                   <img 
                        src={user.profilePic} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                   />
                ):(
                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                   </div>
                )}
                  <span>{user.name}</span>
              </Link>
           
              <button onClick={handleLogout} 
                      className='bg-red-400 text-sm md:text-md text-white p-2 rounded-full hover:bg-red-500 transition'
              >
                 Logout
              </button>

            </>
         ):(
          // if user not logged in then these routes
           <>
           <Link to="/login" className='text-gray-600 text-2xl font-bold  hover:text-blue-600 transiton'>Login</Link>
            <Link to="/signup" className='text-gray-600 text-2xl font-bold hover:text-blue-600 transiton'>Signup</Link>
           </>
         )}
        </div>
    </nav>
  )
}

export default Navbar