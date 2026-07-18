import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../api/admin";
import { searchUsers } from "../api/users";
import { getFeed } from "../api/posts";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Users,
  Image,
  MessageSquare,
  Bell,
  User,
  Clock,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import Spinner from "../components/ui/Spinner";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, postsRes] = await Promise.all([
        getDashboardStats(),
        searchUsers("", 1, 5), // Fetch top 5 newest users (we added sort to searchUsers!)
        getFeed(1, 5),         // Fetch top 5 newest posts
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }
      if (usersRes.success) {
        setRecentUsers(usersRes.data);
      }
      if (postsRes.success) {
        setRecentPosts(postsRes.data);
      }
    } catch (err) {
      toast.error("Failed to load admin dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) return <Spinner size="lg" />;

  const statCards = [
    {
      title: "Active Citizens",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
    },
    {
      title: "Green Discoveries",
      value: stats?.totalPosts || 0,
      icon: Image,
      color: "from-teal-500/10 to-teal-500/5 border-teal-500/20 text-teal-400",
    },
    {
      title: "Eco Discussions",
      value: stats?.totalComments || 0,
      icon: MessageSquare,
      color: "from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 text-cyan-400",
    },
    {
      title: "Alerts Dispatched",
      value: stats?.totalNotifications || 0,
      icon: Bell,
      color: "from-sky-500/10 to-sky-500/5 border-sky-500/20 text-sky-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-900">
        <div>
          <h1 className="font-outfit text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
            Admin Control Center
          </h1>
          <p className="text-xs text-slate-400">Monitor system statistics, registrations, and creations.</p>
        </div>
        <TrendingUp className="w-5 h-5 text-emerald-400" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass rounded-2xl p-4 border bg-gradient-to-br ${card.color} flex flex-col justify-between h-28 shadow-lg`}
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-extrabold uppercase tracking-wider">{card.title}</span>
                <Icon className="w-4 h-4" />
              </div>
              <span className="font-outfit text-3xl font-black tracking-tight text-white">
                {card.value}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Users & Recent Posts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Users column */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-3xl p-5 border border-slate-800 shadow-xl flex flex-col h-[400px]"
        >
          <h3 className="font-outfit text-sm font-black text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-900 pb-2">
            Recently Registered Citizens
          </h3>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
            {recentUsers.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-10">No users found.</p>
            ) : (
              recentUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/30 border border-slate-900/60 hover:border-slate-850 transition-colors"
                >
                  <Link to={`/profile/${u._id}`} className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                      {u.profilePhoto ? (
                        <img
                          src={`http://localhost:5000${u.profilePhoto}`}
                          alt={u.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs hover:underline truncate text-slate-200">{u.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">@{u.username}</p>
                    </div>
                  </Link>
                  <span className="text-[9px] text-slate-500 shrink-0 font-medium">
                    {formatDate(u.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Posts column */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-3xl p-5 border border-slate-800 shadow-xl flex flex-col h-[400px]"
        >
          <h3 className="font-outfit text-sm font-black text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-900 pb-2">
            Recent Ecological Actions
          </h3>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
            {recentPosts.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-10">No posts shared yet.</p>
            ) : (
              recentPosts.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/30 border border-slate-900/60 hover:border-slate-850 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Link
                      to={`/posts/${p._id}`}
                      className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shrink-0"
                    >
                      <img
                        src={`http://localhost:5000${p.image}`}
                        alt={p.caption}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-300 truncate font-semibold">
                        {p.caption || "(No caption)"}
                      </p>
                      <span className="text-[9px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                        <Clock className="w-3 h-3" />
                        {formatDate(p.createdAt)}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/posts/${p._id}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-colors cursor-pointer shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
