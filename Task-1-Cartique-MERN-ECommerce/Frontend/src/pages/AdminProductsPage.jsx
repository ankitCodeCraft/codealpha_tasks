import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await API.delete(`/products/${selectedProduct._id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setProducts(
        products.filter((product) => product._id !== selectedProduct._id),
      );

      setShowDeleteModal(false);
      setSelectedProduct(null);

      alert("Product Deleted Successfully");
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  const filteredProducts = [...products]
    .filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;

        case "price-high":
          return b.price - a.price;

        case "stock":
          return b.stock - a.stock;

        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-black text-white">Manage Products</h1>

            <p className="text-gray-400 mt-3">
              Create, update and remove products.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/create-product")}
            className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-2xl text-white font-bold transition"
          >
            + Add Product
          </button>
        </div>

        {/* Search */}

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
    flex-1
    bg-white/5
    border
    border-white/10
    rounded-2xl
    px-6
    py-4
    text-white
    outline-none
    focus:border-orange-500
    "
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="
    bg-slate-800
    text-white
    border
    border-white/10
    rounded-2xl
    px-5
    py-4
    outline-none
    focus:border-orange-500
  "
          >
            <option className="bg-slate-800 text-white" value="newest">
              Newest
            </option>

            <option className="bg-slate-800 text-white" value="price-low">
              Price: Low → High
            </option>

            <option className="bg-slate-800 text-white" value="price-high">
              Price: High → Low
            </option>

            <option className="bg-slate-800 text-white" value="stock">
              Stock
            </option>
          </select>
        </div>

        {/* Products */}

        {filteredProducts.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center">
            <h2 className="text-3xl font-bold text-white">No Products Found</h2>

            <p className="text-gray-400 mt-3">
              Try another search or add a new product.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-orange-500/40 transition"
              >
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                  {/* Left */}

                  <div className="flex gap-6 items-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-28 h-28 object-cover rounded-2xl bg-white"
                    />

                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {product.name}
                      </h2>

                      <p className="text-gray-400 mt-2">{product.category}</p>

                      <h3 className="text-orange-400 text-3xl font-bold mt-4">
                        ₹ {product.price.toLocaleString("en-IN")}
                      </h3>
                    </div>
                  </div>

                  {/* Right */}

                  <div className="flex flex-col lg:items-end gap-5">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        product.stock > 10
                          ? "bg-green-500/20 text-green-400"
                          : product.stock > 0
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {product.stock} in Stock
                    </span>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          navigate(`/admin/edit-product/${product._id}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl text-white font-semibold transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl text-white font-semibold transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-md">
              <h2 className="text-3xl font-bold text-white">Delete Product?</h2>

              <p className="text-gray-400 mt-4">
                Are you sure you want to delete
                <span className="text-white font-semibold">
                  {" "}
                  {selectedProduct?.name}
                </span>
                ?
              </p>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                  }}
                  className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20"
                >
                  Cancel
                </button>

                <button
                  onClick={deleteProduct}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProductsPage;
