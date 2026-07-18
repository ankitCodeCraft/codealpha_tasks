import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(15, 23, 42, 0.9)",
            color: "#f3f4f6",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            fontSize: "12px",
            fontWeight: "600",
            borderRadius: "16px",
            backdropFilter: "blur(8px)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#030712",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#030712",
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
