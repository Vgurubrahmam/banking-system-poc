import {  useEffect, useState } from "react";
import { getCustomerTransactions, makeTransaction } from "../services/api";

function CustomerDashboard({ user }) {
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [type, setType] = useState("topup");
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
const [transactions,setTranscations]=useState([])
const [loadingHistory,setLoadingHistory]=useState(false)


  const loadHistory=async ()=>{
    try{

      setLoadingHistory(true)
      const data=await getCustomerTransactions(user.cardNumber)
      setTranscations(data)
    }catch(error){
        console.error(error);
        
    }finally{
      setLoadingHistory(false)
    }
  }

  useEffect(()=>{
    if (!user) return;
    loadHistory()
  },[])
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await makeTransaction({
        cardNumber: user.cardNumber,
        pin,
        amount: parseFloat(amount),
        type,
      });

      setMessage(`${result.status}: ${result.message}`);
      if (result.balance != null) setBalance(result.balance);
      await loadHistory()
    } catch (err) {
      setMessage("Error talking to server",err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        Customer Dashboard
      </h2>

      <div className="mb-4 text-sm text-slate-700">
        <p><b>Card Number:</b> {user.cardNumber}</p>
        {balance !== null && (
          <p><b>Current Balance:</b> ₹{balance.toFixed(2)}</p>
        )}
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Amount
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-slate-300"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              required
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Transaction Type
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-slate-300"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="topup">Top-up</option>
              <option value="withdraw">Withdraw</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            PIN
          </label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-slate-300"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 disabled:opacity-60"
        >
          {loading ? "Processing..." : "Submit"}
        </button>

      {message && (
        <p className="mt-4 text-sm">
          {message}
        </p>
      )}
      </form>
{/* History Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Transaction History</h3>
          <button
            onClick={loadHistory}
            disabled={loadingHistory}
            className="text-sm px-3 py-1 rounded bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {loadingHistory ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">ID</th>
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
                  <td colSpan="6" className="px-3 py-4 text-center text-slate-500">
                    No transactions yet.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="px-3 py-2">{t.id}</td>
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
    </div>
  );
}

export default CustomerDashboard;
