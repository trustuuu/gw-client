import React, { useEffect, useState } from "react";
import RoutesMain from "./RoutesMain";
import Sidebar from "../component/Sidebar";
import SidebarApi from "../component/SidebarApi";
// import SidebarOrg from "../component/SidebarOrg";
import Header from "../component/Header";
import { useAuth } from "../component/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingWrapper from "../component/LoadingWrapper";
import SidebarApplications from "../component/SidebarApplication";
import { setNavigate } from "../component/navigate";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const renderSidebar = () => {
    if (!user) return null;
    if (location.pathname.startsWith("/apis-")) {
      return (
        <SidebarApi sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      );
    } else if (location.pathname.startsWith("/applications-")) {
      return (
        <SidebarApplications
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );
    } else {
      return (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      );
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate); // Set it once on app load
  }, [navigate]);

  useEffect(() => {
    if (localStorage.theme === "dark" || !("theme" in localStorage)) {
      document.querySelector("html").classList.add("dark");
      document.querySelector("html").style.colorScheme = "dark";
      console.log("dark mode");
    } else {
      document.querySelector("html").classList.remove("dark");
      document.querySelector("html").style.colorScheme = "light";
      console.log("light mode");
    }

    if (localStorage.getItem("sidebar-expanded") === "true") {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }

    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }); // triggered on route change

  return (
    <div className="font-geist flex h-screen overflow-hidden">
      {/* {user ? (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      ) : null} */}
      {renderSidebar()}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="font-geist px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <LoadingWrapper>
            <RoutesMain />
          </LoadingWrapper>
        </div>
      </div>
    </div>
  );
}

export default Layout;
