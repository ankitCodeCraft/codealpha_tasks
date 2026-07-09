const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    label: {
      type: String,
      enum: ["Home", "Office", "Other"],
      default: "Home",
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    postalCode: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    addresses: [addressSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
