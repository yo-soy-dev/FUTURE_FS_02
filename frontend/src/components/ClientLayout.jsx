import { Outlet } from "react-router-dom";
import ClientNavbar from "../components/ClientNavbar";
import ClientSidebar from "../components/ClientSidebar";
import { useState } from "react";

export default function ClientLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <ClientSidebar isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col md:ml-60">
        <ClientNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
