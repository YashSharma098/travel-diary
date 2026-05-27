import axios from "axios";

// base url - now we can use API instead of whole url
const API=axios.create({
    baseURL:"http://localhost:5000/api"
});

// Interceptor — runs before EVERY request automatically
// This attaches the JWT token to every request that needs auth

API.interceptors.request.use((config)=>{

    const token=localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

export default API;