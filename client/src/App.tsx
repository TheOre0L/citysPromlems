import React from 'react';
import {Routes, Route} from "react-router-dom";
import Home from "./Pages/Home";
import Profile from "./Pages/profile";
import AddPost from "./components/AddPosts";
import Publication from "./Pages/Publication";
import FullPost from "./Pages/FullPost";
import Settings from "./Pages/settings";
import PublicationFilterCity from "./Pages/PublicationFilterCity";
export const CLIENT_URL = "http://localhost:3000"
function App() {
  return (
      <>
        <Routes>
            <Route path="/settings" element={<Settings/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/user/:id" element={<Profile/>}/>
            <Route path="/posts" element={<Publication/>}/>
            <Route path="/posts/city/:id" element={<PublicationFilterCity/>}/>
            <Route path="/post/:id" element={<FullPost/>}/>
            <Route path="/post/:id/edit" element={<AddPost/>}/>
            <Route path="/post/create" element={<AddPost/>}/>
        </Routes>
      </>
  );
};

export default App;
