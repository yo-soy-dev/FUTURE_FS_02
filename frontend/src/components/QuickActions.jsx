import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


export default function QuickActions() {
  const navigate = useNavigate();

   const handleClick = (path, message) => {
    navigate(path);
    toast.success(message);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      
      <div
        onClick={() => navigate("/leads")}
        className="cursor-pointer bg-white p-4 md:p-5 rounded shadow hover:shadow-lg transition"
      >
        <h3 className="font-semibold text-lg md:text-xl">📋 Manage Leads</h3>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          View, edit & update lead status
        </p>
      </div>

      <div
        // onClick={() => navigate("/admin/support")}
         onClick={() => handleClick("/admin/support", "Opening Support Tickets...")}
        className="cursor-pointer bg-white p-4 md:p-5 rounded shadow hover:shadow-lg transition"
      >
        <h3 className="font-semibold text-lg md:text-xl">🛠 Support Tickets</h3>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Respond to client issues
        </p>
      </div>

      <div
        onClick={() => handleClick("/inventory", "Opening Inventory...")}
        className="cursor-pointer bg-white p-4 md:p-5 rounded shadow hover:shadow-lg transition"
      >
        <h3 className="font-semibold text-lg md:text-xl">📦 Inventory</h3>
        <p className="text-sm  md:text-base text-gray-500 mt-1">
          Manage products & stock
        </p>
      </div>

    </div>
  );
}
