import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

function OrderPage() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        const { data } = await API.get(`/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        setOrder(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-black text-white">Order Details</h1>

            <p className="text-gray-400 mt-2">Order #{order._id.slice(-8)}</p>
          </div>

          <div className="text-right">
            <h2 className="text-4xl font-bold text-orange-400">
              ₹ {order.totalPrice.toLocaleString()}
            </h2>

            <p className="text-gray-400 mt-2">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left */}

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-white mb-8">
                Ordered Products
              </h2>

              <div className="space-y-5">
                {order.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="
                  flex
                  gap-5
                  items-center
                  bg-white/5
                  border
                  border-white/10
                  rounded-2xl
                  p-5
                  "
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="
                    w-24
                    h-24
                    rounded-xl
                    object-cover
                    bg-white
                    "
                    />

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white">
                        {item.name}
                      </h3>

                      <p className="text-gray-400 mt-2">
                        Quantity : {item.quantity}
                      </p>

                      <p className="text-orange-400 text-xl font-bold mt-3">
                        ₹ {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}

          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-8">
                Order Tracking
              </h2>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full bg-green-500"></div>

                  <div>
                    <h3 className="text-white font-semibold">Order Placed</h3>

                    <p className="text-gray-400 text-sm">
                      Your order has been placed successfully.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`w-5 h-5 rounded-full ${
                      order.isDelivered ? "bg-green-500" : "bg-yellow-400"
                    }`}
                  ></div>

                  <div>
                    <h3 className="text-white font-semibold">Processing</h3>

                    <p className="text-gray-400 text-sm">
                      Seller is preparing your order.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`w-5 h-5 rounded-full ${
                      order.isDelivered ? "bg-green-500" : "bg-gray-600"
                    }`}
                  ></div>

                  <div>
                    <h3 className="text-white font-semibold">Shipped</h3>

                    <p className="text-gray-400 text-sm">
                      Package has been shipped.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`w-5 h-5 rounded-full ${
                      order.isDelivered ? "bg-green-500" : "bg-gray-600"
                    }`}
                  ></div>

                  <div>
                    <h3 className="text-white font-semibold">Delivered</h3>

                    <p className="text-gray-400 text-sm">
                      Delivered to your address.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Shipping Address
              </h2>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Price Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Items Total</span>

                    <span>₹ {order.totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span>Delivery Charges</span>

                    <span className="text-green-400">FREE</span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span>Discount</span>

                    <span className="text-green-400">Applied</span>
                  </div>

                  <hr className="border-white/10" />

                  <div className="flex justify-between">
                    <h3 className="text-2xl font-bold text-white">
                      Total Paid
                    </h3>

                    <h3 className="text-3xl font-bold text-orange-400">
                      ₹ {order.totalPrice.toLocaleString()}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-white leading-8">
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city}
                <br />
                {order.shippingAddress.postalCode}
                <br />
                {order.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
