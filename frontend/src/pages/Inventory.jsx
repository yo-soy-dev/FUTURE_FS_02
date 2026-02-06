import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/AdminNavbar";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Drawer
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [interestedLeads, setInterestedLeads] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const perPage = 10;

  const [form, setForm] = useState({
    name: "",
    sku: "",
    quantity: 1,
    price: "",
    status: "In Stock",
  });

   const fetchItems = async () => {
    try {
      const res = await api.get("/inventory");
      setItems(res.data);
    } catch (err) {
      toast.error("Failed to fetch items!");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => setPage(1), [search, filter]);

  const validate = () => {
    if (!form.name || !form.sku || !form.price) {
      toast.error("Name, SKU, Price required");
      return false;
    }
    return true;
  };

  const addItem = async () => {
    if (!validate()) return;
    try {
    await api.post("/inventory", {
      ...form,
      quantity: Number(form.quantity),
      price: Number(form.price),
    });
    setForm({ name: "", sku: "", quantity: 1, price: "", status: "In Stock" });
    toast.success("Item added successfully!");
    fetchItems();
    } catch {
      toast.error("Failed to add item!");
    }
  };

  const updateItem = async () => {
    if (!validate()) return;
    try {
      await api.put(`/inventory/${editId}`, form);
      setEditId(null);
      toast.success("Item updated successfully!");
      fetchItems();
    } catch {
      toast.error("Failed to update item!");
    }
  };


  const toggleStatus = async (item) => {
    try {
      await api.put(`/inventory/${item._id}`, {
        status: item.status === "In Stock" ? "Out of Stock" : "In Stock",
      });
      toast.success("Status updated!");
      fetchItems();
    } catch {
      toast.error("Failed to update status!");
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await api.delete(`/inventory/${id}`);
      toast.success("Item deleted!");
      fetchItems();
    } catch {
      toast.error("Failed to delete item!");
    }
  };

  const openInterested = async (item) => {
    setSelectedItem(item);
    setShowDrawer(true);
    const res = await api.get(`/leads/inventory/${item._id}`);
    setInterestedLeads(res.data);
  };

  const filtered = items.filter((i) => {
    const matchSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || i.status === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const data = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Sidebar  open={open} setOpen={setOpen}  />

      <div className="ml-0 md:ml-64 p-4 md:p-6">
        <AdminNavbar open={open} setOpen={setOpen} />

        <h2 className="text-xl md:text-2xl font-bold mb-4">Inventory Management</h2>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <input
            placeholder="Search name or SKU..."
            className="border p-2 rounded flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>In Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>

        {/* FORM */}
        <div className="bg-white border rounded p-4 mb-4 overflow-x-auto">
          <div className="grid grid-cols-5 gap-2">
            {["name", "sku", "quantity", "price"].map((f) => (
              <input
                key={f}
                type={f === "quantity" || f === "price" ? "number" : "text"}
                className="border p-2 rounded"
                placeholder={f.toUpperCase()}
                value={form[f]}
                onChange={(e) =>
                  setForm({ ...form, [f]: e.target.value })
                }
              />
            ))}
            <select
              className="border p-2 rounded w-full"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option>In Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>

          <div className="mt-3 text-right">
            <button
              onClick={editId ? updateItem : addItem}
              className={`px-4 py-2 rounded text-white ${
                editId ? "bg-green-600" : "bg-teal-600"
              }`}
            >
              {editId ? "Update" : "Add"}
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {["Name", "SKU", "Qty", "Price", "Status", "Interested", "Action"].map(
                  (h) => (
                    <th key={h} className="border p-2 text-left text-sm md:text-base">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="border p-2 text-sm md:text-base">{item.name}</td>
                  <td className="border p-2 text-sm md:text-base">{item.sku}</td>
                  <td className="border p-2 text-sm md:text-base">{item.quantity}</td>
                  <td className="border p-2 text-sm md:text-base">₹{item.price}</td>

                  <td className="border p-2">
                    <button
                      onClick={() => toggleStatus(item)}
                      className={`px-2 py-1 rounded text-xs md:text-sm font-semibold ${
                        item.status === "In Stock"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </button>
                  </td>

                  <td className="border p-2">
                    <button
                      onClick={() => openInterested(item)}
                      className="bg-teal-50 text-teal-700 px-2 py-1 rounded text-xs md:text-sm"
                    >
                      {item.interestedCount}
                    </button>
                  </td>

                  <td className="border p-2 text-sm md:text-base">
                     <div className="flex items-center justify-center gap-2 leading-none">
                    <button
                      onClick={() => {
                        setEditId(item._id);
                        setForm(item);
                      }}
                      className="text-teal-600"
                    >
                      Edit
                    </button>

                    <span className="inline-block h-6 md:h-8 w-px bg-gray-400"></span>

                    <button
                      onClick={() => deleteItem(item._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-3 mt-4 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="border px-3 py-1 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages || 1}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="border px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* DRAWER */}
      {showDrawer && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowDrawer(false)}
          />
          <div className="fixed right-0 top-0 w-full sm:w-96 h-full bg-white z-50 shadow-xl p-4 overflow-y-auto">
            <h3 className="text-lg font-bold mb-2">
              Interested Users
            </h3>
            <p className="text-sm mb-3 text-gray-500">
              {selectedItem?.name}
            </p>

            {interestedLeads.length === 0 ? (
              <p className="text-gray-500">No interested users</p>
            ) : (
              <div className="space-y-2">
                {interestedLeads.map((l) => (
                  <div key={l._id} className="border p-2 rounded">
                    <p className="font-semibold">{l.name}</p>
                    <p className="text-xs text-gray-500">{l.email}</p>
                    <span className="text-xs mt-1 inline-block px-2 py-1 rounded bg-gray-100">
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
