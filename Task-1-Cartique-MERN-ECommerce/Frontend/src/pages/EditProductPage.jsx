import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

function EditProductPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);

      setName(data.name);
      setBrand(data.brand);
      setCategory(data.category);
      setImage(data.image);
      setPrice(data.price);
      setStock(data.stock);
      setDescription(data.description);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-32 text-white text-3xl">Loading...</div>
    );
  }

  const updateProduct = async (e) => {
    e.preventDefault();

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await API.put(
        `/products/${id}`,
        {
          name,
          brand,
          category,
          description,
          image,
          price,
          stock,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      alert("Product updated successfully");

      navigate("/admin/products");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Update failed");
    }
  };

 return (
   <div className="min-h-screen px-6 py-10">
     <div className="max-w-7xl mx-auto">
       {/* Header */}

       <div className="flex items-center justify-between mb-10">
         <div>
           <h1 className="text-5xl font-black text-white">Edit Product</h1>

           <p className="text-gray-400 mt-3">
             Update your product information.
           </p>
         </div>

         <button
           onClick={() => navigate("/admin/products")}
           className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/10 transition"
         >
           ← Back
         </button>
       </div>

       <form onSubmit={updateProduct}>
         <div className="grid lg:grid-cols-3 gap-8">
           {/* Image */}

           <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
             <h2 className="text-2xl font-bold text-white mb-6">
               Product Image
             </h2>

             <img
               src={image}
               alt={name}
               className="w-full h-80 object-contain bg-white rounded-3xl"
             />

             <div className="mt-6">
               <label className="block text-gray-300 mb-2">Image URL</label>

               <input
                 type="text"
                 value={image}
                 onChange={(e) => setImage(e.target.value)}
                 className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none"
               />
             </div>
           </div>

           {/* Form */}

           <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8">
             <h2 className="text-3xl font-bold text-white mb-8">
               Product Information
             </h2>

             <div className="grid md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-gray-300 mb-2">
                   Product Name
                 </label>

                 <input
                   type="text"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none"
                 />
               </div>

               <div>
                 <label className="block text-gray-300 mb-2">Brand</label>

                 <input
                   type="text"
                   value={brand}
                   onChange={(e) => setBrand(e.target.value)}
                   className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none"
                 />
               </div>

               <div>
                 <label className="block text-gray-300 mb-2">Category</label>

                 <input
                   type="text"
                   value={category}
                   onChange={(e) => setCategory(e.target.value)}
                   className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none"
                 />
               </div>

               <div>
                 <label className="block text-gray-300 mb-2">Price</label>

                 <input
                   type="number"
                   value={price}
                   onChange={(e) => setPrice(e.target.value)}
                   className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none"
                 />
               </div>

               <div>
                 <label className="block text-gray-300 mb-2">Stock</label>

                 <input
                   type="number"
                   value={stock}
                   onChange={(e) => setStock(e.target.value)}
                   className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none"
                 />
               </div>
             </div>

             <div className="mt-6">
               <label className="block text-gray-300 mb-2">Description</label>

               <textarea
                 rows={6}
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none resize-none"
               />
             </div>

             <div className="flex gap-4 mt-10">
               <button
                 type="submit"
                 className="flex-1 bg-orange-500 hover:bg-orange-600 py-4 rounded-2xl text-xl font-bold text-white transition"
               >
                 💾 Save Changes
               </button>

               <button
                 type="button"
                 onClick={() => navigate("/admin/products")}
                 className="px-8 bg-slate-800 hover:bg-slate-700 rounded-2xl font-semibold text-white transition"
               >
                 Cancel
               </button>
             </div>
           </div>
         </div>
       </form>
     </div>
   </div>
 );
}

export default EditProductPage;
