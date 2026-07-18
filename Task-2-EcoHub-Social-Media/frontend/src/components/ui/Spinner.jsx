import React from "react";

const Spinner = ({ size = "md" }) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-10 h-10 border-[3px]",
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div
        className={`${sizes[size]} rounded-full border-[var(--ig-border-light)] border-t-[var(--ig-text)] animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default Spinner;
