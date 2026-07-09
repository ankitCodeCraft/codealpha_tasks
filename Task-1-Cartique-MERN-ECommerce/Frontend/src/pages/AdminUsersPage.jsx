import { useEffect, useMemo, useState } from "react";
import API from "../api/api";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const currentUser = JSON.parse(localStorage.getItem("userInfo")).user;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const { data } = await API.get("/auth/users", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const sortedUsers = data.sort((a, b) => b.isAdmin - a.isAdmin);

      setUsers(sortedUsers);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await API.delete(`/auth/users/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      alert("User deleted");

      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const toggleAdmin = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const { data } = await API.put(
        `/auth/users/${id}/admin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      alert(data.message);

      setUsers((prev) =>
        prev
          .map((user) =>
            user._id === id
              ? {
                  ...user,
                  isAdmin: !user.isAdmin,
                }
              : user,
          )
          .sort((a, b) => b.isAdmin - a.isAdmin),
      );
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const filteredUsers = useMemo(() => {
    let data = [...users];

    if (filter === "Admin") {
      data = data.filter((user) => user.isAdmin);
    }

    if (filter === "User") {
      data = data.filter((user) => !user.isAdmin);
    }

    if (search.trim()) {
      const term = search.toLowerCase();

      data = data.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term),
      );
    }

    return data;
  }, [users, search, filter]);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-10">
          <h1 className="text-5xl font-black text-white">Manage Users</h1>

          <p className="text-gray-400 mt-3">
            View and manage registered users.
          </p>
        </div>

        {/* Search */}

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by name or email..."
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
            <option className="bg-slate-900">Admin</option>
            <option className="bg-slate-900">User</option>
          </select>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-20 text-center">
            <h2 className="text-3xl font-bold text-white">No Users Found</h2>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-orange-500/40 transition"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-2xl font-black text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {user.name}
                      </h2>

                      <p className="text-gray-400 mt-1">{user.email}</p>
                    </div>
                  </div>

                  <span
                    className={`px-5 py-2 rounded-full font-semibold ${
                      user.isAdmin
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {user.isAdmin ? "Admin" : "User"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <button
                    disabled={user._id === currentUser._id}
                    onClick={() => toggleAdmin(user._id)}
                    className={`px-6 py-3 rounded-xl font-semibold transition ${
                      user._id === currentUser._id
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : user.isAdmin
                          ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {user.isAdmin ? "Remove Admin" : "Make Admin"}
                  </button>

                  <button
                    disabled={user._id === currentUser._id}
                    onClick={() => deleteUser(user._id)}
                    className={`px-6 py-3 rounded-xl font-semibold transition ${
                      user._id === currentUser._id
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    Delete User
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;
