const products = [
  {
    name: "iPhone 16 Pro Max",
    description: "Apple flagship smartphone with premium design.",
    price: 149999,
    category: "Smartphones",
    image: "/products/iphone 16 pro max.jpg",
    stock: 20,
  },

  {
    name: "Samsung Galaxy S25 Ultra",
    description: "Samsung premium flagship smartphone.",
    price: 129999,
    category: "Smartphones",
    image: "/products/Samsung Galaxy S25 Ultra.jpg",
    stock: 15,
  },

  {
    name: "OnePlus 13",
    description: "Smooth performance with Snapdragon chipset.",
    price: 69999,
    category: "Smartphones",
    image: "/products/OnePlus 13.jpg",
    stock: 25,
  },

  {
    name: "Nothing Phone 3",
    description: "Stylish transparent smartphone.",
    price: 54999,
    category: "Smartphones",
    image: "/products/Nothing Phone 3.jpg",
    stock: 18,
  },

  {
    name: "Google Pixel 9 Pro",
    description: "Google AI powered smartphone.",
    price: 109999,
    category: "Smartphones",
    image: "/products/Google Pixel 9 Pro.jpg",
    stock: 10,
  },

  {
    name: "Xiaomi 15 Ultra",
    description: "Premium camera flagship.",
    price: 89999,
    category: "Smartphones",
    image: "/products/Xiaomi 15 Ultra.jpg",
    stock: 12,
  },

  {
    name: "MacBook Air M4",
    description: "Apple lightweight laptop.",
    price: 114999,
    category: "Laptops",
    image: "/products/MacBook Air M4.jpg",
    stock: 10,
  },

  {
    name: "Dell XPS 15",
    description: "Premium Windows ultrabook.",
    price: 149999,
    category: "Laptops",
    image: "/products/Dell XPS 15.jpg",
    stock: 8,
  },

  {
    name: "ASUS ROG Strix",
    description: "Gaming laptop with powerful performance.",
    price: 139999,
    category: "Laptops",
    image: "/products/ASUS ROG Strix.jpg",
    stock: 7,
  },

  {
    name: "Lenovo Legion 5",
    description: "Gaming laptop for enthusiasts.",
    price: 119999,
    category: "Laptops",
    image: "/products/Lenovo Legion 5.jpg",
    stock: 9,
  },

  {
    name: "HP Omen 16",
    description: "High performance gaming laptop.",
    price: 129999,
    category: "Laptops",
    image: "/products/HP Omen 16.jpg",
    stock: 6,
  },

  {
    name: "AirPods Pro 2",
    description: "Active Noise Cancellation.",
    price: 24999,
    category: "Audio",
    image: "/products/AirPods Pro 2.jpg",
    stock: 30,
  },

  {
    name: "Sony WH-1000XM5",
    description: "Industry leading ANC headphones.",
    price: 29999,
    category: "Audio",
    image: "/products/Sony WH-1000XM5.jpg",
    stock: 22,
  },

  {
    name: "Samsung Galaxy Buds 3 Pro",
    description: "Premium wireless earbuds.",
    price: 14999,
    category: "Audio",
    image: "/products/Samsung Galaxy Buds 3 Pro.jpg",
    stock: 20,
  },

  {
    name: "boAt Nirvana 751 ANC",
    description: "Wireless ANC headphones.",
    price: 4999,
    category: "Audio",
    image: "/products/boAt Nirvana 751 ANC.jpg",
    stock: 40,
  },

  {
    name: "Nothing Ear (a)",
    description: "Stylish wireless earbuds.",
    price: 7999,
    category: "Audio",
    image: "/products/Nothing Ear (a).jpg",
    stock: 25,
  },

  {
    name: "Apple Watch Series 10",
    description: "Premium smartwatch.",
    price: 49999,
    category: "Smart Watches",
    image: "/products/Apple Watch Series 10.jpg",
    stock: 12,
  },

  {
    name: "Samsung Galaxy Watch 7",
    description: "Advanced Android smartwatch.",
    price: 32999,
    category: "Smart Watches",
    image: "/products/Samsung Galaxy Watch 7.jpg",
    stock: 15,
  },

  {
    name: "OnePlus Watch 3",
    description: "Elegant smartwatch.",
    price: 24999,
    category: "Smart Watches",
    image: "/products/OnePlus Watch 3.jpg",
    stock: 18,
  },

  {
    name: "Amazfit Balance",
    description: "Fitness and health smartwatch.",
    price: 19999,
    category: "Smart Watches",
    image: "/products/Amazfit Balance.jpg",
    stock: 20,
  },

  {
    name: "PlayStation 5",
    description: "Sony next generation console.",
    price: 54999,
    category: "Gaming",
    image: "/products/PlayStation 5.jpg",
    stock: 10,
  },

  {
    name: "Xbox Series X",
    description: "Microsoft gaming console.",
    price: 52999,
    category: "Gaming",
    image: "/products/Xbox Series X.jpg",
    stock: 10,
  },

  {
    name: "DualSense Wireless Controller",
    description: "PS5 wireless controller.",
    price: 6999,
    category: "Gaming",
    image: "/products/DualSense Wireless Controller.jpg",
    stock: 30,
  },

  {
    name: "ASUS ROG Ally X",
    description: "Portable gaming handheld.",
    price: 79999,
    category: "Gaming",
    image: "/products/ASUS ROG Ally X.jpg",
    stock: 8,
  },

  {
    name: "Canon EOS R50",
    description: "Mirrorless camera.",
    price: 68999,
    category: "Cameras",
    image: "/products/Canon EOS R50.jpg",
    stock: 8,
  },

  {
    name: "Sony Alpha A6700",
    description: "Professional mirrorless camera.",
    price: 119999,
    category: "Cameras",
    image: "/products/Sony Alpha A6700.jpg",
    stock: 5,
  },

  {
    name: "Fujifilm Instax Mini 12",
    description: "Instant camera.",
    price: 6999,
    category: "Cameras",
    image: "/products/Fujifilm Instax Mini 12.jpg",
    stock: 15,
  },

  {
    name: "iPad Air M3",
    description: "Powerful Apple tablet.",
    price: 69999,
    category: "Tablets",
    image: "/products/iPad Air M3.jpg",
    stock: 12,
  },

  {
    name: "Samsung Galaxy Tab S10+",
    description: "Premium Android tablet.",
    price: 84999,
    category: "Tablets",
    image: "/products/Samsung Galaxy Tab S10+.jpg",
    stock: 10,
  },

  {
    name: "Xiaomi Pad 7 Pro",
    description: "High performance Android tablet.",
    price: 42999,
    category: "Tablets",
    image: "/products/Xiaomi Pad 7 Pro.jpg",
    stock: 15,
  },
];

module.exports = products;
