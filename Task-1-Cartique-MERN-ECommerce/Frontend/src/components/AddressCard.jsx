function AddressCard({ address, onMakeDefault, onEdit, onDelete }) {
  return (
    <div
      className="
      bg-white/5
      backdrop-blur-xl
      border
      border-white/10
      rounded-2xl
      p-6
      hover:border-orange-500/40
      transition
      "
    >
      {address.isDefault && (
        <span
          className="
          inline-block
          bg-green-500/20
          text-green-400
          px-3
          py-1
          rounded-full
          text-sm
          font-semibold
          mb-4
          "
        >
          Default Address
        </span>
      )}

      <div className="flex items-center gap-3">
        <span
          className="
    bg-orange-500/20
    text-orange-400
    px-3
    py-1
    rounded-full
    text-sm
    font-semibold
    "
        >
          {address.label === "Home" && "🏠 Home"}
          {address.label === "Office" && "💼 Office"}
          {address.label === "Other" && "📍 Other"}
        </span>

        <h3 className="text-2xl font-bold text-white">{address.fullName}</h3>
      </div>

      <p className="text-gray-300 mt-2">📞 {address.phone}</p>

      <p className="text-gray-300 mt-3">{address.address}</p>

      <p className="text-gray-400">
        {address.city}, {address.state}
      </p>

      <p className="text-gray-400">
        {address.postalCode}, {address.country}
      </p>

      <div className="flex gap-3 mt-6">
        {!address.isDefault && (
          <button
            onClick={onMakeDefault}
            className="
            bg-blue-500
            hover:bg-blue-600
            text-white
            px-4
            py-2
            rounded-lg
            transition
            "
          >
            Make Default
          </button>
        )}

        <button
          onClick={onEdit}
          className="
          bg-orange-500
          hover:bg-orange-600
          text-white
          px-4
          py-2
          rounded-lg
          transition
          "
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          className="
          bg-red-500
          hover:bg-red-600
          text-white
          px-4
          py-2
          rounded-lg
          transition
          "
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default AddressCard;
