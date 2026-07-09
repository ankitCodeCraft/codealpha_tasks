const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const newAddress = {
      fullName: req.body.fullName,
      phone: req.body.phone,
      label: req.body.label,

      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      country: req.body.country,

      isDefault: user.addresses.length === 0,
    };

    user.addresses.push(newAddress);

    await user.save();

    res.status(201).json({
      message: "Address Added Successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.addresses.forEach((address) => {
      address.isDefault = address._id.toString() === req.params.id;
    });

    await user.save();

    res.status(200).json({
      message: "Default Address Updated",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.addresses = user.addresses.filter(
      (address) => address._id.toString() !== req.params.id,
    );

    if (
      user.addresses.length > 0 &&
      !user.addresses.some((address) => address.isDefault)
    ) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      message: "Address Deleted Successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        message: "You cannot delete your own admin account",
      });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const toggleAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isAdmin = !user.isAdmin;

    await user.save();

    res.status(200).json({
      message: user.isAdmin ? "User promoted to Admin" : "Admin rights removed",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalUsers = await User.countDocuments();

    const totalOrders = await Order.countDocuments();

    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    res.status(200).json({
      products: totalProducts,
      users: totalUsers,
      orders: totalOrders,
      revenue: revenue.length ? revenue[0].totalRevenue : 0,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUserProfile,
  updateUserProfile,
  addAddress,
  setDefaultAddress,
  deleteAddress,
  deleteUser,
  toggleAdmin,
  getDashboardStats,
};
