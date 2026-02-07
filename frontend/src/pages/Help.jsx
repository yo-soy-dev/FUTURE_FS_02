
export default function Help() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
            ❓ Help & FAQ
          </h2>
          <p className="text-gray-500 mt-2">
            Find quick answers to common questions about using the CRM.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-lg border hover:shadow transition">
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              📝 How do I create a support ticket?
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              Go to your dashboard and click on <b>“New Ticket”</b> under the support section.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border hover:shadow transition">
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              📊 What does lead status mean?
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              Lead status like <b>New, Pending, Approved, Rejected</b> shows the current processing stage.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border hover:shadow transition">
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              ⭐ How do I show interest in a plan?
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              Simply click the <b>“Interested”</b> button on any available investment plan.
            </p>
          </div>
        </div>

        <div className="mt-10 bg-blue-50 border border-blue-100 p-6 rounded-lg">
          <h4 className="font-medium text-blue-800">
            Still need help?
          </h4>
          <p className="text-sm text-blue-700 mt-1">
            Create a support ticket and our team will get back to you shortly.
          </p>
        </div>

      </div>
    </div>
  );
}
