import { useEffect } from "react";
import {createContext,useContext,useState} from "react"

// context object- this is what all the components will access
const AuthContext=createContext();

// it makes auth data available everywhere
export const AuthProvider=({children})=>{

    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);

    //check if user was already logged in
    // by looking for saved data in localStorage
    useEffect(()=>{
        const savedUser=localStorage.getItem("user");
        const savedToken=localStorage.getItem("token");

        if(savedUser && savedToken){
            setUser(JSON.parse(savedUser));
        }

        setLoading(false);
    },[])  // empty array - this runs only once on start


    // called after successful login or signup
    const login=(userData,token)=>{
        setUser(userData);
        localStorage.setItem("user",JSON.stringify(userData));
        localStorage.setItem("token",token);
    }


    // called when the user logout
    const logout=()=>{
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return(
           // values -- all the things the childs can access
           <AuthContext.Provider value={{user,login,logout,loading}}>
             {children}
           </AuthContext.Provider>
    );
};

// custom hook
export const useAuth=()=> useContext(AuthContext);