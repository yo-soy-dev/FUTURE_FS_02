
import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function ClientDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [leads, setLeads] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const [openSupport, setOpenSupport] = useState(false);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("General Query");
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [reference, setReference] = useState("");


  const primaryLead = leads.length > 0 ? leads[0] : null;

  const isNewReply = (ticket) => {
    if (!ticket || ticket.status !== "Resolved") return false;
    return new Date(ticket.updatedAt) > new Date(ticket.createdAt);
  };

  

  const isInterested = (planId) => {
    return leads.some(
      l =>
        l.source?.toString() === planId?.toString() &&
        ["New", "Pending", "Approved"].includes(l.status) &&
        l.email === user?.email
    );
  };




  const submitSupport = async () => {
    if (!message.trim()) return alert("Message required");

    try {
      setLoading(true);
      await api.post("/support", { subject, message, reference });
      toast.success("Support request sent successfully");
      setMessage("");
      setReference("");
      setOpenSupport(false);
      fetchMyTickets();
    } catch {
      toast.error("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyLead = async () => {
    try {
      const res = await api.get("/leads/my");
      const data = Array.isArray(res.data) ? res.data.filter(Boolean) : [res.data].filter(Boolean);

      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setLeads(data);
    } catch {
      setLeads([]);
    }
  };

  const fetchMyTickets = async () => {
    try {
      setLoadingTickets(true);
      const res = await api.get("/support/my");
      const data = Array.isArray(res.data) ? res.data.filter(Boolean) : [];
      setTickets(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tickets");
      setTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await api.get("/inventory/public");
      const data = Array.isArray(res.data) ? res.data.filter(Boolean) : [];
      setPlans(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load plans");
      setPlans([]);
    }
  };

  const [sendingInterest, setSendingInterest] = useState(false);

  const sendInterestRequest = async (plan) => {
    if (!plan?._id || sendingInterest || isInterested(plan._id)) return;

    try {
      setSendingInterest(true);
      await api.post("/interest/request", { inventoryId: plan._id });
      toast.success("Interest sent!");
      fetchMyLead();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Already sent!");
    } finally {
      setSendingInterest(false);
    }
  };



  useEffect(() => {
    fetchMyLead();
    fetchMyTickets();
    fetchPlans();
  }, []);

  const statusStyle = {
    Open: "bg-yellow-100 text-yellow-700",
    Resolved: "bg-green-100 text-green-700",
  };

  const leadStyle = {
    New: "bg-teal-100 text-teal-700",
    Contacted: "bg-purple-100 text-purple-700",
    Converted: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">


          <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
            {/* Welcome */}
            <div className="bg-gradient-to-r from-teal-600 to-indigo-600 text-white p-6 rounded shadow">
              <h1 className="text-2xl md:text-3xl font-bold">
                👋 Welcome, {user?.name || "Client"}
              </h1>
              <p className="text-sm md:text-base opacity-90 mt-1">
                Track your requests and support tickets here.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 md:p-6 rounded shadow border-l-4 border-teal-500">
                <h2 className="font-semibold mb-2">👤 Your Profile</h2>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> Client</p>
              </div>

              <div className="bg-white p-4 md:p-6 rounded shadow border-l-4 border-green-500">
                <h2 className="font-semibold mb-2">📌 Lead Status</h2>
                {primaryLead ? (
                  <span
                    className={`px-4 py-1 rounded-full ${leadStyle[primaryLead.status]}`}
                  >
                    {primaryLead.status}
                  </span>
                ) : (
                  <span className="text-gray-400">No lead found</span>
                )}
              </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded shadow">
              <h2 className="font-semibold text-lg mb-4">🏢 Investment Plans</h2>

              {plans.length === 0 ? (
                <p className="text-center text-gray-400 py-6">
                  Loading plans or no plans added by admin.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((p) => (
                    <div key={p._id} className="border p-4 rounded shadow hover:shadow-md transition">
                      <h3 className="font-bold">{p.name}</h3>
                      <p className="text-sm">Price: ₹{p.price}</p>
                      <p className="text-sm">Status: {p.status}</p>

                      <button
                        onClick={() => sendInterestRequest(p)}
                        disabled={isInterested(p._id)}
                        className={`mt-2 px-3 py-1 rounded text-white ${isInterested(p._id)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-teal-600"
                          }`}
                      >
                        {isInterested(p._id)
                          ? "Already Interested"
                          : "Interested"}
                      </button>


                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-4 md:p-6 rounded shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg md:text-xl">🎫 My Support Tickets</h2>
                <button
                  onClick={() => setOpenSupport(true)}
                  className="bg-teal-600 text-white px-4 py-2 rounded-full"
                >
                  + New Ticket
                </button>
              </div>

              {loadingTickets ? (
                <p className="text-gray-500">Loading tickets...</p>
              ) : tickets.length === 0 ? (
                <p className="text-gray-400">No support tickets yet.</p>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket._id} className="border rounded p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{ticket.subject}</h3>
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${statusStyle[ticket.status]}`}
                        >
                          {ticket.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-2">
                        {ticket.message}
                      </p>

                      {ticket.adminReply && (
                        <div
                          className={`mt-3 p-3 text-sm border-l-4 rounded ${isNewReply(ticket)
                            ? "bg-green-100 border-green-600 animate-pulse"
                            : "bg-green-50 border-green-500"
                            }`}
                        >
                          <strong>Admin Reply</strong>
                          <p>{ticket.adminReply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {openSupport && (
          <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
            <div className="w-full sm:w-[400px] bg-white h-full p-4 md:p-6 shadow-xl">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg md:text-xl font-semibold">📩 Contact Support</h2>
                <button onClick={() => setOpenSupport(false)}>✕</button>
              </div>

              <label className="block mb-2 font-medium">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="General Query">General Query</option>
                <option value="Complaint">Complaint</option>
                <option value="Technical Issue">Technical Issue</option>
              </select>

              <label className="block mb-2 font-medium">Reference (Optional)</label>
              <input
                type="text"
                value={reference || ""}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter reference or title"
                className="w-full p-2 border rounded mb-4"
              />

              <label className="block mb-2 font-medium">Message</label>

              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="Describe your issue..."
              />

              <button
                onClick={submitSupport}
                disabled={loading}
                className="w-full md:w-auto py-2 rounded text-white bg-teal-600 hover:bg-teal-700 "
              >
                {loading ? "Sending..." : "Send Ticket"}
              </button>
            </div>
          </div>
        )}
      </>
      );
}

