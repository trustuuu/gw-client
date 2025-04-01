import React, { useEffect, useState } from "react";
import RoutesMain from "./RoutesMain";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import { useAuth } from "../component/AuthContext";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

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
    <div className="flex h-screen overflow-hidden">
      {user ? (
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      ) : null}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <RoutesMain />
        </div>
      </div>
    </div>
  );
}

export default Layout;
