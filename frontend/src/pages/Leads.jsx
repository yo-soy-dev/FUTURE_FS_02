import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/AdminNavbar";
import LeadTable from "../components/LeadTable";
import LeadForm from "../components/LeadForm";

const Leads = () => {
  const [showForm, setShowForm] = useState(false);
  const [leads, setLeads] = useState([]);
  const [inventories, setInventories] = useState([]);

  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedInventoryId, setSelectedInventoryId] = useState("");

  // 🔹 Fetch leads
  const fetchLeads = async () => {
    const res = await api.get("/leads");
    setLeads(res.data);
  };

  // 🔹 Fetch inventories (for dropdown)
  const fetchInventories = async () => {
    const res = await api.get("/inventory");
    setInventories(res.data);
  };

  useEffect(() => {
    fetchLeads();
    fetchInventories();
  }, []);

  return (
    <>
      <Sidebar />

      <div className="ml-64">
        <Navbar />

        <div className="p-6">

          {/* 🔥 INVENTORY SELECT */}
          <div className="flex gap-3 mb-4">
            <select
              value={selectedInventoryId}
              onChange={(e) => setSelectedInventoryId(e.target.value)}
              className="border p-2 rounded w-72"
            >
              <option value="">Select Inventory</option>
              {inventories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>

            {/* ➕ ADD LEAD */}
            <button
              onClick={() => {
                if (!selectedInventoryId) {
                  alert("Please select inventory first");
                  return;
                }
                setSelectedLead(null);
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + Add Lead
            </button>
          </div>

          {/* 📋 LEAD TABLE */}
          <LeadTable
            leads={leads}
            onEdit={(lead) => {
              setSelectedLead(lead);
              setSelectedInventoryId(lead.source); // 🔥 important
              setShowForm(true);
            }}
            onDelete={async (id) => {
              if (!window.confirm("Are you sure you want to delete this lead?"))
                return;
              await api.delete(`/leads/${id}`);
              fetchLeads();
            }}
          />
        </div>
      </div>

      {/* 🧾 LEAD FORM MODAL */}
      {showForm && (
        <LeadForm
          lead={selectedLead}
          inventoryId={selectedInventoryId}
          refresh={fetchLeads}
          onClose={() => {
            setShowForm(false);
            setSelectedLead(null);
          }}
        />
      )}
    </>
  );
};

export default Leads;
