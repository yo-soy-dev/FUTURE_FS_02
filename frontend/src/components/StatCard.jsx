const colorMap = {
  blue: "border-blue-500",
  yellow: "border-yellow-500",
  purple: "border-purple-500",
  green: "border-green-500",
};

export default function StatCard({ title, value, color }) {
  return (
    <div className={`bg-white p-5 rounded shadow border-l-4 ${colorMap[color]}`}>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}
