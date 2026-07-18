import React from "react";
import { Link } from "react-router-dom";
import { Leaf, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-10 max-w-md border-slate-800 shadow-2xl flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6">
          <Leaf className="w-8 h-8 text-emerald-400 animate-pulse" />
        </div>
        <h1 className="font-outfit text-6xl font-black text-emerald-500 mb-2">404</h1>
        <h2 className="font-outfit text-xl font-bold text-slate-100 mb-4">
          Ecological Path Not Found
        </h2>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          The page you are looking for has been recycled, moved, or never existed in our ecosystem.
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
