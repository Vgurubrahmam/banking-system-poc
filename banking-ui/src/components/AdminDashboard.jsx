import { useEffect,useState } from "react";
import { getAllTransactions } from "../services/api";
function AdminDashboard() {
  const [transactions,setTranscations]=useState([])
  const [loading,setLoading]=useState(false)

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions();
      setTranscations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);
  return (
   <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Super Admin – All Transactions
        </h2>
        <button
          onClick={load}
          disabled={loading}
          className="text-sm px-3 py-1 rounded bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Card</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Amount</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Reason</th>
              <th className="px-3 py-2 text-left">Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-3 py-4 text-center text-slate-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-3 py-2">{t.id}</td>
                  <td className="px-3 py-2">{t.cardNumber}</td>
                  <td className="px-3 py-2 capitalize">{t.type}</td>
                  <td className="px-3 py-2">₹{t.amount.toFixed(2)}</td>
                  <td className="px-3 py-2">{t.status}</td>
                  <td className="px-3 py-2">{t.reason}</td>
                  <td className="px-3 py-2 text-xs">
  {new Date(t.timestamp).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}
</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
