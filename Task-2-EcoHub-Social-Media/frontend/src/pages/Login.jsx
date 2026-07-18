import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Leaf, LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await login(email, password);
    if (res.success) {
      toast.success("Welcome back to EcoHub! 🌱");
    } else {
      toast.error(res.message || "Invalid credentials.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "var(--ig-bg)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Premium Mesh Gradient Background */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "70vw",
          height: "70vh",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "80vw",
          height: "80vh",
          background: "radial-gradient(circle, rgba(52, 211, 153, 0.08) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
        }}
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          zIndex: 10,
          width: "100%",
          maxWidth: 440, // Sleeker width
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "var(--ig-surface)",
            padding: "48px 40px",
            borderRadius: 24,
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 30px 60px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.03)", // Ultra smooth shadow
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "var(--ig-text)", // Sleek dark logo
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 20px rgba(15, 23, 42, 0.15)",
              }}
            >
              <Leaf style={{ width: 28, height: 28, color: "#fff" }} />
            </motion.div>
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 800, color: "var(--ig-text)", textAlign: "center", marginBottom: 8, letterSpacing: "-0.5px" }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: 15, color: "var(--ig-text-secondary)", textAlign: "center", marginBottom: 32 }}>
            Sign in to continue to EcoHub
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ig-text)", marginBottom: 8 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="ig-input"
                style={{
                  border: errors.email ? "1px solid var(--ig-red)" : "1px solid rgba(0,0,0,0.1)",
                }}
              />
              {errors.email && <p style={{ fontSize: 13, color: "var(--ig-red)", marginTop: 6, fontWeight: 500 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ig-text)", marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="ig-input"
                style={{
                  border: errors.password ? "1px solid var(--ig-red)" : "1px solid rgba(0,0,0,0.1)",
                }}
              />
              {errors.password && <p style={{ fontSize: 13, color: "var(--ig-red)", marginTop: 6, fontWeight: 500 }}>{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="ig-btn ig-btn-primary"
              style={{
                width: "100%",
                padding: "14px",
                marginTop: 8,
                fontSize: 15,
                borderRadius: 12,
              }}
            >
              {isLoading ? "Signing in..." : (
                <>
                  <span>Sign In</span>
                  <LogIn style={{ width: 18, height: 18 }} />
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 14, color: "var(--ig-text-secondary)", marginTop: 32 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--ig-text)", fontWeight: 700, textDecoration: "none" }}>
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
