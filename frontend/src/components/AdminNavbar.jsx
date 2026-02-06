import { useLocation, useNavigate } from "react-router-dom";

export default function AdminNavbar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const isLeadsPage = location.pathname === "/leads";

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">

        <button
          className="md:hidden p-2 bg-slate-900 text-white rounded"
          onClick={() => setOpen((prev) => !prev)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
         <h1 className="text-xl font-bold">Admin Dashboard</h1>
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
