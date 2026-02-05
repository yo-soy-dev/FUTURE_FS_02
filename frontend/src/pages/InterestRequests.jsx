import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/AdminNavbar";
import toast from "react-hot-toast";

export default function InterestRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await api.get("/interest/pending");
            setRequests(res.data);
        } catch {
            toast.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    const approveRequest = async (id) => {
        try {
            await api.post(`/interest/approve/${id}`);
            toast.success("Approved & Lead created");
            fetchRequests();
        } catch {
            toast.error("Approval failed");
        }
    };

    const rejectRequest = async (id) => {
        try {
            await api.post(`/interest/reject/${id}`);
            toast.success("Request rejected");
            fetchRequests();
        } catch {
            toast.error("Reject failed");
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <>
            <Sidebar />

            <div className="ml-0 md:ml-64 min-h-screen bg-gray-100">
                <AdminNavbar />

                <div className="p-6">
                    <h1 className="text-xl font-bold mb-4">
                        📩 Interest Requests
                    </h1>

                    {loading ? (
                        <p>Loading...</p>
                    ) : requests.length === 0 ? (
                        <p className="text-gray-400 text-center py-10">
                            🎉 No pending interest requests
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((r) => (
                                <div
                                    key={r._id}
                                    className="bg-white border rounded p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold">{r.name}</p>
                                        <p className="text-sm text-gray-600">{r.email}</p>
                                        <p className="text-sm mt-1">
                                            Inventory: <b>{r.inventory?.name}</b>
                                        </p>
                                    </div>

                                    <div className="flex gap-2 mt-3 sm:mt-0">
                                        <button
                                            onClick={() => approveRequest(r._id)}
                                            className="bg-green-600 text-white px-3 py-2 sm:px-3 sm:py-1 rounded w-full sm:w-auto"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() => rejectRequest(r._id)}
                                            className="bg-red-600 text-white px-3 py-2 sm:px-3 sm:py-1 rounded w-full sm:w-auto"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}
