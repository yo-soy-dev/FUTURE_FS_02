import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const buildActivityFeed = (leads = [], tickets = []) => {
    const activityList = [];

    leads.forEach((lead) => {
      activityList.push({
        type: "lead",
        title: "Interest Sent",
        description: `You showed interest in a plan`,
        date: lead.createdAt,
        icon: "📌",
      });

      if (lead.status && lead.status !== "New") {
        activityList.push({
          type: "lead-status",
          title: "Lead Status Updated",
          description: `Lead status changed to "${lead.status}"`,
          date: lead.updatedAt || lead.createdAt,
          icon: "🔄",
        });
      }
    });

    tickets.forEach((ticket) => {
      activityList.push({
        type: "ticket",
        title: "Support Ticket Created",
        description: ticket.subject,
        date: ticket.createdAt,
        icon: "🎫",
      });

      if (ticket.adminReply) {
        activityList.push({
          type: "ticket-reply",
          title: "Admin Replied",
          description: "You received a reply from support team",
          date: ticket.updatedAt,
          icon: "💬",
        });
      }

      if (ticket.status === "Resolved") {
        activityList.push({
          type: "ticket-resolved",
          title: "Ticket Resolved",
          description: "Your support ticket was resolved",
          date: ticket.updatedAt,
          icon: "✅",
        });
      }
    });

    return activityList.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);

      const [leadsRes, ticketsRes] = await Promise.all([
        api.get("/leads/my"),
        api.get("/support/my"),
      ]);

      const leads = Array.isArray(leadsRes.data)
        ? leadsRes.data
        : [leadsRes.data].filter(Boolean);

      const tickets = Array.isArray(ticketsRes.data)
        ? ticketsRes.data
        : [];

      const feed = buildActivityFeed(leads, tickets);
      setActivities(feed);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load activity history");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">📊 Activity History</h2>

      {loading ? (
        <p className="text-gray-500">Loading activities...</p>
      ) : activities.length === 0 ? (
        <p className="text-gray-400">No activity found.</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 border rounded hover:bg-gray-50 transition"
            >
              <div className="text-2xl">{activity.icon}</div>

              <div className="flex-1">
                <h3 className="font-medium">{activity.title}</h3>
                <p className="text-sm text-gray-600">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(activity.date).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
