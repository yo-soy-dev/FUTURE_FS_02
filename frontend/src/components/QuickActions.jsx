import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div
        onClick={() => navigate("/leads")}
        className="cursor-pointer bg-white p-5 rounded shadow hover:shadow-lg transition"
      >
        <h3 className="font-semibold text-lg">📋 Manage Leads</h3>
        <p className="text-sm text-gray-500 mt-1">
          View, edit & update lead status
        </p>
      </div>

      <div
        onClick={() => navigate("/admin/support")}
        className="cursor-pointer bg-white p-5 rounded shadow hover:shadow-lg transition"
      >
        <h3 className="font-semibold text-lg">🛠 Support Tickets</h3>
        <p className="text-sm text-gray-500 mt-1">
          Respond to client issues
        </p>
      </div>

      <div
        onClick={() => navigate("/inventory")}
        className="cursor-pointer bg-white p-5 rounded shadow hover:shadow-lg transition"
      >
        <h3 className="font-semibold text-lg">📦 Inventory</h3>
        <p className="text-sm text-gray-500 mt-1">
          Manage products & stock
        </p>
      </div>

    </div>
  );
}
