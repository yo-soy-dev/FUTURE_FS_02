
 export default function Settings() {
  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">⚙️ Account Settings</h2>

      {/* Account Section */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Account</h3>
        <p className="text-gray-500 text-sm mb-3">
          Basic information related to your account.
        </p>

        <p className="text-sm"><strong>Change Name:</strong> Available soon</p>
        <p className="text-sm"><strong>Change Email:</strong> Available soon</p>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Security</h3>
        <p className="text-gray-500 text-sm mb-3">
          Manage your password and login security.
        </p>

        <p className="text-sm"><strong>Change Password:</strong> Coming soon</p>
        <p className="text-sm"><strong>Two-Factor Authentication:</strong> Disabled</p>
      </div>

      <div>
        <h3 className="font-medium mb-2">Preferences</h3>
        <p className="text-gray-500 text-sm mb-3">
          Control how you receive updates and notifications.
        </p>

        <p className="text-sm"><strong>Email Notifications:</strong> Enabled</p>
        <p className="text-sm"><strong>SMS Alerts:</strong> Disabled</p>
      </div>
    </div>
  );
}
