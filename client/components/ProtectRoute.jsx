import {useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext"

const ProtectedRoute=({children})=>{
    const {user,loading}=useAuth();
    const Navigate=useNavigate();

    if(loading){
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    // if not logged in they cant access- redirect them to login page
    if(!user){
        return <Navigate to="/login"/>;
    }
 
    // logged in - can access the page
    return children
}

export default ProtectedRoute;