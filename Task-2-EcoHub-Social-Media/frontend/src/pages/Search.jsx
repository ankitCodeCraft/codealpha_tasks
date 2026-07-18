import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { searchUsers, followUser, unfollowUser } from "../api/users";
import { searchPosts } from "../api/posts";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search as SearchIcon,
  User as UserIcon,
  Heart,
  MessageSquare,
  UserPlus,
  UserCheck,
} from "lucide-react";
import Spinner from "../components/ui/Spinner";

const Search = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("posts"); // Start on explore/posts
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [explorePosts, setExplorePosts] = useState([]);
  const [exploreLoading, setExploreLoading] = useState(false);

  // Load explore posts on mount
  useEffect(() => {
    const loadExplore = async () => {
      try {
        setExploreLoading(true);
        const res = await searchPosts("", 1, 18);
        if (res.success) setExplorePosts(res.data);
      } catch {}
      finally { setExploreLoading(false); }
    };
    loadExplore();
  }, []);

  const performSearch = async (searchQuery, targetTab, pageNumber, append = false) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      let res;
      if (targetTab === "users") {
        res = await searchUsers(searchQuery, pageNumber, 10);
      } else {
        res = await searchPosts(searchQuery, pageNumber, 10);
      }

      if (res.success) {
        if (append) setResults((prev) => [...prev, ...res.data]);
        else setResults(res.data);
        setPage(res.page);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      toast.error("Search failed.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch(query, activeTab, 1, false);
  };

  useEffect(() => {
    if (query.trim()) performSearch(query, activeTab, 1, false);
  }, [activeTab]);

  const handleFollowToggle = async (targetUserId, currentlyFollowing) => {
    const currentUserId = user?.id || user?._id;
    setResults((prev) =>
      prev.map((u) => {
        if (u._id !== targetUserId) return u;
        const newFollowers = currentlyFollowing
          ? u.followers.filter((id) => id !== currentUserId)
          : [...u.followers, currentUserId];
        return { ...u, followers: newFollowers };
      })
    );
    try {
      if (currentlyFollowing) {
        await unfollowUser(targetUserId);
        toast.success("Unfollowed");
      } else {
        await followUser(targetUserId);
        toast.success("Following! 🍀");
      }
    } catch {
      toast.error("Operation failed.");
      performSearch(query, activeTab, 1, false);
    }
  };

  const hasQuery = query.trim().length > 0;
  const currentUserId = user?.id || user?._id;

  /* ── Explore mosaic pattern ─────────────────────────── */
  // Every 3 cells: cell 0 is tall (row-span 2), cells 1&2 are small
  const renderExploreMosaic = (postList) => {
    if (exploreLoading) return <Spinner size="lg" />;
    if (postList.length === 0) return (
      <p style={{ color: "var(--ig-text-muted)", textAlign: "center", padding: "40px 0", fontSize: 14 }}>
        No posts to explore yet.
      </p>
    );

    const groups = [];
    for (let i = 0; i < postList.length; i += 3) {
      groups.push(postList.slice(i, i + 3));
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {groups.map((group, gi) => (
          <div key={gi} style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 3, gridTemplateRows: "auto auto" }}>
            {/* Large left cell */}
            {group[0] && (
              <Link
                to={`/posts/${group[0]._id}`}
                style={{ gridRow: "1 / 3", display: "block", position: "relative", aspectRatio: "1 / 2", background: "#000", overflow: "hidden" }}
              >
                <img
                  src={`http://localhost:5000${group[0].image}`}
                  alt={group[0].caption}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.25)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0)"}
                >
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, opacity: 0, transition: "opacity 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#fff", fontWeight: 700, fontSize: 14 }}>
                      <Heart style={{ width: 16, height: 16, fill: "#fff", color: "#fff" }} />
                      {group[0].likes?.length || 0}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#fff", fontWeight: 700, fontSize: 14 }}>
                      <MessageSquare style={{ width: 16, height: 16, fill: "#fff", color: "#fff" }} />
                      {group[0].commentsCount || 0}
                    </span>
                  </div>
                </div>
              </Link>
            )}
            {/* Two right cells */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {group.slice(1).map((post) => (
                <Link
                  key={post._id}
                  to={`/posts/${post._id}`}
                  style={{ display: "block", position: "relative", aspectRatio: "1 / 1", background: "#000", overflow: "hidden" }}
                >
                  <img
                    src={`http://localhost:5000${post.image}`}
                    alt={post.caption}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 935, margin: "0 auto" }}>
      {/* Search bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--ig-bg)", padding: "12px 0 16px" }}>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--ig-surface-2)",
              borderRadius: 8,
              padding: "10px 14px",
              border: "1px solid var(--ig-border)",
            }}
          >
            <SearchIcon style={{ width: 18, height: 18, color: "var(--ig-text-muted)", flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "var(--ig-text)",
                fontSize: 14,
                flex: 1,
                fontFamily: "var(--font)",
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setResults([]); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ig-text-muted)" }}
              >
                ✕
              </button>
            )}
          </div>
        </form>

        {/* Tabs (only when searching) */}
        {hasQuery && (
          <div style={{ display: "flex", borderBottom: "1px solid var(--ig-border)", marginTop: 12 }}>
            {["users", "posts"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === tab ? "2px solid var(--ig-text)" : "2px solid transparent",
                  cursor: "pointer",
                  color: activeTab === tab ? "var(--ig-text)" : "var(--ig-text-muted)",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results or Explore */}
      {!hasQuery ? (
        renderExploreMosaic(explorePosts)
      ) : loading ? (
        <Spinner size="lg" />
      ) : results.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--ig-text-muted)" }}>
          <p style={{ fontSize: 14 }}>No results for <strong style={{ color: "var(--ig-text)" }}>"{query}"</strong></p>
        </div>
      ) : (
        <div>
          <AnimatePresence>
            {activeTab === "users" ? (
              // User list
              <div>
                {results.map((targetUser) => {
                  const isSelf = targetUser._id === currentUserId;
                  const isFollowing = targetUser.followers?.includes(currentUserId);
                  return (
                    <motion.div
                      key={targetUser._id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 4px",
                        borderBottom: "1px solid var(--ig-border)",
                      }}
                    >
                      <Link
                        to={`/profile/${targetUser._id}`}
                        style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", flex: 1 }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            overflow: "hidden",
                            background: "var(--ig-surface-3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {targetUser.profilePhoto ? (
                            <img
                              src={`http://localhost:5000${targetUser.profilePhoto}`}
                              alt={targetUser.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <UserIcon style={{ width: 20, height: 20, color: "var(--ig-text-muted)" }} />
                          )}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ig-text)" }}>
                            {targetUser.username}
                          </p>
                          <p style={{ fontSize: 12, color: "var(--ig-text-muted)" }}>{targetUser.name}</p>
                        </div>
                      </Link>
                      {!isSelf && (
                        <button
                          onClick={() => handleFollowToggle(targetUser._id, isFollowing)}
                          className="ig-btn"
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            padding: "6px 16px",
                            background: isFollowing ? "var(--ig-surface-2)" : "var(--ig-accent)",
                            color: isFollowing ? "var(--ig-text)" : "#000",
                            border: isFollowing ? "1px solid var(--ig-border-light)" : "none",
                          }}
                        >
                          {isFollowing ? "Following" : "Follow"}
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              // Post grid
              <div className="ig-grid">
                {results.map((post) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ position: "relative", aspectRatio: "1/1", background: "#000", overflow: "hidden" }}
                  >
                    <Link to={`/posts/${post._id}`} style={{ display: "block", width: "100%", height: "100%" }}>
                      <img
                        src={`http://localhost:5000${post.image}`}
                        alt={post.caption}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {page < totalPages && (
            <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
              <button
                onClick={() => performSearch(query, activeTab, page + 1, true)}
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

export default Search;
