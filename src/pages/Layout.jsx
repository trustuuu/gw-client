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
import SidebarUsers from "../component/SidebarUser";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isInitialized } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // if (isLoading) {
  //   return (
  //     <div className="h-screen w-screen flex items-center justify-center">
  //       Loading...
  //     </div>
  //   );
  // }

  const isChatRoute = location.pathname.startsWith("/chatbot");
  const renderSidebar = () => {
    if (!user) {
      return null;
    }
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
    } else if (location.pathname.startsWith("/users-")) {
      return (
        <SidebarUsers
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

  useEffect(() => {
    setNavigate(navigate); // Set it once on app load
  }, [navigate, user, isInitialized]);

  useEffect(() => {
    if (localStorage.theme === "dark" || !("theme" in localStorage)) {
      document.querySelector("html").classList.add("dark");
      document.querySelector("html").style.colorScheme = "dark";
    } else {
      document.querySelector("html").classList.remove("dark");
      document.querySelector("html").style.colorScheme = "light";
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
      <div className="relative flex flex-col flex-1 min-w-0">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div
          className={`font-geist px-4 w-full flex-1 overflow-y-auto overflow-x-hidden ${
            isChatRoute ? "overflow-y-hidden" : "overflow-y-auto"
          }`}
        >
          <LoadingWrapper>
            <RoutesMain />
          </LoadingWrapper>
        </div>
      </div>
    </div>
  );
}

export default Layout;
