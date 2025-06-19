import { useEffect, useState } from "react";
import axios from "axios";
import { getEnv } from "../helper/getEnv";
import { showToast } from "../helper/getTostify";
import { useUserStore } from "../store/userStore";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const email = useUserStore((state) => state.email);
  
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${getEnv("VITE_BACKEND_URI")}/user/get-transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (res.data.success===true) {
          setTransactions(res?.data?.transactions || []);
        } else {
          showToast("error", res?.data?.msg || "Failed to fetch transactions");
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
        showToast("error", "Error fetching transactions");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);

  useEffect(()=>{
    console.log('transaction ' , transactions);
    
  },[transactions])

  return (
    <div className="text-white p-4 bg-slate-900 rounded-md shadow-lg border border-slate-800">
      <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>

      {loading ? (
        <div className="text-lg">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="text-lg text-gray-400">No transactions found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-700 text-sm sm:text-base">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="border border-gray-700 px-4 py-2">#</th>
                <th className="border border-gray-700 px-4 py-2">From</th>
                <th className="border border-gray-700 px-4 py-2">To</th>
                <th className="border border-gray-700 px-4 py-2">Amount</th>
                <th className="border border-gray-700 px-4 py-2">Type</th>
                <th className="border border-gray-700 px-4 py-2">Comment</th>
                <th className="border border-gray-700 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, idx) => {
                const isDebit = txn.fromId.email === email;
                const type = isDebit ? "Debit" : "Credit";
                const amount = txn.amount;
                const from = txn.fromId?.fullname || "Unknown";
                const to = txn.toId?.fullname || "Unknown";
                const comment = txn?.comment || "-";
                const date = new Date(txn.createdAt).toLocaleString();

                return (
                  <tr key={txn._id} className="hover:bg-slate-800">
                    <td className="border border-gray-700 px-4 py-2 text-center">
                      {idx + 1}
                    </td>
                    <td className="border border-gray-700 px-4 py-2">{from}</td>
                    <td className="border border-gray-700 px-4 py-2">{to}</td>
                    <td className="border border-gray-700 px-4 py-2">
                      ₹{amount}
                    </td>
                    <td
                      className={`border border-gray-700 px-4 py-2 ${
                        isDebit ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {type}
                    </td>
                    <td className="border border-gray-700 px-4 py-2">
                      {comment}
                    </td>
                    <td className="border border-gray-700 px-4 py-2">{date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transaction;
