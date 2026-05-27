import React from "react";
import { Route,Routes } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import PostDetail from "../pages/PostDetail";
import CreatePost from "../pages/CreatePost";
import Profile from "../pages/Profile";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectRoute";


const App = () => {
    return (
        <div>
            <Navbar/>
           <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/signup" element={<Signup/>}/>
              <Route path="/post/:id" element={<PostDetail/>}/>

              <Route path="/createpost" element={ 
                <ProtectedRoute> <CreatePost /> </ProtectedRoute>
              }/>
              <Route path="/profile/:id" element={
                 <ProtectedRoute><Profile/></ProtectedRoute>
              }/>
           </Routes>
        </div>
    )
}

export default App;