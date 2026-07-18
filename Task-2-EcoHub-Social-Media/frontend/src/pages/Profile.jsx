import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserProfile, updateProfile, followUser, unfollowUser } from "../api/users";
import { getFeed } from "../api/posts";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  MapPin,
  Link as LinkIcon,
  Settings,
  Heart,
  MessageSquare,
  Users,
  Camera,
  X,
  Grid,
} from "lucide-react";
import Spinner from "../components/ui/Spinner";

/* ─── Stat block ───────────────────────────────────────── */
const Stat = ({ value, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: "none",
      border: "none",
      cursor: onClick ? "pointer" : "default",
      textAlign: "center",
      padding: "0 8px",
    }}
  >
    <p style={{ fontSize: 16, fontWeight: 700, color: "var(--ig-text)", lineHeight: 1.2 }}>
      {value}
    </p>
    <p style={{ fontSize: 13, color: "var(--ig-text)", lineHeight: 1.4 }}>{label}</p>
  </button>
);

/* ─── Follow/User modal ────────────────────────────────── */
const UserListModal = ({ title, users = [], onClose }) => (
  <AnimatePresence>
    <div className="ig-modal-bg" onClick={onClose}>
      <motion.div
        className="ig-modal"
        style={{ maxWidth: 400 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--ig-border)",
          }}
        >
          <div style={{ width: 24 }} />
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ig-text)" }}>{title}</p>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ig-text)" }}
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {/* List */}
        <div
          style={{ overflowY: "auto", flex: 1, maxHeight: "60vh" }}
          className="no-scrollbar"
        >
          {users.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "var(--ig-text-muted)",
                fontSize: 14,
                padding: "40px 24px",
              }}
            >
              No users yet.
            </p>
          ) : (
            users.map((u) => (
              <Link
                key={u._id}
                to={`/profile/${u._id}`}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 20px",
                  textDecoration: "none",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--ig-surface-2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
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
                  {u.profilePhoto ? (
                    <img
                      src={`http://localhost:5000${u.profilePhoto}`}
                      alt={u.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <UserIcon style={{ width: 20, height: 20, color: "var(--ig-text-muted)" }} />
                  )}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ig-text)" }}>
                    {u.name}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--ig-text-muted)" }}>
                    @{u.username}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </motion.div>
    </div>
  </AnimatePresence>
);

/* ─── PROFILE PAGE ──────────────────────────────────────── */
const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, reloadProfile } = useAuth();
  const profileId = id || currentUser?.id || currentUser?._id;

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchProfileData = async () => {
    try {
      setLoadingProfile(true);
      const res = await getUserProfile(profileId);
      if (res.success) {
        setProfile(res.data);
        setEditName(res.data.user.name || "");
        setEditBio(res.data.user.bio || "");
        setEditLocation(res.data.user.location || "");
        setEditWebsite(res.data.user.website || "");
        setPhotoPreview(res.data.user.profilePhoto || "");
      }
    } catch {
      toast.error("Failed to load profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchUserPosts = async (pageNumber, append = false) => {
    try {
      setLoadingPosts(true);
      const res = await getFeed(pageNumber, 12, profileId);
      if (res.success) {
        if (append) setPosts((prev) => [...prev, ...res.data]);
        else setPosts(res.data);
        setPage(res.page);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchProfileData();
      fetchUserPosts(1, false);
    }
  }, [profileId]);

  const handleFollowToggle = async () => {
    if (!profile) return;
    const isFollowing = profile.isFollowing;
    setProfile((prev) => ({
      ...prev,
      isFollowing: !isFollowing,
      followersCount: isFollowing ? prev.followersCount - 1 : prev.followersCount + 1,
    }));
    try {
      if (isFollowing) {
        await unfollowUser(profile.user._id);
        toast.success(`Unfollowed ${profile.user.name}`);
      } else {
        await followUser(profile.user._id);
        toast.success(`Following ${profile.user.name}! 🍀`);
      }
      reloadProfile();
    } catch {
      toast.error("Follow request failed.");
      fetchProfileData();
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("bio", editBio);
    formData.append("location", editLocation);
    formData.append("website", editWebsite);
    if (selectedPhoto) formData.append("profilePhoto", selectedPhoto);
    try {
      const res = await updateProfile(formData);
      if (res.success) {
        toast.success("Profile updated!");
        setShowEditModal(false);
        fetchProfileData();
        reloadProfile();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  const isSelf = profileId === (currentUser?.id || currentUser?._id);

  if (loadingProfile) return <Spinner size="lg" />;
  if (!profile || !profile.user) {
    return (
      <div style={{ textAlign: "center", padding: "40px 24px", color: "var(--ig-text-muted)" }}>
        Profile not found.
      </div>
    );
  }

  const { user } = profile;
  const avatarSrc = user.profilePhoto
    ? `http://localhost:5000${user.profilePhoto}`
    : null;

  return (
    <div style={{ maxWidth: 935, margin: "0 auto" }}>
      {/* ── Profile Header ──────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 48,
          padding: "24px 16px 32px",
          borderBottom: "1px solid var(--ig-border)",
          flexWrap: "wrap",
        }}
      >
        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              padding: 3,
              borderRadius: "50%",
              background: "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)",
              display: "inline-block",
            }}
          >
            <div
              style={{
                padding: 3,
                borderRadius: "50%",
                background: "var(--ig-bg)",
                display: "flex",
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "var(--ig-surface-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={user.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <UserIcon style={{ width: 40, height: 40, color: "var(--ig-text-muted)" }} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info block */}
        <div style={{ flex: 1, minWidth: 200 }}>
          {/* Username row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 300, color: "var(--ig-text)", letterSpacing: "-0.2px" }}>
              {user.username}
            </h2>
            {user.role === "admin" && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "3px 8px",
                  borderRadius: 999,
                  background: "rgba(34,197,94,0.12)",
                  color: "var(--ig-accent)",
                  border: "1px solid rgba(34,197,94,0.3)",
                }}
              >
                Staff
              </span>
            )}
            {isSelf ? (
              <button
                onClick={() => setShowEditModal(true)}
                className="ig-btn ig-btn-ghost"
                style={{ fontSize: 13, fontWeight: 600, padding: "6px 16px" }}
              >
                Edit profile
              </button>
            ) : (
              <button
                onClick={handleFollowToggle}
                className="ig-btn"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "6px 20px",
                  background: profile.isFollowing ? "var(--ig-surface-2)" : "var(--ig-accent)",
                  color: profile.isFollowing ? "var(--ig-text)" : "#000",
                  border: profile.isFollowing ? "1px solid var(--ig-border-light)" : "none",
                }}
              >
                {profile.isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 32, marginBottom: 20 }}>
            <Stat value={profile.postsCount} label="posts" />
            <Stat
              value={profile.followersCount}
              label="followers"
              onClick={() => setShowFollowersModal(true)}
            />
            <Stat
              value={profile.followingCount}
              label="following"
              onClick={() => setShowFollowingModal(true)}
            />
          </div>

          {/* Bio */}
          <div style={{ maxWidth: 340 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ig-text)", marginBottom: 2 }}>
              {user.name}
            </p>
            {user.bio && (
              <p style={{ fontSize: 14, color: "var(--ig-text)", marginBottom: 4, lineHeight: 1.5 }}>
                {user.bio}
              </p>
            )}
            {user.location && (
              <p style={{ fontSize: 13, color: "var(--ig-text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                <MapPin style={{ width: 12, height: 12 }} />
                {user.location}
              </p>
            )}
            {user.website && (
              <a
                href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 13,
                  color: "var(--ig-accent)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                <LinkIcon style={{ width: 12, height: 12 }} />
                {user.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Grid Tab bar ────────────────────────────── */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--ig-border)",
          marginBottom: 3,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "12px 0",
            borderTop: "1px solid var(--ig-text)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ig-text)",
            cursor: "pointer",
          }}
        >
          <Grid style={{ width: 14, height: 14 }} />
          Posts
        </div>
      </div>

      {/* ── Post Grid ────────────────────────────────── */}
      {loadingPosts && posts.length === 0 ? (
        <Spinner size="lg" />
      ) : posts.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "64px 24px",
            color: "var(--ig-text-muted)",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              border: "2px solid var(--ig-text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Grid style={{ width: 24, height: 24 }} />
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: "var(--ig-text)", marginBottom: 8 }}>
            No posts yet
          </p>
          <p style={{ fontSize: 14, color: "var(--ig-text-muted)" }}>
            {isSelf ? "Share your first eco-discovery!" : "This user hasn't shared anything yet."}
          </p>
        </div>
      ) : (
        <div className="ig-grid">
          {posts.map((post, i) => (
            <Link
              key={post._id}
              to={`/posts/${post._id}`}
              style={{
                display: "block",
                position: "relative",
                aspectRatio: "1 / 1",
                background: "var(--ig-surface-3)",
                overflow: "hidden",
                borderRadius: 16,
              }}
            >
              <img
                src={`http://localhost:5000${post.image}`}
                alt={post.caption}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "filter 0.2s",
                }}
              />
              {/* Hover overlay */}
              <div
                className="ig-grid-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.45)",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 24,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  <Heart style={{ width: 18, height: 18, fill: "#fff", color: "#fff" }} />
                  {post.likes?.length || 0}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  <MessageSquare style={{ width: 18, height: 18, fill: "#fff", color: "#fff" }} />
                  {post.commentsCount || 0}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* CSS for hover overlay (inject inline since tailwind has limitations) */}
      <style>{`
        .ig-grid a:hover .ig-grid-overlay { opacity: 1 !important; }
        .ig-grid a { display: block; }
      `}</style>

      {/* Load more grid */}
      {page < totalPages && (
        <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
          <button
            onClick={() => fetchUserPosts(page + 1, true)}
            disabled={loadingPosts}
            className="ig-btn ig-btn-outline"
            style={{ fontSize: 13 }}
          >
            {loadingPosts ? "Loading..." : "Load more"}
          </button>
        </div>
      )}

      {/* ── Edit Profile Modal ───────────────────────── */}
      <AnimatePresence>
        {showEditModal && (
          <div className="ig-modal-bg" onClick={() => setShowEditModal(false)}>
            <motion.div
              className="ig-modal"
              style={{ maxWidth: 480 }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--ig-border)",
                }}
              >
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--ig-text)",
                  }}
                >
                  <X style={{ width: 22, height: 22 }} />
                </button>
                <p style={{ fontSize: 15, fontWeight: 700, color: "var(--ig-text)" }}>
                  Edit Profile
                </p>
                <button
                  form="edit-profile-form"
                  type="submit"
                  disabled={updating}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--ig-accent)",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {updating ? "Saving..." : "Done"}
                </button>
              </div>

              <form
                id="edit-profile-form"
                onSubmit={handleEditSubmit}
                style={{ padding: "16px 20px", overflowY: "auto" }}
                className="no-scrollbar"
              >
                {/* Photo */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 24,
                    padding: "12px 16px",
                    borderRadius: 12,
                    background: "var(--ig-surface-2)",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      overflow: "hidden",
                      background: "var(--ig-surface-3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {photoPreview ? (
                      <img
                        src={
                          photoPreview.startsWith("blob:")
                            ? photoPreview
                            : `http://localhost:5000${photoPreview}`
                        }
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <UserIcon style={{ width: 24, height: 24, color: "var(--ig-text-muted)" }} />
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ig-text)" }}>
                      {user.username}
                    </p>
                    <label
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--ig-accent)",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 4,
                      }}
                    >
                      <Camera style={{ width: 14, height: 14 }} />
                      Change photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                </div>

                {/* Fields */}
                {[
                  { label: "Name", value: editName, setter: setEditName, type: "text", required: true },
                  { label: "Bio", value: editBio, setter: setEditBio, type: "textarea" },
                  { label: "Location", value: editLocation, setter: setEditLocation, type: "text" },
                  { label: "Website", value: editWebsite, setter: setEditWebsite, type: "text" },
                ].map(({ label, value, setter, type, required }) => (
                  <div key={label} style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--ig-text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 6,
                      }}
                    >
                      {label}
                    </label>
                    {type === "textarea" ? (
                      <textarea
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        rows={3}
                        maxLength={200}
                        className="ig-input"
                        style={{ resize: "none" }}
                      />
                    ) : (
                      <input
                        type={type}
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        required={required}
                        className="ig-input"
                      />
                    )}
                  </div>
                ))}

                <div style={{ height: 8 }} />
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Followers Modal */}
      {showFollowersModal && (
        <UserListModal
          title={`Followers`}
          users={user.followers || []}
          onClose={() => setShowFollowersModal(false)}
        />
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <UserListModal
          title={`Following`}
          users={user.following || []}
          onClose={() => setShowFollowingModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;
