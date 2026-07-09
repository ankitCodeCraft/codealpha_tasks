import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(cart);
  }, []);

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item,
    );

    updateCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cartItems
      .map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item,
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  };

  const deleteItem = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);

    updateCart(updatedCart);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const discount =
    subtotal >= 50000
      ? Math.round(subtotal * 0.1)
      : Math.round(subtotal * 0.05);

  const delivery = subtotal >= 999 ? 0 : 99;

  const platformFee = cartItems.length > 0 ? 19 : 0;

  const total = subtotal - discount + delivery + platformFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <div className="text-8xl mb-6">🛒</div>

        <h1 className="text-5xl font-black text-white">Your Cart is Empty</h1>

        <p className="text-gray-400 mt-5 text-lg">
          Looks like you haven't added anything yet.
        </p>

        <button
          onClick={() => navigate("/")}
          className="
          mt-10
          bg-orange-500
          hover:bg-orange-600
          text-white
          px-10
          py-4
          rounded-2xl
          font-bold
          transition
          "
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-white mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {" "}
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="
              bg-white/5
              backdrop-blur-xl
              border
              border-white/10
              rounded-3xl
              p-6
              flex
              flex-col
              md:flex-row
              gap-6
              items-center
              hover:border-orange-500/30
              transition
              "
              >
                {/* Product Image */}

                <div className="bg-white rounded-2xl p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-40 h-40 object-contain"
                  />
                </div>

                {/* Product Info */}

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{item.name}</h2>

                  <p className="text-gray-400 mt-2">{item.category}</p>

                  <h3 className="text-3xl font-bold text-orange-400 mt-4">
                    ₹ {item.price.toLocaleString()}
                  </h3>

                  <p className="text-green-400 mt-2 font-medium">✓ In Stock</p>

                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={() => decreaseQuantity(item._id)}
                      className="
                    w-10
                    h-10
                    rounded-full
                    bg-white/10
                    hover:bg-orange-500
                    text-white
                    transition
                    "
                    >
                      −
                    </button>

                    <span className="text-2xl font-bold text-white w-8 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item._id)}
                      className="
                    w-10
                    h-10
                    rounded-full
                    bg-white/10
                    hover:bg-orange-500
                    text-white
                    transition
                    "
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove Button */}

                <button
                  onClick={() => deleteItem(item._id)}
                  className="
                bg-red-500
                hover:bg-red-600
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
                transition
                "
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Price Details */}

          <div>
            <div
              className="
              sticky
              top-28
              bg-white/5
              backdrop-blur-xl
              border
              border-white/10
              rounded-3xl
              p-8
              "
            >
              <h2 className="text-3xl font-bold text-white mb-8">
                Price Details
              </h2>

              <div className="space-y-5">
                <div className="flex justify-between text-gray-300">
                  <span>Price ({cartItems.length} Items)</span>

                  <span>₹ {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-300">Discount</span>

                  <span className="text-green-400">
                    − ₹ {discount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-300">Delivery Charges</span>

                  <span className="text-green-400">
                    {delivery === 0 ? "FREE" : `₹ ${delivery}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-300">Platform Fee</span>

                  <span className="text-white">₹ {platformFee}</span>
                </div>

                <hr className="border-white/10" />

                <div className="flex justify-between">
                  <h2 className="text-3xl font-bold text-white">Total</h2>

                  <h2 className="text-3xl font-bold text-orange-400">
                    ₹ {total.toLocaleString()}
                  </h2>
                </div>

                <div
                  className="
                  bg-green-500/10
                  border
                  border-green-500/20
                  rounded-xl
                  p-4
                  text-green-400
                  mt-6
                  "
                >
                  🎉 You saved ₹ {discount.toLocaleString()} on this order.
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="
                  w-full
                  mt-8
                  bg-orange-500
                  hover:bg-orange-600
                  text-white
                  py-4
                  rounded-2xl
                  text-xl
                  font-bold
                  transition
                  "
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;