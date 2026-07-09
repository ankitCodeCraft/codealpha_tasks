import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function CreateProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await API.post(
        "/products",
        {
          name,
          brand,
          description,
          price,
          image,
          category,
          stock,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      alert("Product Created Successfully");

      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to Create Product");
    }
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-black text-white">Add New Product</h1>

            <p className="text-gray-400 mt-3">
              Create a new product for your store.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/products")}
            className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/10 transition"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Image Preview */}

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Product Image
              </h2>

              <img
                src={image || "https://placehold.co/500x500?text=Preview"}
                alt="Preview"
                className="w-full h-80 object-contain bg-white rounded-3xl"
              />

              <div className="mt-6">
                <label className="block text-gray-300 mb-2">Image URL</label>

                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Form */}

            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-white mb-8">
                Product Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Product Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Brand</label>

                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Category</label>

                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Price</label>

                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Stock</label>

                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-gray-300 mb-2">Description</label>

                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none resize-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 py-4 rounded-2xl text-xl font-bold text-white transition"
                >
                  ➕ Create Product
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="px-8 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProductPage;
