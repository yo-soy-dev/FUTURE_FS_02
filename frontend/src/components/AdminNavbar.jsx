import { useLocation, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const isLeadsPage = location.pathname === "/leads";

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-600 text-sm">
          {user?.name}
        </span>

        {!isLeadsPage && (
          <button
            onClick={() => navigate("/leads")}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            View Leads
          </button>
        )}
      </div>
    </div>
  );
}
