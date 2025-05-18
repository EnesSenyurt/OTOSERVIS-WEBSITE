import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Araclar from "./pages/Araclar";
import RandevuAl from "./pages/RandevuAl";
import AdminPanel from "./pages/AdminPanel";
import Personeller from "./pages/Personeller";



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/araclar" element={<Araclar />} />,
        <Route path="/randevu-al" element={<RandevuAl />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/personeller" element={<Personeller />} />


       <Route
    path="/profile"
    element={
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    }
  />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;