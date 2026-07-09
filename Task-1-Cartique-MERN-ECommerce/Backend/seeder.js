const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/Product");
const products = require("./data/products");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    // Remove old products
    await Product.deleteMany();

    // Insert new products
    await Product.insertMany(products);

    console.log("Products Imported Successfully ✅");

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

importData();
