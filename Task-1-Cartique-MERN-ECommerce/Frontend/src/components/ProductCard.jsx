import { Link } from "react-router-dom";

function ProductCard({ product, highlighted }) {
  return (
    <div
      className={`
  bg-white/5
  backdrop-blur-xl
  border border-white/10
  rounded-3xl
  overflow-hidden
  shadow-xl
  transition-all
  duration-500
  w-[300px]

  ${
    highlighted
      ? "ring-4 ring-orange-500 scale-105 shadow-[0_0_40px_rgba(249,115,22,0.8)]"
      : "hover:scale-105 hover:shadow-2xl"
  }
  `}
    >
      {/* Product Image */}

      <div className="bg-white p-6 flex justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="
          h-52
          object-contain
          hover:scale-110
          transition
          duration-300
          "
        />
      </div>

      {/* Product Info */}

      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>

        <span
          className="
          inline-block
          px-3
          py-1
          rounded-full
          bg-white/10
          text-gray-300
          text-sm
          mb-4
          "
        >
          {product.category}
        </span>

        <h3 className="text-3xl font-bold text-orange-400 mb-6">
          ₹ {product.price}
        </h3>

        <Link
          to={`/product/${product._id}`}
          className="
          block
          text-center
          bg-orange-500
          hover:bg-orange-600
          text-white
          py-3
          rounded-xl
          font-semibold
          transition
          "
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
