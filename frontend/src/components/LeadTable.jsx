import toast from "react-hot-toast";

const statusStyle = {
  New: "bg-gray-100 text-gray-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Converted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const LeadTable = ({ leads, onEdit, onDelete }) => {
  if (!leads.length) {
    return (
      <div className="bg-white border rounded p-6 text-center text-gray-500">
        No leads found
      </div>
    );
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      onDelete(id);
      toast.success("Lead deleted successfully!");
    }
  };

  return (
    <div className="overflow-x-auto bg-white border rounded shadow-sm">
      <table className="w-full table-fixed border border-gray-300 text-xs md:text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left border-r border-gray-300 w-[25%]">
              Name
            </th>
            <th className="p-3 text-left border-r border-gray-300 w-[40%]">
              Email
            </th>
            <th className="p-3 text-left border-r border-gray-300 w-[15%]">
              Status
            </th>
            <th className="p-3 text-center w-[20%]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="border-t border-gray-300 hover:bg-gray-50 transition"
            >
              <td className="p-3 font-medium max-w-[140px] md:max-w-none border-r border-gray-300">
                {lead.name}
              </td>

              <td className="p-3 text-sm text-gray-600 truncate border-r border-gray-300">
                {lead.email}
              </td>

              <td className="p-3 border-r border-gray-300">
                <span
                  className={`text-xs px-2 py-1 rounded font-semibold ${statusStyle[lead.status] || statusStyle.New
                    }`}
                >
                  {lead.status}
                </span>
              </td>

              <td className="p-3 text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(lead)}
                    className="px-3 py-1 text-sm rounded bg-teal-600 text-white hover:bg-teal-700"
                  >
                    Edit
                  </button>

                  <span className="h-6 md:h-8 w-px bg-gray-400"></span>

                  <button
                    onClick={() => onDelete(lead._id)}
                    className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default LeadTable;
