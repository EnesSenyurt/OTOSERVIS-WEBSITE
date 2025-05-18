import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu } from "lucide-react"; 

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center relative">
      {/* SOL: Menü Butonu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center space-x-2 hover:underline"
        >
          <Menu size={20} />
          <span>Menü</span>
        </button>

        {menuOpen && (
          <div className="absolute top-full left-0 mt-2 bg-gray-700 shadow-lg rounded w-40 z-50">
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="block px-4 py-2 hover:bg-gray-600"
                onClick={() => setMenuOpen(false)}
              >
                Admin Paneli
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/personeller"
                className="block px-4 py-2 hover:bg-gray-600"
                onClick={() => setMenuOpen(false)}
              >
                Personeller
              </Link>
            )}
            <Link
              to="/randevu-al"
              className="block px-4 py-2 hover:bg-gray-600"
              onClick={() => setMenuOpen(false)}
            >
              Randevu Al
            </Link>
            <Link
              to="/araclar"
              className="block px-4 py-2 hover:bg-gray-600"
              onClick={() => setMenuOpen(false)}
            >
              Parça Satın Al
            </Link>
            <Link
              to="/"
              className="block px-4 py-2 hover:bg-gray-600"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </div>
        )}
      </div>

      {/* ORTA: Home Butonu */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link
          to="/"
          className="text-white font-semibold text-lg hover:underline"
        >
          Home
        </Link>
      </div>

      {/* SAĞ: Auth */}
      <div className="flex items-center space-x-4">
        {user && (
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>
        )}
        {user ? (
          <button onClick={logout} className="hover:underline">
            Logout
          </button>
        ) : (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
