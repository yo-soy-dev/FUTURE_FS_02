export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow">

        {/* Header */}
        <div className="p-6 border-b flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              My Profile
            </h2>
            <p className="text-sm text-gray-500">
              Manage your account information
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span className="font-medium text-gray-800">
              {user?.name || "—"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-800">
              {user?.email || "—"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Role</span>
            <span className="font-medium text-gray-800">
              Client
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
