import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";

function Layout() {
  const location = useLocation();
  const storedUser = useSelector((state) => state.auth.user);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
