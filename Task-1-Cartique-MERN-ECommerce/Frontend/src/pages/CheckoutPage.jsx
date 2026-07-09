import { useEffect, useState } from "react";
import API from "../api/api";

function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");

  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [showAddressModal, setShowAddressModal] = useState(false);

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCheckout();
  }, []);

  const loadCheckout = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const cart = JSON.parse(localStorage.getItem("cartItems")) || [];

      setCartItems(cart);

      const { data } = await API.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setAddresses(data.addresses || []);

      const defaultAddress = data.addresses.find((item) => item.isDefault);

      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const discount =
    subtotal >= 50000
      ? Math.round(subtotal * 0.1)
      : Math.round(subtotal * 0.05);

  const deliveryCharge = subtotal >= 999 ? 0 : 99;

  const platformFee = cartItems.length > 0 ? 19 : 0;

  const total = subtotal - discount + deliveryCharge + platformFee;

  const placeOrder = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!selectedAddress) {
        alert("Please select a delivery address");
        return;
      }

      const orderData = {
        orderItems: cartItems,

        shippingAddress: {
          address: selectedAddress.address,
          city: selectedAddress.city,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
        },

        paymentMethod,

        totalPrice: total,
      };

      await API.post("/orders", orderData, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      localStorage.removeItem("cartItems");

      alert("Order Placed Successfully");

      window.location.href = "/myorders";
    } catch (error) {
      alert(error.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-white mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}

          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address */}

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">
                  Delivery Address
                </h2>

                <button
                  onClick={() => setShowAddressModal(true)}
                  className="
                  bg-orange-500
                  hover:bg-orange-600
                  px-6
                  py-3
                  rounded-xl
                  text-white
                  font-semibold
                  transition
                  "
                >
                  Change
                </button>
              </div>

              {selectedAddress ? (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                      {selectedAddress.label}
                    </span>

                    {selectedAddress.isDefault && (
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                        Default
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    {selectedAddress.fullName}
                  </h3>

                  <p className="text-gray-300 mt-2">{selectedAddress.phone}</p>

                  <p className="text-gray-400 mt-4 leading-8">
                    {selectedAddress.address}
                    <br />
                    {selectedAddress.city}, {selectedAddress.state}
                    <br />
                    {selectedAddress.postalCode}, {selectedAddress.country}
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-gray-400 text-2xl">
                    No Address Selected
                  </h3>
                </div>
              )}
            </div>

            {/* Payment */}

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-white mb-8">
                Payment Method
              </h2>

              <div className="space-y-5">
                <label className="flex gap-4 items-center text-white cursor-pointer">
                  <input
                    type="radio"
                    value="Cash On Delivery"
                    checked={paymentMethod === "Cash On Delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash On Delivery
                </label>

                <label className="flex gap-4 items-center text-white cursor-pointer">
                  <input
                    type="radio"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  UPI
                </label>

                <label className="flex gap-4 items-center text-white cursor-pointer">
                  <input
                    type="radio"
                    value="Card"
                    checked={paymentMethod === "Card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Credit / Debit Card
                </label>
              </div>
            </div>
          </div>

          {/* Price Details */}

          <div>
            <div className="sticky top-28 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
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
                    - ₹ {discount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-300">Delivery</span>

                  <span className="text-green-400">
                    {deliveryCharge === 0 ? "FREE" : `₹ ${deliveryCharge}`}
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

                <button
                  onClick={placeOrder}
                  className="
                  mt-8
                  w-full
                  bg-orange-500
                  hover:bg-orange-600
                  py-4
                  rounded-2xl
                  text-white
                  text-xl
                  font-bold
                  transition
                  "
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Change Address Modal */}

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-900 p-8 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                Select Delivery Address
              </h2>

              <button
                onClick={() => setShowAddressModal(false)}
                className="text-4xl text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl text-gray-400">No Saved Address</h3>

                <p className="text-gray-500 mt-3">
                  Please add an address from your Profile page.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {addresses.map((item) => (
                  <div
                    key={item._id}
                    className={`
                      rounded-2xl
                      border
                      p-6
                      transition
                      ${
                        selectedAddress?._id === item._id
                          ? "border-orange-500 bg-orange-500/10"
                          : "border-white/10 bg-white/5"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="rounded-full bg-orange-500/20 px-3 py-1 text-sm font-semibold text-orange-400">
                        {item.label}
                      </span>

                      {item.isDefault && (
                        <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400">
                          Default
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-white">
                      {item.fullName}
                    </h3>

                    <p className="mt-2 text-gray-300">{item.phone}</p>

                    <p className="mt-4 leading-7 text-gray-400">
                      {item.address}
                      <br />
                      {item.city}, {item.state}
                      <br />
                      {item.postalCode}, {item.country}
                    </p>

                    <button
                      onClick={() => {
                        setSelectedAddress(item);
                        setShowAddressModal(false);
                      }}
                      className="
                      mt-6
                      rounded-xl
                      bg-orange-500
                      px-6
                      py-3
                      font-semibold
                      text-white
                      transition
                      hover:bg-orange-600
                      "
                    >
                      Deliver Here
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;