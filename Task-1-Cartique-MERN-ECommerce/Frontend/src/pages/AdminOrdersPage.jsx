import { useEffect, useMemo, useState } from "react";
import API from "../api/api";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const { data } = await API.get("/orders", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  const markDelivered = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await API.put(
        `/orders/${id}/deliver`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id
            ? {
                ...order,
                isDelivered: true,
              }
            : order,
        ),
      );

      alert("Order marked as delivered");
    } catch (error) {
      console.log(error);
      alert("Failed to update order");
    }
  };

  const markPaid = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await API.put(
        `/orders/${id}/pay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id
            ? {
                ...order,
                isPaid: true,
              }
            : order,
        ),
      );

      alert("Order marked as paid");
    } catch (error) {
      console.log(error);
      alert("Failed to update order");
    }
  };

  const filteredOrders = useMemo(() => {
    let data = [...orders];

    data.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );

    if (filter === "Paid") {
      data = data.filter((o) => o.isPaid);
    }

    if (filter === "Pending") {
      data = data.filter((o) => !o.isPaid);
    }

    if (filter === "Delivered") {
      data = data.filter((o) => o.isDelivered);
    }

    if (filter === "Processing") {
      data = data.filter((o) => !o.isDelivered);
    }

    if (search.trim()) {
      const term = search.toLowerCase();

      data = data.filter(
        (o) =>
          o.user?.name?.toLowerCase().includes(term) ||
          o.user?.email?.toLowerCase().includes(term) ||
          o._id.toLowerCase().includes(term),
      );
    }

    return data;
  }, [orders, search, filter]);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-10">
          <h1 className="text-5xl font-black text-white">Manage Orders</h1>

          <p className="text-gray-400 mt-3">View and manage customer orders.</p>
        </div>

        {/* Search */}

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by Order ID, Name or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-orange-500"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
          >
            <option className="bg-slate-900">All</option>
            <option className="bg-slate-900">Paid</option>
            <option className="bg-slate-900">Pending</option>
            <option className="bg-slate-900">Delivered</option>
            <option className="bg-slate-900">Processing</option>
          </select>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-20 text-center">
            <h2 className="text-3xl font-bold text-white">No Orders Found</h2>

            <p className="text-gray-400 mt-3">No orders match your search.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-orange-500/40 transition"
              >
                {/* Top */}

                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Order #{order._id.slice(-8)}
                    </h2>

                    <p className="text-gray-400 mt-2">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <div className="mt-5 space-y-2">
                      <p className="text-white font-semibold">
                        👤 {order.user?.name}
                      </p>

                      <p className="text-gray-400">{order.user?.email}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <h2 className="text-4xl font-black text-orange-400">
                      ₹ {order.totalPrice.toLocaleString()}
                    </h2>
                  </div>
                </div>

                {/* Status */}

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <p className="text-gray-400 mb-3">Payment Status</p>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        order.isPaid
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </div>

                  <div>
                    <p className="text-gray-400 mb-3">Delivery Status</p>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        order.isDelivered
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Processing"}
                    </span>
                  </div>
                </div>

                {/* Buttons */}

                <div className="flex flex-wrap gap-4 mt-8">
                  {!order.isPaid && (
                    <button
                      onClick={() => markPaid(order._id)}
                      className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-semibold transition"
                    >
                      Mark as Paid
                    </button>
                  )}

                  {!order.isDelivered && (
                    <button
                      onClick={() => markDelivered(order._id)}
                      className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl text-white font-semibold transition"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrdersPage;
