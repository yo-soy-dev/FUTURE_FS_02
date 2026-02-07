import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";



export default function RecentLeads() {
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();


  const fetchRecentLeads = async () => {
    try {
      const res = await api.get("/leads");
      setLeads(res.data.slice(0, 5)); 
    } catch (err) {
      toast.error("Failed to fetch recent leads!");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecentLeads();
  }, []);

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-lg md:text-xl">Recent Leads</h2>
        <span onClick={() => navigate("/leads")} className="text-sm md:text-base text-teal-600 cursor-pointer">
          View all
        </span>
      </div>

      <table className="w-full text-sm md:text-base min-w-[600px]">
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
                      ? "text-teal-600"
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
