import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNotifications } from "../api/notifications";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Heart, MessageSquare, UserPlus, User, AlertCircle } from "lucide-react";
import Spinner from "../components/ui/Spinner";

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const isToday = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
};

const isThisWeek = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = (now - d) / (1000 * 60 * 60 * 24);
  return diff < 7;
};

const getIcon = (type) => {
  switch (type) {
    case "like":
      return (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,48,64,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Heart style={{ width: 16, height: 16, fill: "var(--ig-red)", color: "var(--ig-red)" }} />
        </div>
      );
    case "comment":
      return (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(34,197,94,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MessageSquare style={{ width: 16, height: 16, color: "var(--ig-accent)" }} />
        </div>
      );
    case "follow":
      return (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(59,130,246,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <UserPlus style={{ width: 16, height: 16, color: "#3b82f6" }} />
        </div>
      );
    default:
      return (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--ig-surface-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Bell style={{ width: 16, height: 16, color: "var(--ig-text-muted)" }} />
        </div>
      );
  }
};

const getMessage = (type) => {
  switch (type) {
    case "like": return "liked your photo.";
    case "comment": return "commented on your post.";
    case "follow": return "started following you.";
    default: return "sent you a notification.";
  }
};

const NotifGroup = ({ label, items, onLoad }) => (
  <div style={{ marginBottom: 24 }}>
    <p
      style={{
        fontSize: 14,
        fontWeight: 700,
        color: "var(--ig-text)",
        padding: "8px 4px 12px",
      }}
    >
      {label}
    </p>
    <div>
      {items.map((notif, i) => (
        <motion.div
          key={notif._id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 4px",
            background: !notif.read ? "rgba(34,197,94,0.04)" : "transparent",
            borderRadius: 8,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--ig-surface-2)")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = !notif.read ? "rgba(34,197,94,0.04)" : "transparent")
          }
        >
          {/* Sender avatar */}
          <Link
            to={`/profile/${notif.sender?._id || notif.sender}`}
            style={{ position: "relative", flexShrink: 0, textDecoration: "none" }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                overflow: "hidden",
                background: "var(--ig-surface-3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {notif.sender?.profilePhoto ? (
                <img
                  src={`http://localhost:5000${notif.sender.profilePhoto}`}
                  alt={notif.sender?.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <User style={{ width: 20, height: 20, color: "var(--ig-text-muted)" }} />
              )}
            </div>
            {/* Type badge */}
            <div style={{ position: "absolute", bottom: -2, right: -4 }}>
              {getIcon(notif.type)}
            </div>
          </Link>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, color: "var(--ig-text)", lineHeight: 1.5 }}>
              <Link
                to={`/profile/${notif.sender?._id || notif.sender}`}
                style={{ fontWeight: 700, color: "var(--ig-text)", textDecoration: "none" }}
              >
                {notif.sender?.username || notif.sender?.name || "user"}
              </Link>{" "}
              <span style={{ color: "var(--ig-text)", fontWeight: 400 }}>
                {getMessage(notif.type)}
              </span>{" "}
              <span style={{ color: "var(--ig-text-muted)", fontSize: 13 }}>
                {timeAgo(notif.createdAt)}
              </span>
            </p>
          </div>

          {/* Post thumbnail */}
          {notif.post && (
            <Link
              to={`/posts/${notif.post._id || notif.post}`}
              style={{
                flexShrink: 0,
                width: 44,
                height: 44,
                borderRadius: 4,
                overflow: "hidden",
                background: "#000",
              }}
            >
              <img
                src={`http://localhost:5000${notif.post.image}`}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Link>
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifs = async (pageNumber, append = false) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);
      const res = await getNotifications(pageNumber, 10);
      if (res.success) {
        if (append) setNotifications((prev) => [...prev, ...res.data]);
        else setNotifications(res.data);
        setPage(res.page);
        setTotalPages(res.totalPages);
      }
    } catch {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNotifs(1, false);
  }, []);

  const todayItems = notifications.filter((n) => isToday(n.createdAt));
  const weekItems = notifications.filter(
    (n) => !isToday(n.createdAt) && isThisWeek(n.createdAt)
  );
  const olderItems = notifications.filter((n) => !isThisWeek(n.createdAt));

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          padding: "8px 4px 20px",
          borderBottom: "1px solid var(--ig-border)",
          marginBottom: 16,
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--ig-text)" }}>
          Notifications
        </h1>
      </div>

      {loading ? (
        <Spinner size="lg" />
      ) : notifications.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "2px solid var(--ig-border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell style={{ width: 28, height: 28, color: "var(--ig-text-muted)" }} />
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: "var(--ig-text)" }}>
            Activity On Your Posts
          </p>
          <p style={{ fontSize: 14, color: "var(--ig-text-muted)", maxWidth: 260 }}>
            When someone likes or comments on one of your posts, you'll see it here.
          </p>
        </div>
      ) : (
        <div>
          <AnimatePresence>
            {todayItems.length > 0 && (
              <NotifGroup label="Today" items={todayItems} />
            )}
            {weekItems.length > 0 && (
              <NotifGroup label="This Week" items={weekItems} />
            )}
            {olderItems.length > 0 && (
              <NotifGroup label="Earlier" items={olderItems} />
            )}
          </AnimatePresence>

          {page < totalPages && (
            <div style={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>
              <button
                onClick={() => fetchNotifs(page + 1, true)}
                disabled={loadingMore}
                className="ig-btn ig-btn-outline"
                style={{ fontSize: 13 }}
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
