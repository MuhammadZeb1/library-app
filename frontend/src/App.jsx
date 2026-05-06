import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

const App = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    
      {/* <Route path="/" element={<Home />} /> */}
    </Routes>
  );
};

export default App;