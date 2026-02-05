import { useEffect, useState } from "react";
import api from "../services/api";

export default function RecentLeads() {
  const [leads, setLeads] = useState([]);

  const fetchRecentLeads = async () => {
    try {
      const res = await api.get("/leads");
      setLeads(res.data.slice(0, 5)); // latest 5 leads
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecentLeads();
  }, []);

  return (
    <div className="bg-white rounded shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">Recent Leads</h2>
        <span className="text-sm text-blue-600 cursor-pointer">
          View all
        </span>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No recent leads
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead._id} className="border-t">
                <td className="p-3">{lead.name}</td>
                <td>{lead.email}</td>
                <td
                  className={
                    lead.status === "Converted"
                      ? "text-green-600"
                      : lead.status === "New"
                      ? "text-blue-600"
                      : "text-yellow-600"
                  }
                >
                  {lead.status}
                </td>
                <td>
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
