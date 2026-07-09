import { Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

function AdminPage() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  if (!userInfo || !userInfo.user.isAdmin) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await API.get("/auth/dashboard", {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        setStats(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-10">
          <h1 className="text-5xl font-black text-white">Admin Dashboard</h1>

          <p className="text-gray-400 mt-3">
            Welcome back, {userInfo.user.name}
          </p>
        </div>

        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-orange-500 transition">
            <div className="text-5xl mb-4">📦</div>

            <h3 className="text-xl text-gray-400">Products</h3>

            <h2 className="text-4xl font-black text-white mt-3">
              {stats.products}
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-orange-500 transition">
            <div className="text-5xl mb-4">🛒</div>

            <h3 className="text-xl text-gray-400">Orders</h3>

            <h2 className="text-4xl font-black text-white mt-3">
              {stats.orders}
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-orange-500 transition">
            <div className="text-5xl mb-4">👥</div>

            <h3 className="text-xl text-gray-400">Users</h3>

            <h2 className="text-4xl font-black text-white mt-3">
              {stats.users}
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-orange-500 transition">
            <div className="text-5xl mb-4">💰</div>

            <h3 className="text-xl text-gray-400">Revenue</h3>

            <h2 className="text-4xl font-black text-orange-400 mt-3">
              ₹ {stats.revenue.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Management */}

        <div className="grid md:grid-cols-2 gap-8">
          <Link to="/admin/products">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-orange-500 hover:scale-[1.02] transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">📦 Products</h2>

                  <p className="text-gray-400 mt-3">
                    Add, edit and remove products.
                  </p>
                </div>

                <div className="text-5xl">→</div>
              </div>
            </div>
          </Link>

          <Link to="/admin/orders">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-orange-500 hover:scale-[1.02] transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">🛒 Orders</h2>

                  <p className="text-gray-400 mt-3">
                    Track and manage customer orders.
                  </p>
                </div>

                <div className="text-5xl">→</div>
              </div>
            </div>
          </Link>

          <Link to="/admin/users">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-orange-500 hover:scale-[1.02] transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">👥 Users</h2>

                  <p className="text-gray-400 mt-3">
                    View and manage registered users.
                  </p>
                </div>

                <div className="text-5xl">→</div>
              </div>
            </div>
          </Link>

          <Link to="/admin/create-product">
            <div className="bg-orange-500 rounded-3xl p-8 hover:bg-orange-600 hover:scale-[1.02] transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    ➕ Add Product
                  </h2>

                  <p className="text-orange-100 mt-3">Create a new product.</p>
                </div>

                <div className="text-5xl text-white">+</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
