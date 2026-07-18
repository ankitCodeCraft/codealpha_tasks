import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSinglePost, likePost, unlikePost, deletePost } from "../api/posts";
import { getComments, addComment, deleteComment } from "../api/comments";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Trash2,
  User,
  ArrowLeft,
  Send,
  Bookmark,
  MoreHorizontal,
  Smile,
  AlertCircle,
} from "lucide-react";
import Spinner from "../components/ui/Spinner";

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: "long", day: "numeric" });
};

const SinglePost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [heartAnimating, setHeartAnimating] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchPost = async () => {
    try {
      setLoadingPost(true);
      const res = await getSinglePost(id);
      if (res.success) setPost(res.data);
    } catch {
      toast.error("Failed to load post.");
      navigate("/");
    } finally {
      setLoadingPost(false);
    }
  };

  const fetchComments = async (pageNumber, append = false) => {
    try {
      setLoadingComments(true);
      const res = await getComments(id, pageNumber, 10);
      if (res.success) {
        if (append) setComments((prev) => [...prev, ...res.data]);
        else setComments(res.data);
        setPage(res.page);
        setTotalPages(res.totalPages);
        setTotalResults(res.totalResults);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments(1, false);
  }, [id]);

  const currentUserId = user?.id || user?._id;

  const handleLikeToggle = async () => {
    if (!post) return;
    const alreadyLiked = post.likes?.includes(currentUserId);
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 500);
    const updatedLikes = alreadyLiked
      ? post.likes.filter((uid) => uid !== currentUserId)
      : [...post.likes, currentUserId];
    setPost({ ...post, likes: updatedLikes });
    try {
      if (alreadyLiked) await unlikePost(post._id);
      else await likePost(post._id);
    } catch {
      toast.error("Action failed.");
      fetchPost();
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    if (!window.confirm("Delete this post?")) return;
    try {
      const res = await deletePost(post._id);
      if (res.success) {
        toast.success("Post deleted.");
        navigate("/");
      }
    } catch {
      toast.error("Failed to delete post.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await addComment(id, commentText);
      if (res.success) {
        setCommentText("");
        setComments((prev) => [res.data, ...prev]);
        setTotalResults((prev) => prev + 1);
        setPost((prev) => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
      }
    } catch {
      toast.error("Failed to comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const res = await deleteComment(id, commentId);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        setTotalResults((prev) => Math.max(0, prev - 1));
        setPost((prev) => ({
          ...prev,
          commentsCount: Math.max(0, prev.commentsCount - 1),
        }));
      }
    } catch {
      toast.error("Failed to delete comment.");
    }
  };

  if (loadingPost) return <Spinner size="lg" />;
  if (!post) {
    return (
      <div style={{ textAlign: "center", padding: "64px 24px" }}>
        <AlertCircle style={{ width: 48, height: 48, color: "var(--ig-text-muted)", margin: "0 auto 16px" }} />
        <p style={{ color: "var(--ig-text-muted)", fontSize: 16 }}>Post not found.</p>
      </div>
    );
  }

  const hasLiked = post.likes?.includes(currentUserId);
  const isPostOwner = post.user?._id === currentUserId || post.user === currentUserId;
  const isAdmin = user?.role === "admin";

  return (
    <div style={{ maxWidth: 935, margin: "0 auto" }}>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--ig-text)",
          fontSize: 14,
          fontWeight: 600,
          padding: "0 0 16px",
          marginBottom: 8,
        }}
      >
        <ArrowLeft style={{ width: 20, height: 20 }} />
        Back
      </button>

      {/* Main post — 2-column layout on desktop */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid var(--ig-border)",
          borderRadius: 4,
          overflow: "hidden",
          background: "var(--ig-bg)",
        }}
        className="lg:flex-row"
      >
        <style>{`
          @media (min-width: 768px) {
            .post-two-col { flex-direction: row !important; }
            .post-image-col { width: 55% !important; flex-shrink: 0; }
            .post-comments-col { width: 45% !important; }
          }
        `}</style>

        <div className="post-two-col" style={{ display: "flex", flexDirection: "column" }}>
          {/* Left: image */}
          <div
            className="post-image-col"
            style={{
              background: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={`http://localhost:5000${post.image}`}
              alt={post.caption || "EcoHub Post"}
              style={{
                width: "100%",
                maxHeight: 600,
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>

          {/* Right: comments column */}
          <div
            className="post-comments-col"
            style={{
              display: "flex",
              flexDirection: "column",
              borderLeft: "1px solid var(--ig-border)",
              minHeight: 400,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom: "1px solid var(--ig-border)",
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
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "var(--ig-surface-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {post.user?.profilePhoto ? (
                    <img
                      src={`http://localhost:5000${post.user.profilePhoto}`}
                      alt={post.user?.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <User style={{ width: 16, height: 16, color: "var(--ig-text-muted)" }} />
                  )}
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ig-text)" }}>
                  {post.user?.username || post.user?.name || "user"}
                </p>
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {(isPostOwner || isAdmin) && (
                  <button
                    onClick={handleDeletePost}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--ig-text-muted)",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ig-red)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ig-text-muted)")}
                  >
                    <Trash2 style={{ width: 18, height: 18 }} />
                  </button>
                )}
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--ig-text)",
                    display: "flex",
                  }}
                >
                  <MoreHorizontal style={{ width: 20, height: 20 }} />
                </button>
              </div>
            </div>

            {/* Caption as first "comment" */}
            {post.caption && (
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--ig-border)",
                }}
              >
                <Link
                  to={`/profile/${post.user?._id || post.user}`}
                  style={{ flexShrink: 0, textDecoration: "none" }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
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
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <User style={{ width: 14, height: 14, color: "var(--ig-text-muted)" }} />
                    )}
                  </div>
                </Link>
                <div>
                  <p style={{ fontSize: 14, color: "var(--ig-text)", lineHeight: 1.6 }}>
                    <Link
                      to={`/profile/${post.user?._id || post.user}`}
                      style={{ fontWeight: 700, color: "var(--ig-text)", textDecoration: "none", marginRight: 6 }}
                    >
                      {post.user?.username || "user"}
                    </Link>
                    {post.caption}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--ig-text-muted)", marginTop: 4 }}>
                    {timeAgo(post.createdAt)}
                  </p>
                </div>
              </div>
            )}

            {/* Comments list */}
            <div
              style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}
              className="no-scrollbar"
            >
              {loadingComments && comments.length === 0 ? (
                <Spinner size="sm" />
              ) : comments.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 24px",
                    color: "var(--ig-text-muted)",
                  }}
                >
                  <p style={{ fontSize: 20, fontWeight: 700, color: "var(--ig-text)", marginBottom: 8 }}>
                    No comments yet.
                  </p>
                  <p style={{ fontSize: 14 }}>Start the conversation.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {comments.map((comment) => {
                    const isCommentOwner =
                      comment.user?._id === currentUserId ||
                      comment.user === currentUserId;
                    const canDelete = isCommentOwner || isPostOwner || isAdmin;

                    return (
                      <motion.div
                        key={comment._id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          padding: "8px 16px",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "var(--ig-surface-2)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <Link
                          to={`/profile/${comment.user?._id || comment.user}`}
                          style={{ textDecoration: "none", flexShrink: 0 }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              overflow: "hidden",
                              background: "var(--ig-surface-3)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {comment.user?.profilePhoto ? (
                              <img
                                src={`http://localhost:5000${comment.user.profilePhoto}`}
                                alt=""
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            ) : (
                              <User
                                style={{ width: 14, height: 14, color: "var(--ig-text-muted)" }}
                              />
                            )}
                          </div>
                        </Link>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, color: "var(--ig-text)", lineHeight: 1.6 }}>
                            <Link
                              to={`/profile/${comment.user?._id || comment.user}`}
                              style={{
                                fontWeight: 700,
                                color: "var(--ig-text)",
                                textDecoration: "none",
                                marginRight: 6,
                              }}
                            >
                              {comment.user?.username || "user"}
                            </Link>
                            {comment.comment}
                          </p>
                          <p style={{ fontSize: 11, color: "var(--ig-text-muted)", marginTop: 3 }}>
                            {timeAgo(comment.createdAt)}
                          </p>
                        </div>
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "var(--ig-text-muted)",
                              padding: 4,
                              flexShrink: 0,
                              display: "flex",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color = "var(--ig-red)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color = "var(--ig-text-muted)")
                            }
                          >
                            <Trash2 style={{ width: 14, height: 14 }} />
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}

              {page < totalPages && (
                <button
                  onClick={() => fetchComments(page + 1, true)}
                  style={{
                    display: "block",
                    margin: "4px auto",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--ig-text-muted)",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Load more comments
                </button>
              )}
            </div>

            {/* Action bar */}
            <div style={{ borderTop: "1px solid var(--ig-border)", padding: "8px 16px 4px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <button
                    onClick={handleLikeToggle}
                    className={heartAnimating ? "heart-pop" : ""}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
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
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ig-text)", display: "flex" }}>
                    <MessageCircle style={{ width: 26, height: 26, strokeWidth: 1.8 }} />
                  </button>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ig-text)", display: "flex" }}>
                    <Send style={{ width: 24, height: 24, strokeWidth: 1.8, transform: "rotate(-10deg)" }} />
                  </button>
                </div>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ig-text)", display: "flex" }}>
                  <Bookmark style={{ width: 24, height: 24, strokeWidth: 1.8 }} />
                </button>
              </div>

              {/* Like count */}
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--ig-text)", marginBottom: 8 }}>
                {(post.likes?.length || 0).toLocaleString()} like{post.likes?.length !== 1 ? "s" : ""}
              </p>

              {/* Timestamp */}
              <p
                style={{
                  fontSize: 10,
                  color: "var(--ig-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: 12,
                }}
              >
                {timeAgo(post.createdAt)}
              </p>
            </div>

            {/* Comment input */}
            <div
              style={{
                borderTop: "1px solid var(--ig-border)",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ig-text-muted)", display: "flex" }}>
                <Smile style={{ width: 22, height: 22 }} />
              </button>
              <form
                onSubmit={handleCommentSubmit}
                style={{ display: "flex", flex: 1, gap: 8, alignItems: "center" }}
              >
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  maxLength={500}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "var(--ig-text)",
                    fontSize: 14,
                    fontFamily: "var(--font)",
                  }}
                />
                {commentText.trim() && (
                  <button
                    type="submit"
                    disabled={submittingComment}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--ig-accent)",
                      fontSize: 14,
                      fontWeight: 700,
                      padding: 0,
                    }}
                  >
                    Post
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
