import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/AdminNavbar";
import LeadTable from "../components/LeadTable";
import LeadForm from "../components/LeadForm";
import toast from "react-hot-toast";


const Leads = () => {
  const [showForm, setShowForm] = useState(false);
  const [leads, setLeads] = useState([]);
  const [inventories, setInventories] = useState([]);

  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedInventoryId, setSelectedInventoryId] = useState("");
  const [open, setOpen] = useState(false);

  // 🔹 Fetch leads
  const fetchLeads = async () => {
    try {
    const res = await api.get("/leads");
    setLeads(res.data);
    } catch (err) {
      toast.error("Failed to fetch leads");
    }
  };

  // 🔹 Fetch inventories (for dropdown)
  const fetchInventories = async () => {
    try {
    const res = await api.get("/inventory");
    setInventories(res.data);
    } catch (err) {
      toast.error("Failed to fetch inventories");
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchInventories();
  }, []);

  return (
    <>
      <Sidebar open={open} setOpen={setOpen} />

      <div className="ml-0 md:ml-64">
        <AdminNavbar open={open} setOpen={setOpen} />

        <div className="p-4 md:p-6">

          {/* 🔥 INVENTORY SELECT */}
          <div className="flex flex-col md:flex-row gap-3 mb-4 items-start md:items-center">
            <select
              value={selectedInventoryId}
              onChange={(e) => setSelectedInventoryId(e.target.value)}
              className="border p-2 rounded w-full md:w-72"
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
              className="bg-teal-600 text-white px-4 py-2 rounded w-full md:w-auto mt-2 md:mt-0 hover:bg-teal-700 transition"
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
