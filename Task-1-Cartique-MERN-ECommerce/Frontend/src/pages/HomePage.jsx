import { useEffect, useRef, useState } from "react";
import API from "../api/api";
import ProductCard from "../components/ProductCard";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedProduct, setHighlightedProduct] = useState(null);
  const productRefs = useRef({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const suggestions = products
    .filter((product) => {
      return (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .slice(0, 5);

  const categories = [
    "All",
    "Smartphones",
    "Laptops",
    "Audio",
    "Gaming",
    "Cameras",
    "Tablets",
    "Smart Watches",
  ];

  return (
    <div className="px-6 py-8">
      {/* Hero Section */}

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-16 shadow-2xl">
        <h1 className="text-7xl font-black text-white mb-4 text-center">
          Cartique
        </h1>

        <p className="text-2xl text-orange-400 font-semibold text-center mb-6">
          Everything You Love, Delivered.
        </p>

        <p className="text-gray-300 text-center text-lg max-w-3xl mx-auto leading-8">
          Premium shopping experience with carefully selected products, secure
          checkout, and seamless delivery at your fingertips.
        </p>
      </div>

      {/* Search Bar */}

      <div className="flex justify-center mt-10">
        <div ref={searchRef} className="relative w-full max-w-2xl">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;

              setSearchTerm(value);

              if (value.trim() === "") {
                setShowSuggestions(false);
              } else {
                setShowSuggestions(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const firstMatch = filteredProducts[0];

                if (firstMatch) {
                  setHighlightedProduct(firstMatch._id);

                  productRefs.current[firstMatch._id]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });

                  setShowSuggestions(false);

                  setTimeout(() => {
                    setHighlightedProduct(null);
                  }, 1500);
                }
              }
            }}
            className="
      w-full
      px-6
      py-4
      rounded-full
      bg-white/10
      border
      border-white/10
      text-white
      placeholder-gray-400
      outline-none
      focus:border-orange-500
      backdrop-blur-xl
      "
          />

          {showSuggestions &&
            searchTerm.trim() !== "" &&
            suggestions.length > 0 && (
              <div
                className="
          absolute
          top-16
          left-0
          w-full
          bg-slate-900
          border
          border-white/10
          rounded-2xl
          shadow-2xl
          overflow-hidden
          z-50
          "
              >
                {suggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      setSearchTerm(item.name);

                      setShowSuggestions(false);

                      setHighlightedProduct(item._id);

                      productRefs.current[item._id]?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });

                      setTimeout(() => {
                        setHighlightedProduct(null);
                      }, 1500);
                    }}
                    className="
  px-5
  py-4
  hover:bg-white/10
  cursor-pointer
  transition
  "
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="
    w-12
    h-12
    object-contain
    rounded-lg
    bg-white
    p-1
    "
                      />

                      <div>
                        <h3 className="text-white font-medium">{item.name}</h3>

                        <p className="text-gray-400 text-sm">{item.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {searchTerm && (
        <div className="text-center mt-4">
          <button
            onClick={() => setSearchTerm("")}
            className="
        text-orange-400
        hover:text-orange-300
        "
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Products */}

      <div className="flex flex-wrap gap-4 justify-center mt-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
      px-6
      py-3
      rounded-full
      font-semibold
      transition-all
      duration-300

      ${
        selectedCategory === category
          ? "bg-orange-500 text-white shadow-lg"
          : "bg-white/10 text-gray-300 hover:bg-white/20"
      }
      `}
          >
            {category}
          </button>
        ))}
      </div>

      <h2 className="text-4xl font-bold mt-16 mb-8 text-white">
        {selectedCategory} ({filteredProducts.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              ref={(el) => (productRefs.current[product._id] = el)}
            >
              <ProductCard
                product={product}
                highlighted={highlightedProduct === product._id}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <h2 className="text-3xl font-bold text-gray-400">
              No Products Found
            </h2>

            <p className="text-gray-500 mt-3">Try another search keyword.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
