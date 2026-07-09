import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);

        setProduct(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = () => {

    if (product.stock <= 0) {
      alert("Product is Out of Stock");

      return;
    }

    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    const existItem = cart.find((item) => item._id === product._id);

    if (existItem) {
      const updatedCart = cart.map((item) =>
        item._id === product._id
          ? {
              ...item,

              product: item._id,

              quantity: item.quantity + 1,
            }
          : item,
      );

      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    } else {
      cart.push({
        ...product,

        product: product._id,

        quantity: 1,
      });

      localStorage.setItem("cartItems", JSON.stringify(cart));
    }

    alert("Product Added To Cart");
  };

  if (!product) {
    return <h2>Loading...</h2>;
  }
  const buyNowHandler = () => {
    if (product.stock <= 0) {
      alert("Product is Out of Stock");
      return;
    }

    const cart = [];

    cart.push({
      ...product,

      product: product._id,

      quantity: 1,
    });

    localStorage.setItem("cartItems", JSON.stringify(cart));

    window.location.href = "/checkout";
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="text-orange-400 hover:text-orange-300 font-semibold mb-8"
        >
          ← Back to Products
        </button>

        <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side */}

            <div className="bg-white flex items-center justify-center p-10">
              <img
                src={product.image}
                alt={product.name}
                className="
              h-[450px]
              object-contain
              hover:scale-105
              transition
              duration-300
              "
              />
            </div>

            {/* Right Side */}

            <div className="p-10">
              <p className="text-orange-400 font-semibold mb-3">
                {product.category}
              </p>

              <h1 className="text-5xl font-bold text-white mb-4">
                {product.name}
              </h1>

              {/* Rating */}

              <div className="flex items-center gap-3 mb-6">
                <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
                  ⭐ 4.8
                </span>

                <span className="text-gray-400">250 Ratings & Reviews</span>
              </div>

              {/* Price */}

              <div className="mb-6">
                <h2 className="text-5xl font-bold text-orange-400">
                  ₹ {product.price}
                </h2>

                <div className="flex items-center gap-4 mt-2">
                  <span className="line-through text-gray-500 text-xl">
                    ₹ {Math.round(product.price * 1.1)}
                  </span>

                  <span className="text-green-400 font-semibold">10% OFF</span>
                </div>
              </div>

              {/* Stock */}

              <div className="mb-6">
                {product.stock > 0 ? (
                  <p className="text-green-400 font-semibold">
                    ✓ In Stock ({product.stock})
                  </p>
                ) : (
                  <p className="text-red-400 font-semibold">Out Of Stock</p>
                )}
              </div>

              {/* Delivery */}

              <div className="space-y-3 mb-8 text-gray-300">
                <p>🚚 Free Delivery Available</p>

                <p>↩️ 7 Days Easy Return</p>

                <p>💳 Secure Payment</p>
              </div>

              {/* Description */}

              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-white mb-3">
                  Description
                </h3>

                <p className="text-gray-400 leading-8">{product.description}</p>
              </div>

              {/* Buttons */}

              <div className="flex flex-col sm:flex-row gap-5">
                <button
                  onClick={addToCart}
                  disabled={product.stock === 0}
                  className="
                flex-1
                bg-orange-500
                hover:bg-orange-600
                text-white
                py-4
                rounded-xl
                font-bold
                text-lg
                transition
                "
                >
                  Add To Cart
                </button>

                <button
                  onClick={buyNowHandler}
                  className="
  flex-1
  bg-yellow-500
  hover:bg-yellow-600
  text-black
  py-4
  rounded-xl
  font-bold
  text-lg
  transition
  "
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
