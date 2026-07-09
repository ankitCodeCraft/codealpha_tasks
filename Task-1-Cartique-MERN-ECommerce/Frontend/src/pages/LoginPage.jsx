import API from "../api/api";
import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      console.log("Saved:", data);
      console.log(localStorage.getItem("userInfo"));

      console.log(data);

      alert("Login Successful");
      window.location.href = "/";
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 w-full max-w-md p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-400 mb-8">
           Continue your premium shopping experience.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-orange-500"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-300 font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-orange-500 font-semibold hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
