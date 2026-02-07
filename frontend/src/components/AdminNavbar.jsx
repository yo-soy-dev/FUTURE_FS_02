import { useLocation, useNavigate } from "react-router-dom";

export default function AdminNavbar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const isLeadsPage = location.pathname === "/leads";

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center relative">
      <div className="flex items-center gap-4">

        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          ☰
        </button>
        <h1 className="text-xl font-bold">
          <span className="text-rose-500">C</span>
          <span className="text-amber-500">R</span>
          <span className="text-emerald-500">M</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-gray-600 text-sm">
          {user?.name}
        </span>

        {!isLeadsPage && (
          <button
            onClick={() => navigate("/leads")}
            className="bg-teal-600 text-white px-4 py-1 rounded"
          >
            View Leads
          </button>
        )}
      </div>
    </div>
  );
}
