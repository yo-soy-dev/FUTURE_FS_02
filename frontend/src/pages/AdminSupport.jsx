import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [replies, setReplies] = useState({});


  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/support");
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resolveTicket = async (id) => {
    const reply = replies[id];

    if (!reply || !reply.trim()) {
      alert("Reply is required");
      return;
    }

    try {
      await api.patch(`/support/${id}/resolve`, {
        reply,
      });

      setReplies((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });

      fetchTickets();
    } catch (err) {
      console.error("Resolve failed", err);
    }
  };


  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <>
      <Sidebar />

      <div className="ml-64 min-h-screen bg-gray-100">
        <AdminNavbar />

        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">
            Support Tickets
          </h1>

          {/* Loading */}
          {loading && (
            <p className="text-gray-500">Loading tickets...</p>
          )}

          {/* Empty */}
          {!loading && tickets.length === 0 && (
            <p className="text-gray-400">No support tickets found</p>
          )}

          {/* Tickets */}
          <div className="space-y-4">
            {!loading &&
              tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="bg-white p-4 rounded shadow"
                >
                  <p className="text-sm font-semibold">
                    {ticket.email}
                  </p>

                  <p className="text-sm text-gray-600">
                    {ticket.subject}
                  </p>

                  {ticket.reference && (
                    <p className="text-sm text-gray-500 mt-1">
                      <strong>Reference:</strong> {ticket.reference}
                    </p>
                  )}

                  <p className="text-sm mt-2">
                    {ticket.message}
                  </p>

                  {/* Status */}
                  <div className="flex justify-between items-center mt-3">
                    <span
                      className={`text-xs px-2 py-1 rounded ${ticket.status === "Open"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                        }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  {/* OPEN → Reply Box */}
                  {ticket.status === "Open" && (
                    <>
                      <textarea
                        placeholder="Write admin reply..."
                        value={replies[ticket._id] || ""}
                        onChange={(e) =>
                          setReplies({
                            ...replies,
                            [ticket._id]: e.target.value,
                          })
                        }
                        className="w-full mt-3 p-2 border rounded text-sm"
                      />


                      <button
                        onClick={() => resolveTicket(ticket._id)}
                        disabled={!replies[ticket._id]?.trim()}
                        className={`mt-2 px-3 py-1 rounded text-white ${replies[ticket._id]?.trim()
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-400 cursor-not-allowed"
                          }`}
                      >
                        Send Reply & Resolve
                      </button>

                    </>
                  )}

                  {/* RESOLVED → SHOW ADMIN REPLY */}
                  {ticket.status === "Resolved" &&
                    ticket.adminReply && (
                      <div className="mt-2 text-sm bg-green-50 p-2 rounded border-l-4 border-green-500 animate-pulse">
                        <strong>Admin Reply:</strong>{" "}
                        {ticket.adminReply}
                      </div>
                    )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
