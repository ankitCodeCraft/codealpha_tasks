import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getFeed, deletePost, likePost, unlikePost } from "../api/posts";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Trash2,
  User,
  MoreHorizontal,
  Bookmark,
  Send,
  Smile,
  AlertCircle,
} from "lucide-react";
import Spinner from "../components/ui/Spinner";

/* ─── helpers ──────────────────────────────────────────── */
const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

/* ─── Story bubble ─────────────────────────────────────── */
const StoryBubble = ({ src, label, isOwn, hasStory = true }) => (
  <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
    <div
      style={{
        padding: hasStory ? 2 : 0,
        borderRadius: "50%",
        background: hasStory
          ? "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)"
          : "var(--ig-border-light)",
      }}
    >
      <div
        style={{
          padding: 2,
          borderRadius: "50%",
          background: "var(--ig-bg)",
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            overflow: "hidden",
            background: "var(--ig-surface-3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {src ? (
            <img
              src={src}
              alt={label}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <User
              style={{ width: 24, height: 24, color: "var(--ig-text-muted)" }}
            />
          )}
        </div>
      </div>
    </div>
    <span
      style={{
        fontSize: 11,
        color: "var(--ig-text)",
        maxWidth: 66,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        textAlign: "center",
      }}
    >
      {isOwn ? "Your story" : label}
    </span>
  </div>
);

/* ─── Post card ────────────────────────────────────────── */
const PostCard = ({ post, currentUserId, isAdmin, onLike, onDelete }) => {
  const [showHeart, setShowHeart] = useState(false);
  const [heartAnimKey, setHeartAnimKey] = useState(0);
  const [heartBtnAnimating, setHeartBtnAnimating] = useState(false);
  const lastTap = useRef(0);

  const hasLiked = post.likes?.includes(currentUserId);
  const isOwner =
    post.user?._id === currentUserId || post.user === currentUserId;

  const triggerHeartAnim = () => {
    setHeartAnimKey((k) => k + 1);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 900);
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 350) {
      // double tap
      if (!hasLiked) {
        onLike(post._id, false);
      }
      triggerHeartAnim();
    }
    lastTap.current = now;
  };

  const handleHeartBtn = () => {
    setHeartBtnAnimating(true);
    setTimeout(() => setHeartBtnAnimating(false), 500);
    onLike(post._id, hasLiked);
  };

  return (
    <article
      className="ig-card"
      style={{
        maxWidth: 470,
        margin: "0 auto 24px",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
        }}
      >
        <Link
          to={`/profile/${post.user?._id || post.user}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          {/* Avatar with story ring */}
          <div
            style={{
              padding: 2,
              borderRadius: "50%",
              background:
                "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                padding: 2,
                borderRadius: "50%",
                background: "var(--ig-bg)",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "var(--ig-surface-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {post.user?.profilePhoto ? (
                  <img
                    src={`http://localhost:5000${post.user.profilePhoto}`}
                    alt={post.user?.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <User
                    style={{ width: 16, height: 16, color: "var(--ig-text-muted)" }}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--ig-text)",
                lineHeight: 1.2,
              }}
            >
              {post.user?.name || "Eco Citizen"}
            </p>
            <p style={{ fontSize: 11, color: "var(--ig-text-muted)" }}>
              {post.user?.username ? `@${post.user.username}` : ""}
            </p>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {(isOwner || isAdmin) && (
            <button
              onClick={() => onDelete(post._id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--ig-text-muted)",
                padding: 4,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                transition: "color 0.15s",
              }}
              title="Delete"
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ff3040")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--ig-text-muted)")
              }
            >
              <Trash2 style={{ width: 16, height: 16 }} />
            </button>
          )}
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ig-text)",
              padding: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            <MoreHorizontal style={{ width: 20, height: 20 }} />
          </button>
        </div>
      </div>

      {/* Image with double-tap */}
      <div
        style={{ position: "relative", background: "var(--ig-surface-3)", cursor: "pointer" }}
        onClick={handleDoubleTap}
      >
        <Link to={`/posts/${post._id}`} style={{ display: "block" }}>
          <img
            src={`http://localhost:5000${post.image}`}
            alt={post.caption || "EcoHub Post"}
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Link>

        {/* Double tap heart overlay */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              key={heartAnimKey}
              className="heart-overlay"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.2, opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 30,
              }}
            >
              <Heart
                style={{
                  width: 90,
                  height: 90,
                  fill: "#fff",
                  color: "#fff",
                  filter: "drop-shadow(0 0 12px rgba(255,255,255,0.5))",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action bar */}
      <div style={{ padding: "8px 16px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Like */}
            <button
              onClick={handleHeartBtn}
              className={heartBtnAnimating ? "heart-pop" : ""}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                lineHeight: 1,
              }}
            >
              <Heart
                style={{
                  width: 26,
                  height: 26,
                  fill: hasLiked ? "var(--ig-red)" : "none",
                  color: hasLiked ? "var(--ig-red)" : "var(--ig-text)",
                  strokeWidth: 1.8,
                  transition: "fill 0.15s, color 0.15s",
                }}
              />
            </button>
            {/* Comment */}
            <Link to={`/posts/${post._id}`} style={{ color: "var(--ig-text)", display: "flex", alignItems: "center" }}>
              <MessageCircle style={{ width: 26, height: 26, strokeWidth: 1.8 }} />
            </Link>
            {/* Share (decorative) */}
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--ig-text)",
                display: "flex",
                alignItems: "center",
                padding: 0,
              }}
            >
              <Send style={{ width: 24, height: 24, strokeWidth: 1.8, transform: "rotate(-10deg)" }} />
            </button>
          </div>
          {/* Bookmark (decorative) */}
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ig-text)",
              display: "flex",
              alignItems: "center",
              padding: 0,
            }}
          >
            <Bookmark style={{ width: 24, height: 24, strokeWidth: 1.8 }} />
          </button>
        </div>

        {/* Like count */}
        {(post.likes?.length || 0) > 0 && (
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ig-text)", marginBottom: 4 }}>
            {post.likes.length.toLocaleString()} like{post.likes.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Caption */}
        {post.caption && (
          <p style={{ fontSize: 14, color: "var(--ig-text)", marginBottom: 4, lineHeight: 1.5 }}>
            <Link
              to={`/profile/${post.user?._id || post.user}`}
              style={{ fontWeight: 700, color: "var(--ig-text)", textDecoration: "none", marginRight: 6 }}
            >
              {post.user?.username || "user"}
            </Link>
            {post.caption}
          </p>
        )}

        {/* Comment count */}
        {(post.commentsCount || 0) > 0 && (
          <Link
            to={`/posts/${post._id}`}
            style={{
              fontSize: 13,
              color: "var(--ig-text-muted)",
              display: "block",
              marginBottom: 4,
              textDecoration: "none",
            }}
          >
            View all {post.commentsCount} comment{post.commentsCount !== 1 ? "s" : ""}
          </Link>
        )}

        {/* Timestamp */}
        <p
          style={{
            fontSize: 10,
            color: "var(--ig-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            paddingBottom: 12,
            marginTop: 2,
          }}
        >
          {timeAgo(post.createdAt)}
        </p>
      </div>
    </article>
  );
};

