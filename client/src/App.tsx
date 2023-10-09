import React from 'react';
import {Routes, Route} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistForm from "./components/RegistForm";
import Home from "./components/Home";
import Profile from "./components/profile";
import AddPost from "./components/AddPosts";
import Publication from "./components/Publication";
import {FullPost} from "./components/FullPost";
export const CLIENT_URL = "http://localhost:3000"
function App() {
  return (
      <>
        <Routes>
            <Route path="/login" element={<LoginForm/>}/>
            <Route path="/registration" element={<RegistForm/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/user/:id" element={<Profile/>}/>
            <Route path="/posts" element={<Publication/>}/>
            <Route path="/post/:id" element={<FullPost/>}/>
            <Route path="/post/:id/edit" element={<AddPost/>}/>
            <Route path="/post/create" element={<AddPost/>}/>
        </Routes>
      </>
  );
};

export default App;
