import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import UserSymbol from "../components/UserSymbol";
import Btn from "../components/Btn";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getEnv } from "../helper/getEnv";
import { useUserStore } from "../store/userStore.js";
import { rootRoute } from "../helper/routeName";
import { showToast } from "../helper/getTostify.js";
function Send() {
  const [flag, setFlag] = useState(0);
  const [loading , setLoading] = useState(false)
  const [amount, setAmount] = useState("");
  const [transAmount, setTransAmount] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [refId, setRefId] = useState("");

  const id = searchParams.get("id");
  const name = searchParams.get("name");

  const fullname = useUserStore((state) => state.fullname);
  const token = localStorage.getItem("token");

  const handleTransaction = async () => {
    setLoading(true)

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 1) {
      setFlag(-1);
      return;
    }

    try {
      const response = await axios.post(
        `${getEnv("VITE_BACKEND_URI")}/account/transfer`,
        {
          to: id,
          amount: parsedAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRefId(response?.data?.commitedTransaction?._id || "");
      setTransAmount(parsedAmount);
      showToast("success" , "transaction Successful")
      setAmount("");
      setFlag(1);
    } catch (error) {
      console.log("Error in transfer:", error);
      setAmount("");
      setFlag(2);
    }
  };

  useEffect(() => {
    if (token) {
      axios
        .get(`${getEnv("VITE_BACKEND_URI")}/account/balance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setBalance(response.data.balance || 0);
        })
        .catch((error) => {
          console.log("Error in fetching balance", error);
        });
    }
  }, [token, transAmount]);

  return (
    <>
      <h1 className="text-white text-2xl m-auto ml-7 mt-4">
        Your Balance : ₹{parseFloat(balance).toFixed(2)}
      </h1>
      <Card>
        <h1 className="text-4xl my-4">Send Money</h1>
        <div className="flex items-center justify-center gap-2">
          <UserSymbol label={name?.[0]?.toUpperCase() || "U"} />
          <span className="text-2xl">
            {name?.[0]?.toUpperCase() + name?.slice(1)}
          </span>
        </div>
        <p>Amount (in ₹)</p>
        <input
          onChange={(e) => {
            setAmount(e.target.value);
            setFlag(0);
          }}
          value={amount}
          type="number"
          placeholder="Amount"
          className="text-white p-1 px-2 rounded-lg outline-none border border-amber-50"
        />
        <Btn onPress={handleTransaction} label={loading?"sending...":"Initiate Transfer"} />
      </Card>

      {/* Status */}
      <div>
        {flag === 1 && (
          <div className="text-white text-2xl my-7 border-2 p-7 rounded-2xl mx-auto shadow-2xl max-w-xl">
            <h1 className="text-center text-3xl mb-5">Transfer Successful 🥳</h1>
            <div className="flex gap-3 items-center justify-center">
              <Btn onPress={() => navigate("/dashboard")} label={"Go To Dashboard"} />
              <Btn onPress={() => setFlag(0)} label={"Send Again"} />
            </div>
            <div className="flex flex-col gap-3 items-center justify-center my-2">
              <h2>Amount: ₹{transAmount}</h2>
              <h2>From: {fullname}</h2>
              <h2>To: {name?.[0]?.toUpperCase() + name?.slice(1)}</h2>
              <h3>Ref No: {refId || "N/A"}</h3>
            </div>
          </div>
        )}

        {flag === 2 && (
          <div className="text-white text-center text-2xl my-10">
            Insufficient Balance: ₹{parseFloat(balance).toFixed(2)} 😔
            <div className="flex gap-3 items-center justify-center mt-4">
              <Btn onPress={() => navigate("/dashboard")} label={"Go To Dashboard"} />
              <Btn onPress={() => setFlag(0)} label={"Try Again"} />
            </div>
          </div>
        )}

        {flag === -1 && (
          <div className="text-white text-center text-2xl my-10">
            Invalid Transaction 😔
            <div className="flex gap-3 items-center justify-center mt-4">
              <Btn onPress={() => navigate(rootRoute)} label={"Go To Dashboard"} />
              <Btn onPress={() => setFlag(0)} label={"Try Again"} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Send;
