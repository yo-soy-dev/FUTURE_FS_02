import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const LeadForm = ({ onClose, refresh, lead, inventoryId }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "New",
    source: "",
  });

  const [clients, setClients] = useState([]); 
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        const res = await api.get("/auth?role=client"); 
        setClients(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load clients");
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    if (!lead && inventoryId) {
      setFormData(prev => ({ ...prev, source: inventoryId }));
    }
  }, [inventoryId, lead]);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        status: lead.status || "New",
        source: lead.source,
      });
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      const selectedClient = clients.find(c => c.email === value);
      if (selectedClient) {
        setFormData(prev => ({
          ...prev,
          email: selectedClient.email,
          name: selectedClient.name // ✅ autofill name
        }));
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.source) {
      toast.error("Please select inventory first");
      return;
    }

    if (!formData.email) {
      toast.error("Please select a registered client");
      return;
    }

    try {
      if (lead) {
        await api.put(`/leads/${lead._id}`, formData);
        toast.success("Lead updated successfully");
      } else {
        await api.post("/leads", formData);
        toast.success("Lead added successfully");
      }
      refresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-4 md:p-6 rounded shadow"
      >
        <h2 className="text-xl font-bold mb-4">
          {lead ? "Edit Lead" : "Add New Lead"}
        </h2>

        {!lead ? (
          <select
            name="email"
            className="w-full mb-3 p-2 md:p-3 border rounded text-sm md:text-base"
            value={formData.email}
            onChange={handleChange}
            required
          >
            <option value="">Select registered client</option>
            {clients.map(client => (
              <option key={client._id} value={client.email}>
                {client.email}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="email"
            name="email"
            className="w-full mb-3 p-2 md:p-3 border rounded bg-gray-100 text-sm md:text-base"
            value={formData.email}
            disabled
          />
        )}

        <input
          name="name"
          placeholder="Client Name"
          className="w-full mb-3 p-2 md:p-3 border rounded text-sm md:text-base"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={!lead ? true : false}
        />

        <select
          name="status"
          className="w-full mb-4 p-2 md:p-3 border rounded text-sm md:text-base"
          value={formData.status}
          onChange={handleChange}
        >
          <option>New</option>
          <option>Contacted</option>
          <option>Converted</option>
          <option>Rejected</option>
        </select>

        <div className="flex flex-col md:flex-row justify-end gap-2 md:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="border px-4 py-2 rounded text-sm md:text-base"
          >
            Cancel
          </button>
          <button className="bg-teal-600 text-white px-4 py-2 rounded">
            {lead ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