/* ─── HOME PAGE ─────────────────────────────────────────── */
const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const currentUserId = user?.id || user?._id;
  const isAdmin = user?.role === "admin";

  const fetchFeed = async (pageNumber, append = false) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await getFeed(pageNumber, 8);
      if (res.success) {
        if (append) setPosts((prev) => [...prev, ...res.data]);
        else setPosts(res.data);
        setPage(res.page);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      toast.error("Failed to load feed.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchFeed(1, false);
  }, []);

  const handleLikeToggle = async (postId, alreadyLiked) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post._id !== postId) return post;
        const newLikes = alreadyLiked
          ? post.likes.filter((id) => id !== currentUserId)
          : [...post.likes, currentUserId];
        return { ...post, likes: newLikes };
      })
    );

    try {
      if (alreadyLiked) await unlikePost(postId);
      else await likePost(postId);
    } catch {
      toast.error("Action failed, syncing feed...");
      fetchFeed(1, false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const res = await deletePost(postId);
      if (res.success) {
        toast.success("Post deleted.");
        setPosts((prev) => prev.filter((p) => p._id !== postId));
      }
    } catch {
      toast.error("Failed to delete post.");
    }
  };

  const avatarSrc = user?.profilePhoto
    ? `http://localhost:5000${user.profilePhoto}`
    : null;

  return (
    <div style={{ maxWidth: 470, margin: "0 auto" }}>
      {/* ── Stories strip ─────────────────────────────── */}
      <div
        style={{
          borderBottom: "1px solid var(--ig-border)",
          marginBottom: 0,
        }}
      >
        <div className="stories-strip" style={{ padding: "12px 4px 16px" }}>
          {/* Own story */}
          <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
            <div
              style={{
                position: "relative",
                width: 66,
                height: 66,
                borderRadius: "50%",
              }}
            >
              <div
                style={{
                  width: 66,
                  height: 66,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "var(--ig-surface-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--ig-border-light)",
                }}
              >
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <User style={{ width: 26, height: 26, color: "var(--ig-text-muted)" }} />
                )}
              </div>
              <Link
                to="/create"
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "var(--ig-accent)",
                  border: "2px solid var(--ig-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: "#000",
                    lineHeight: 1,
                    marginTop: -1,
                  }}
                >
                  +
                </span>
              </Link>
            </div>
            <span
              style={{
                fontSize: 11,
                color: "var(--ig-text)",
                maxWidth: 66,
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Your story
            </span>
          </div>

          {/* Other users from posts (unique) */}
          {[
            ...new Map(
              posts
                .filter((p) => p.user && p.user._id !== currentUserId)
                .map((p) => [p.user._id, p.user])
            ).values(),
          ]
            .slice(0, 12)
            .map((u) => (
              <StoryBubble
                key={u._id}
                src={u.profilePhoto ? `http://localhost:5000${u.profilePhoto}` : null}
                label={u.username || u.name}
                hasStory
              />
            ))}
        </div>
      </div>

      {/* ── Feed ──────────────────────────────────────── */}
      {loading ? (
        <Spinner size="lg" />
      ) : posts.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 24px",
            gap: 16,
            textAlign: "center",
          }}
        >
          <AlertCircle style={{ width: 48, height: 48, color: "var(--ig-text-muted)" }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--ig-text)" }}>
            Your feed is empty
          </p>
          <p style={{ fontSize: 14, color: "var(--ig-text-muted)" }}>
            Follow people or be the first to share an eco-discovery!
          </p>
          <Link
            to="/create"
            className="ig-btn ig-btn-primary"
            style={{ marginTop: 8, borderRadius: 8, padding: "10px 24px" }}
          >
            Share a post
          </Link>
        </div>
      ) : (
        <div>
          <AnimatePresence>
            {posts.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: i < 4 ? i * 0.05 : 0 }}
              >
                <PostCard
                  post={post}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  onLike={handleLikeToggle}
                  onDelete={handleDeletePost}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Load More */}
          {page < totalPages && (
            <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
              <button
                onClick={() => fetchFeed(page + 1, true)}
                disabled={loadingMore}
                className="ig-btn ig-btn-outline"
                style={{ fontSize: 13, padding: "8px 24px" }}
              >
                {loadingMore ? "Loading..." : "Load more posts"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
