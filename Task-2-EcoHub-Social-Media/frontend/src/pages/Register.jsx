import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Leaf, UserPlus } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!username.trim()) e.username = "Username is required";
    else if (username.length < 3) e.username = "Minimum 3 characters";
    else if (!/^[a-zA-Z0-9_]+$/.test(username))
      e.username = "Letters, numbers, and underscores only";
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
    setSubmitting(true);
    try {
      const res = await register({ name, username, email, password });
      if (res.success) {
        toast.success("Account created! Please sign in. 🌱");
        navigate("/login");
      } else {
        toast.error(res.message || "Registration failed.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
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
          maxWidth: 480,
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "var(--ig-surface)",
            padding: "48px 40px",
            borderRadius: 24,
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 30px 60px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.03)",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "var(--ig-text)",
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
            Join EcoHub
          </h2>
          <p style={{ fontSize: 15, color: "var(--ig-text-secondary)", textAlign: "center", marginBottom: 28 }}>
            Create an account to start your eco-journey
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            
            <div style={{ display: "flex", gap: 16 }}>
              {/* Name */}
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ig-text)", marginBottom: 6 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="ig-input"
                  style={{
                    border: errors.name ? "1px solid var(--ig-red)" : "1px solid rgba(0,0,0,0.1)",
                  }}
                />
                {errors.name && <p style={{ fontSize: 12, color: "var(--ig-red)", marginTop: 4, fontWeight: 500 }}>{errors.name}</p>}
              </div>

              {/* Username */}
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ig-text)", marginBottom: 6 }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="janedoe"
                  className="ig-input"
                  style={{
                    border: errors.username ? "1px solid var(--ig-red)" : "1px solid rgba(0,0,0,0.1)",
                  }}
                />
                {errors.username && <p style={{ fontSize: 12, color: "var(--ig-red)", marginTop: 4, fontWeight: 500 }}>{errors.username}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ig-text)", marginBottom: 6 }}>
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
              {errors.email && <p style={{ fontSize: 12, color: "var(--ig-red)", marginTop: 4, fontWeight: 500 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ig-text)", marginBottom: 6 }}>
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
              {errors.password && <p style={{ fontSize: 12, color: "var(--ig-red)", marginTop: 4, fontWeight: 500 }}>{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="ig-btn ig-btn-primary"
              style={{
                width: "100%",
                padding: "14px",
                marginTop: 12,
                fontSize: 15,
                borderRadius: 12,
              }}
            >
              {submitting ? "Creating account..." : (
                <>
                  <span>Create Account</span>
                  <UserPlus style={{ width: 18, height: 18 }} />
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 14, color: "var(--ig-text-secondary)", marginTop: 28 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--ig-text)", fontWeight: 700, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
