import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Upload, ArrowLeft, X } from "lucide-react";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select an image.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", imageFile);
    try {
      const res = await createPost(formData);
      if (res.success) {
        toast.success("Post shared! 🌍");
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to share post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 0 20px",
          borderBottom: "1px solid var(--ig-border)",
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--ig-text)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <ArrowLeft style={{ width: 20, height: 20 }} />
          Discard
        </button>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--ig-text)" }}>
          Create new post
        </h1>
        <button
          onClick={handleSubmit}
          disabled={loading || !imageFile}
          style={{
            background: "none",
            border: "none",
            cursor: imageFile && !loading ? "pointer" : "not-allowed",
            color: imageFile && !loading ? "var(--ig-accent)" : "var(--ig-text-muted)",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {loading ? "Sharing..." : "Share"}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          border: "1px solid var(--ig-border)",
          borderRadius: 12,
          overflow: "hidden",
          background: "var(--ig-bg)",
        }}
      >
        {/* Image upload / preview */}
        {imagePreview ? (
          <div style={{ position: "relative", background: "#000" }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                objectFit: "cover",
                display: "block",
              }}
            />
            <button
              onClick={() => { setImageFile(null); setImagePreview(""); }}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.7)",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>
        ) : (
          <label
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              aspectRatio: "1 / 1",
              cursor: "pointer",
              background: dragging ? "var(--ig-surface-2)" : "var(--ig-bg)",
              transition: "background 0.15s",
              borderBottom: "1px solid var(--ig-border)",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "var(--ig-surface-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s",
              }}
            >
              <Upload
                style={{
                  width: 36,
                  height: 36,
                  color: "var(--ig-text-secondary)",
                }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 20, fontWeight: 300, color: "var(--ig-text)", marginBottom: 8 }}>
                Drag photos here
              </p>
              <p style={{ fontSize: 13, color: "var(--ig-text-muted)" }}>
                JPEG, PNG, WEBP — up to 5 MB
              </p>
            </div>
            <div
              style={{
                padding: "8px 24px",
                background: "var(--ig-accent)",
                color: "#000",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Select from computer
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </label>
        )}

        {/* Caption */}
        {imagePreview && (
          <div style={{ padding: 16 }}>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={4}
              maxLength={500}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                outline: "none",
                color: "var(--ig-text)",
                fontSize: 14,
                fontFamily: "var(--font)",
                resize: "none",
                lineHeight: 1.6,
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid var(--ig-border)",
                paddingTop: 8,
                marginTop: 4,
              }}
            >
              <span style={{ fontSize: 13, color: "var(--ig-text-muted)" }}>🌍 eco-friendly</span>
              <span style={{ fontSize: 12, color: "var(--ig-text-muted)" }}>
                {caption.length} / 500
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CreatePost;
