import { useEffect, useState } from "react";
import API from "../api/api";
import AddressCard from "../components/AddressCard";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [label, setLabel] = useState("Home");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const { data } = await API.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setUser(data);
      setAddresses(data.addresses || []);
    } catch (error) {
      console.log(error);
    }
  };

  const addNewAddress = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const { data } = await API.post(
        "/auth/address",
        {
          fullName,
          phone,
          label,
          address,
          city,
          state,
          postalCode,
          country,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      setAddresses(data.addresses);

      setFullName("");
      setPhone("");
      setLabel("Home");
      setAddress("");
      setCity("");
      setState("");
      setPostalCode("");
      setCountry("");

      setShowAddressForm(false);

      alert("Address Added Successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to Add Address");
    }
  };

  const makeDefault = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const { data } = await API.put(
        `/auth/address/${id}/default`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      setAddresses(data.addresses);
    } catch (error) {
      alert("Failed to update default address");
    }
  };
  const deleteAddress = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?",
    );

    if (!confirmDelete) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const { data } = await API.delete(`/auth/address/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setAddresses(data.addresses);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete address");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white text-2xl">
        Loading...
      </div>
    );
  }
  return (
    <div className="min-h-screen px-6 py-10 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}

        <div
          className="
          bg-gradient-to-r
          from-slate-900
          via-slate-800
          to-slate-900
          rounded-3xl
          p-10
          border
          border-white/10
          shadow-[0_0_50px_rgba(255,140,0,0.15)]
          "
        >
          <div className="flex items-center gap-6">
            <div
              className="
              w-24
              h-24
              rounded-full
              bg-orange-500/20
              border
              border-orange-500/20
              flex
              justify-center
              items-center
              text-5xl
              "
            >
              👤
            </div>

            <div>
              <h1 className="text-4xl font-black text-white">{user.name}</h1>

              <p className="text-gray-300 mt-2">{user.email}</p>

              <span
                className="
                inline-block
                mt-4
                px-4
                py-2
                rounded-full
                bg-orange-500/20
                text-orange-400
                text-sm
                font-semibold
                "
              >
                {user.isAdmin ? "Administrator" : "Customer"}
              </span>
            </div>
          </div>
        </div>

        {/* Saved Addresses */}

        <div
          className="
          bg-white/5
          backdrop-blur-xl
          border
          border-white/10
          rounded-3xl
          p-8
          mt-8
          "
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Saved Addresses</h2>

            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
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
              {showAddressForm ? "Cancel" : "+ Add New Address"}
            </button>
          </div>
          {showAddressForm && (
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-2xl font-bold text-white mb-6">
                Add New Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="p-4 rounded-xl bg-white/10 text-white outline-none"
                />
                <div className="md:col-span-2">
                  <label className="block text-white font-semibold mb-3">
                    Address Type
                  </label>

                  <div className="flex gap-4">
                    {["Home", "Office", "Other"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setLabel(item)}
                        className={`
          px-6
          py-3
          rounded-xl
          font-semibold
          transition

          ${
            label === item
              ? "bg-orange-500 text-white"
              : "bg-white/10 text-gray-300 hover:bg-white/20"
          }
        `}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="p-4 rounded-xl bg-white/10 text-white outline-none"
                />

                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="md:col-span-2 p-4 rounded-xl bg-white/10 text-white outline-none"
                />

                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="p-4 rounded-xl bg-white/10 text-white outline-none"
                />

                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="p-4 rounded-xl bg-white/10 text-white outline-none"
                />

                <input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="p-4 rounded-xl bg-white/10 text-white outline-none"
                />

                <input
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="p-4 rounded-xl bg-white/10 text-white outline-none"
                />
              </div>

              <button
                onClick={addNewAddress}
                className="
                mt-6
                bg-orange-500
                hover:bg-orange-600
                text-white
                px-8
                py-3
                rounded-xl
                font-semibold
                transition
                "
              >
                Save Address
              </button>
            </div>
          )}

          {addresses.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-gray-400">
                No Saved Addresses
              </h3>

              <p className="text-gray-500 mt-3">
                Click "Add New Address" to save your first address.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {addresses.map((item) => (
                <AddressCard
                  key={item._id}
                  address={item}
                  onMakeDefault={() => makeDefault(item._id)}
                  onEdit={() => alert("Edit feature coming next")}
                  onDelete={() => deleteAddress(item._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;