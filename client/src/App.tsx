import { Route, Routes } from "react-router-dom";
import AddPost from "./Pages/AddPosts";
import AdminPanel from "./Pages/AdminPanel";
import FullPost from "./Pages/FullPost";
import Home from "./Pages/Home";
import Publication from "./Pages/Publication";
import Profile from "./Pages/profile";
import Settings from "./Pages/settings";
export const CLIENT_URL = "http://localhost:3000"
function App() {
  return (
      <>
        <Routes>
            <Route path="/settings" element={<Settings/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/user/:id" element={<Profile/>}/>
            <Route path="/posts" element={<Publication/>}/>
            <Route path="/posts/:city" element={<Publication/>}/>
            <Route path="/post/:id" element={<FullPost/>}/>
            <Route path="/post/:id/edit" element={<AddPost/>}/>
            <Route path="/admin" element={<AdminPanel/>}/>
            <Route path="/post/create" element={<AddPost/>}/>
        </Routes>
      </>
  );
};

export default App;
