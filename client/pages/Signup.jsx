import {useAuth} from "../context/AuthContext"
import{Link,useNavigate} from "react-router-dom"
import { useState } from "react"
import API from "../api/axios"

const Signup = () => {
    const navigate=useNavigate();
    const {login}=useAuth();

    const [formData,setFormdata]=useState({
        name:"",
        email:"",
        password:""
    })

    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");

    // function 1
    const handleChange=(e)=>{
        setFormdata({
            ...formData,
            [e.target.name]:e.target.value,
          }
        )
    }

    // function 2
    const handleSubmit= async(e)=>{
        e.preventDefault(); // to prevent the default behavior of the browser
        setError("");
        setLoading(true);

        try {
            // post this data to backend(/api/auth/register) and get back the response 
            const response=await API.post("/auth/signup",formData);
            const {token,user}=response.data;

            // save the info to context api+localstorage
            login(user,token);

            // go to home page after signup
            navigate("/");

        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }
        setLoading(false);
    };

   
    return(
        <div className="min-h-screen w-full flex items-center justify-center bg-amber-50">

            {/* card container- heading + input form */}
            <div className="bg-blue-50 rounded-lg shadow-lg p-8 w-full max-w-md">
                {/* heading above the form */}
                <div className="text-center m-4">
                    <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
                </div>

                {/* if there is already some error */}
                {error && (
                    <div className="border border-red-400 text-red-400 rounded-lg p-3 m-3 text-md">
                        {error}
                    </div>
                )}
                
                {/* input form with three inputs - name , email,pass */}
                <form onSubmit={handleSubmit} className="p-5 m-2">

                    <div>
                        <label className="mb-1 mt-3 text-md block text-black text-lg">Full Name</label>
                        <input className="text-xl text-black w-full border border-gray-500 rounded-lg hover:border-blue-400 transition p-3"
                        type="text" name="name" value={formData.name} onChange={handleChange} required 
                        />
                    </div>

                    <div>
                        <label className="mb-1 mt-3 text-md block text-black text-lg">Email</label>
                        <input className="text-xl text-black w-full border border-gray-500 rounded-lg hover:border-blue-400 transition p-3"
                        type="email" name="email" value={formData.email} onChange={handleChange} required 
                        />
                    </div>

                     <div>
                        <label className="mb-1 mt-3 text-md block text-black text-lg">Password</label>
                        <input className=" text-black w-full border border-gray-500 rounded-lg hover:border-blue-400 transition p-3"
                        type="password" name="password" value={formData.password} onChange={handleChange} required 
                        />
                    </div>

                    <button className="w-full bg-blue-600 text-white p-3 rounded-3xl font-semibold hover:bg-blue-700 transition m-3"
                        type="submit"
                        disabled={loading}
                    >
                        Submit
                    </button>
                </form>


                {/* if user already have an account */}
                <p className="text-center font-semibold text-sm text-gray-600">
                    Already Have an account ? 
                    <Link to={"/login"} className="text-blue-500 hover:underline text-md">
                       Login
                    </Link>
                </p>

            </div>
        </div>
    )
}
export default Signup;