import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase"; // Adjusted import for Firebase
import { signOut, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null); // Track user state

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Check user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out successfully!");
  };

  return (
    <div>
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <div className="text-lg font-bold cursor-pointer">Admin Panel</div>
            </Link>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="hover:text-gray-400">
              User Management
            </Link>
            <Link to="/analytics" className="hover:text-gray-400">
              Analytics
            </Link>
            {user ? (
              <button onClick={handleLogout} className="hover:text-gray-400">
                Logout
              </button>
            ) : (
              <Link to="/login" className="hover:text-gray-400">
                Login
              </Link>
            )}
          </div>
          <button className="md:hidden" onClick={toggleSidebar}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      >
        <div
          className={`fixed right-0 top-0 w-64 bg-gray-900 text-white transition-transform transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center p-4">
            <span className="text-lg font-bold">Admin Panel</span>
            <button className="ml-auto" onClick={closeSidebar}>
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col p-4 space-y-2">
            <Link to="/" className="hover:text-gray-400" onClick={closeSidebar}>
              User Management
            </Link>
            <Link to="/analytics" className="hover:text-gray-400" onClick={closeSidebar}>
              Analytics
            </Link>
            {user ? (
              <button onClick={handleLogout} className="hover:text-gray-400" onClick={closeSidebar}>
                Logout
              </button>
            ) : (
              <Link to="/login" className="hover:text-gray-400" onClick={closeSidebar}>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
