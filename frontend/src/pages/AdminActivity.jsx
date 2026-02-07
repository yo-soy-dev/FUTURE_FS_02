

import { useEffect, useState } from "react";
import api from "../services/api";
import { Loader2, Activity } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/activity");
      setActivities(res.data);
    } catch (err) {
      console.error("Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = activities
    .filter(a => filter === "ALL" || a.module === filter)
    .filter(a =>
      a.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      (a.description && a.description.toLowerCase().includes(search.toLowerCase()))
    );

  const badgeColor = (action) => {
    if (action.includes("CREATE")) return "bg-green-100 text-green-700";
    if (action.includes("UPDATE")) return "bg-blue-100 text-blue-700";
    if (action.includes("DELETE") || action.includes("REJECT"))
      return "bg-red-100 text-red-700";
    if (action.includes("APPROVE")) return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex ">
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex-1 md:ml-64 p-6">
        <AdminNavbar open={open} setOpen={setOpen} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Activity className="text-gray-500" /> Activity Logs
            </h1>
            <p className="text-sm text-gray-500 ">
              System-wide audit trail of user actions
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input
              type="text"
              placeholder="Search by email or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-full sm:w-64 focus:ring-2 focus:ring-indigo-200"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-full sm:w-48"
            >
              <option value="ALL">All Modules</option>
              <option value="Lead">Lead</option>
              <option value="Interest">Interest</option>
              <option value="Support">Support</option>
              <option value="Inventory">Inventory</option>
              <option value="Auth">Auth</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-16 text-gray-500 flex flex-col items-center gap-2">
              <Activity className="text-gray-300 w-12 h-12" />
              No activity found
            </div>
          ) : (
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Module</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredActivities.map((log) => (
                  <tr
                    key={log._id}
                    className="border-t hover:bg-gray-50 transition-all duration-150"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">
                        {log.userName && log.userName !== "Unknown" ? log.userName : log.userEmail}
                      </div>
                      <div className="text-xs text-gray-500">{log.role}</div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                        {log.module}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-600">{log.description}</td>

                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(log.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
