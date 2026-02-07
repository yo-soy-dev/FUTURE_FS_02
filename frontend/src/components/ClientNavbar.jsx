import { useEffect, useState } from "react";

export default function ClientNavbar({ onMenuClick }) {

  const clientTaglines = [
    "You ask. We respond.",
    "From interest to response",
    "Your requests, our follow-ups",
    "Nothing lost. Everything logged.",
    "Where requests get answers"
  ];

  const [tagline, setTagline] = useState("");

  useEffect(() => {
    const random =
      clientTaglines[Math.floor(Math.random() * clientTaglines.length)];
    setTagline(random);
  }, []);


  return (
    <div className="bg-white shadow px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-2xl"
          onClick={onMenuClick}
        >
          ☰
        </button>

        <h1 className="text-xl font-bold">
          <span className="text-rose-500">C</span>
          <span className="text-amber-500">R</span>
          <span className="text-emerald-500">M</span>
        </h1>
      </div>

      <span className="hidden md:block text-sm text-gray-500">
        {tagline}
      </span>

    </div>
  );
}
