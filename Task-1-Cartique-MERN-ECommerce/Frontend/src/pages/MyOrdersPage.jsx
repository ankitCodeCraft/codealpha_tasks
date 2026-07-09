import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        const { data } = await API.get("/orders/myorders", {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        setOrders(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-black text-white">My Orders</h1>

          <p className="text-gray-400 mt-3">
            Track your purchases and view order history.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center">
            <h2 className="text-3xl font-bold text-white">No Orders Yet</h2>

            <p className="text-gray-400 mt-3">
              Start shopping to see your orders here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="
              bg-white/5
              border
              border-white/10
              rounded-3xl
              p-8
              hover:border-orange-500/40
              transition
              "
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Order #{order._id.slice(-8)}
                    </h2>

                    <p className="text-gray-400 mt-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <h2 className="text-3xl font-bold text-orange-400">
                      ₹ {order.totalPrice.toLocaleString()}
                    </h2>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-5">
                    <div>
                      <p className="text-gray-400 mb-2">Payment Status</p>

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          order.isPaid
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </div>

                    <div>
                      <p className="text-gray-400 mb-2">Payment Method</p>

                      <p className="text-white">{order.paymentMethod}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 mb-2">Products</p>

                      <p className="text-white">
                        {order.orderItems.length} Item(s)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <p className="text-gray-400 mb-2">Delivery Status</p>

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          order.isDelivered
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {order.isDelivered ? "Delivered" : "Processing"}
                      </span>
                    </div>

                    <div>
                      <p className="text-gray-400 mb-2">Delivery Address</p>

                      <p className="text-white leading-7">
                        {order.shippingAddress.address}
                        <br />
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-gray-400 mb-4">Products</p>

                  <div className="space-y-4">
                    {order.orderItems.slice(0, 3).map((item) => (
                      <div
                        key={item._id}
                        className="
        flex
        items-center
        gap-4
        bg-white/5
        border
        border-white/10
        rounded-2xl
        p-4
        "
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="
          w-20
          h-20
          object-cover
          rounded-xl
          bg-white
          "
                        />

                        <div className="flex-1">
                          <h3 className="text-white font-semibold">
                            {item.name}
                          </h3>

                          <p className="text-gray-400 mt-1">
                            Qty : {item.quantity}
                          </p>

                          <p className="text-orange-400 font-bold mt-2">
                            ₹ {item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}

                    {order.orderItems.length > 3 && (
                      <p className="text-orange-400 font-semibold">
                        + {order.orderItems.length - 3} more item(s)
                      </p>
                    )}
                  </div>
                </div>

                <Link to={`/order/${order._id}`}>
                  <button
                    className="
                  mt-8
                  bg-orange-500
                  hover:bg-orange-600
                  px-8
                  py-3
                  rounded-xl
                  text-white
                  font-semibold
                  "
                  >
                    View Order Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrdersPage;
