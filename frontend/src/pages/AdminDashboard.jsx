import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/AdminNavbar";
import StatCard from "../components/StatCard";
import RecentLeads from "../components/RecentLeads";
import QuickActions from "../components/QuickActions";
import toast from "react-hot-toast";


export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    newLeads: 0,
    contacted: 0,
    converted: 0,
  });
  const [interestCount, setInterestCount] = useState(0);

const fetchInterestStats = async () => {
  try {
  const res = await api.get("/interest/pending");
  setInterestCount(res.data.length);
  } catch (err) {
      console.error(err);
      toast.error("Failed to fetch pending interests!");
    }
};


  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leads");
      const leads = res.data;

      setStats({
        total: leads.length,
        newLeads: leads.filter(l => l.status === "New").length,
        contacted: leads.filter(l => l.status === "Contacted").length,
        converted: leads.filter(l => l.status === "Converted").length,
      });
      toast.success("Dashboard data loaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch leads!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchInterestStats();
  }, []);

  return (
    <>
      <Sidebar />

      <div className="ml-64 min-h-screen bg-gray-100">
        <AdminNavbar />

        <div className="p-6 space-y-6">

          {loading ? (
            <p className="text-gray-500">Loading dashboard data...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <StatCard title="Total Leads" value={stats.total} color="blue" />
                <StatCard title="New Leads" value={stats.newLeads} color="yellow" />
                <StatCard title="Contacted" value={stats.contacted} color="purple" />
                <StatCard title="Converted" value={stats.converted} color="green" />
                <StatCard title="Pending Interests" value={interestCount} color="orange" />
              </div>

              <h2 className="text-lg font-semibold">
                Quick Actions
              </h2>
              <QuickActions />
              <RecentLeads />
            </>
          )}
        </div>
      </div>
    </>
  );
}
