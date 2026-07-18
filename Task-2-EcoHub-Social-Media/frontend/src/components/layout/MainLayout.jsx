import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  PlusSquare,
  Bell,
  User,
  Shield,
  LogOut,
  Leaf
} from "lucide-react";

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Search", path: "/search", icon: Search },
    { name: "Create", path: "/create", icon: PlusSquare },
    { name: "Notifications", path: "/notifications", icon: Bell },
    { name: "Profile", path: `/profile/${user?.id || user?._id}`, icon: User },
  ];

  if (user?.role === "admin") {
    menuItems.push({ name: "Admin", path: "/admin", icon: Shield });
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const avatarSrc = user?.profilePhoto
    ? `http://localhost:5000${user.profilePhoto}`
    : null;

  return (
    <div
      className="min-h-screen flex relative overflow-x-hidden"
    >
      {/* Ultra-Premium Mesh Background (Subtle) */}
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "fixed",
          top: "-20%",
          left: "-10%",
          width: "70vw",
          height: "70vh",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "fixed",
          bottom: "-20%",
          right: "-10%",
          width: "80vw",
          height: "80vh",
          background: "radial-gradient(circle, rgba(52, 211, 153, 0.05) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LEFT SIDEBAR — Desktop
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <aside
        className="hidden md:flex flex-col fixed top-0 left-0 h-full z-40"
        style={{
          width: "var(--sidebar-width)",
          borderRight: "1px solid var(--ig-border)",
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          padding: "16px 0",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 px-6 py-4 mb-6"
          style={{ textDecoration: "none" }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{
              width: 36,
              height: 36,
              background: "var(--ig-text)", // Pure dark sleek logo
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
            }}
          >
            <Leaf className="w-5 h-5" style={{ color: "#fff" }} />
          </motion.div>
          <span
            style={{
              fontWeight: 800,
              fontSize: 22,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "-0.5px",
              color: "var(--ig-text)",
            }}
          >
            EcoHub
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1 mt-2">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            const isProfileItem = item.name === "Profile";

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-item ${active ? "active" : ""}`}
              >
                {isProfileItem && avatarSrc ? (
                  <div
                    className="shrink-0"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: active
                        ? "2px solid var(--ig-text)"
                        : "2px solid transparent",
                      boxShadow: active ? "none" : "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    <img
                      src={avatarSrc}
                      alt={user?.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <Icon
                    className="shrink-0"
                    style={{
                      width: 22,
                      height: 22,
                      strokeWidth: active ? 2.5 : 2,
                    }}
                  />
                )}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card + Logout */}
        <div className="px-4 mt-4 space-y-2 mb-4">
          {/* User preview */}
          <div
            className="flex items-center gap-3 px-3 py-3 rounded-2xl"
            style={{ 
              background: "var(--ig-surface)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
              border: "1px solid var(--ig-border)",
            }}
          >
            <div
              className="shrink-0"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                overflow: "hidden",
                background: "var(--ig-surface-3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <User className="w-4 h-4" style={{ color: "var(--ig-text-muted)" }} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ig-text)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--ig-text-muted)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                @{user?.username}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="nav-item w-full"
            style={{ color: "var(--ig-red)" }}
          >
            <LogOut style={{ width: 20, height: 20, strokeWidth: 2 }} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MOBILE TOP BAR
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 z-50"
        style={{
          height: 60,
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid var(--ig-border)",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }} className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-lg shrink-0"
            style={{
              width: 28,
              height: 28,
              background: "var(--ig-text)",
              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.15)",
            }}
          >
            <Leaf className="w-4 h-4" style={{ color: "#fff" }} />
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: 20,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "-0.5px",
              color: "var(--ig-text)",
            }}
          >
            EcoHub
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/notifications" style={{ color: "var(--ig-text)" }}>
            <Bell className="w-6 h-6" />
          </Link>
          <Link to="/create" style={{ color: "var(--ig-text)" }}>
            <PlusSquare className="w-6 h-6" />
          </Link>
        </div>
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MAIN CONTENT
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <main
        className="flex-1 flex justify-center relative z-10"
        style={{ marginLeft: 0, paddingTop: 0 }}
      >
        <div className="hidden md:block shrink-0" style={{ width: "var(--sidebar-width)" }} />
        <div
          className="w-full"
          style={{
            maxWidth: 600, // Reduced max-width for more premium minimalist feel (Instagram style width)
            paddingTop: 40,
            paddingBottom: 100,
            paddingLeft: 20,
            paddingRight: 20,
            marginTop: 0,
          }}
        >
          <div className="md:hidden" style={{ height: 60 }} />
          {children}
        </div>
      </main>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MOBILE BOTTOM NAV
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around z-50"
        style={{
          height: 60,
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "1px solid var(--ig-border)",
        }}
      >
        {menuItems.slice(0, 5).map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          const isProfileItem = item.name === "Profile";

          return (
            <Link
              key={item.name}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 12px",
                color: active ? "var(--ig-text)" : "var(--ig-text-muted)",
              }}
            >
              {isProfileItem && avatarSrc ? (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: active ? "2px solid var(--ig-text)" : "none",
                  }}
                >
                  <img
                    src={avatarSrc}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ) : (
                <Icon
                  style={{
                    width: 24,
                    height: 24,
                    strokeWidth: active ? 2.5 : 2,
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MainLayout;
