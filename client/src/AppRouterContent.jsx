import React, { useContext, useEffect, useState } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import { OrdersContext } from "./contexts/orders.context";
import InventoryPage from "./pages/InventoryPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import DemoControls from "./components/DemoControls.jsx";
import { useQuery } from "react-query";
import { authenticateUser } from "./api/authenticationAPI.js";
import { AuthContext } from "./contexts/AuthContext.jsx";
import ScaleLoader from "react-spinners/ScaleLoader.js";
import MoonLoader from "react-spinners/MoonLoader";
import OrderedDeliveredPopup from "./components/Inventory/popups/OrderedDeliveredPopup.jsx";
import Sidebar from "react-sidebar";
import SidebarContent from "./components/Sidebar/SidebarContent";

export default function AppRouterContent() {
  const { isLoggedIn, authLoading } = useContext(AuthContext);
  const { displayOrderedDeliveredPopup, setDisplayOrderedDeliveredPopup } =
    useContext(OrdersContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isDemo = params.get("demo") === "true";

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const sidebarStyles = {
    // background: "#787c82",
    position: "fixed",
    width: sidebarCollapsed ? "45px" : "185px",
    transition: "width .3s ease-in-out",
  };

  const sidebarContent = (
    <div>
      <SidebarContent onToggle={toggleSidebar} collapsed={sidebarCollapsed} />
    </div>
  );

  return (
    <>
      {displayOrderedDeliveredPopup && <OrderedDeliveredPopup />}
      {authLoading ? (
        <div className="scale-loader-container">
          <MoonLoader color={"orange"} loading={true} size={50} />
        </div>
      ) : (
        <>
          {isLoggedIn ? (
            <Sidebar
              sidebar={sidebarContent}
              open={true}
              docked={true}
              styles={{ sidebar: sidebarStyles }}
              pullRight={false}
            >
              <Routes>
                <Route path="/" element={<InventoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/*" element={<Navigate to="/" />} />
              </Routes>
              {(location.pathname === "/orders" ||
                location.pathname === "/" ||
                isDemo) && <DemoControls />}
            </Sidebar>
          ) : (
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={<Navigate to="/login" />} />
            </Routes>
          )}
        </>
      )}
    </>
  );
}
