import React from 'react';
import {Routes, Route} from "react-router-dom";
import Home from "./components/Home";
import Profile from "./components/profile";
import AddPost from "./components/AddPosts";
import Publication from "./components/Publication";
import FullPost from "./components/FullPost";
import Settings from "./components/settings";
export const CLIENT_URL = "http://localhost:3000"
function App() {
  return (
      <>
        <Routes>
            <Route path="/settings" element={<Settings/>}/>
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
