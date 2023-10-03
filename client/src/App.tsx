import React from 'react';
import {Routes, Route} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistForm from "./components/RegistForm";
import Home from "./components/Home";
function App() {
  return (
      <>
        <Routes>
            <Route path="/login" element={<LoginForm/>}/>
            <Route path="/registration" element={<RegistForm/>}/>
            <Route path="/" element={<Home/>}/>
        </Routes>
      </>
  );
}

export default App;
