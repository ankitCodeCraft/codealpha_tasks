import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      setUser(userInfo);

      if (userInfo.user.isAdmin) {
        window.addEventListener("beforeunload", () => {
          localStorage.removeItem("userInfo");
        });
      }
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");

    window.location.reload();
  };

  return (
    <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-md px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex flex-col">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-5xl">🛍️</span>

          <div>
            <h1
              className="
text-5xl
font-black
tracking-tight
bg-linear-to-r
from-orange-500
via-red-500
to-orange-600
bg-clip-text
text-transparent
"
            >
              Cartique
            </h1>

            <p
              className="
text-sm
text-gray-500
italic
tracking-wide
ml-1
"
            >
              Everything You Love, Delivered.
            </p>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <div className="flex items-center gap-6 text-gray-200 font-medium">
        <Link to="/" className="hover:text-orange-500 transition">
          Home
        </Link>

        <Link to="/cart" className="hover:text-orange-500 transition">
          Cart
        </Link>

        {user ? (
          <>
            <Link to="/profile" className="hover:text-orange-500 transition">
              Profile
            </Link>

            <Link to="/myorders" className="hover:text-orange-500 transition">
              My Orders
            </Link>

            {user.user?.isAdmin && (
              <Link to="/admin" className="hover:text-orange-500 transition">
                Admin
              </Link>
            )}

            <button
              onClick={logoutHandler}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-orange-500 transition">
              Login
            </Link>

            <Link
              to="/register"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
