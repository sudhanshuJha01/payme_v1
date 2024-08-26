import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import UserSymbol from "../components/UserSymbol";
import Btn from "../components/Btn";
import NavBar from "../components/NavBar";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Send() {
  const [flag, setFlag] = useState(0);
  const [amount, setAmount] = useState(0);
  const [transAmount, setTransAmount] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [host, setHost] = useState({});

  const token = localStorage.getItem("token");

  const handleTransaction = async () => {
    try {
      const response = await axios.post(
        "https://basiconlinetransactionwebapplicationproj.onrender.com/api/v1/accounts/transfer",
        {
          to: id,
          amount: parseInt(amount),
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(response);
      setTransAmount(amount);
      setAmount(0);
      setFlag(1);
    } catch (error) {
      if(amount<1){
        setFlag(-1)
      }else{
        setFlag(2);
      }
      setAmount(0);
      console.log("error in transfer", error);
    }
  };

  useEffect(() => {
    if (token) {
      axios
        .get("https://basiconlinetransactionwebapplicationproj.onrender.com/api/v1/accounts/balance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setBalance(response.data.balance);
        })
        .catch((error) => {
          console.log("Error in fetching balance", error);
        });
    }
  }, [token, amount, transAmount]);

  useEffect(() => {
    if (token) {
      axios
        .post("https://basiconlinetransactionwebapplicationproj.onrender.com/api/v1/me", { token })
        .then((response) => {
          if (response.data.success) {
            setHost({
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              userName: response.data.userName,
            });
          } else {
            navigate("/signin");
          }
        })
        .catch((error) => {
          console.log("Error in the signup navigator", error);
        });
    } else {
      navigate("/signin");
    }
  }, [token, navigate]);

  return (
    <>
      <NavBar hostName={host.firstName} />
      <h1 className="text-white text-2xl m-auto ml-7 mt-4">
        Your Balance : {parseInt(balance)}
      </h1>
      <Card>
        <h1 className="text-4xl my-4">Send Money</h1>
        <div className="flex items-center justify-center gap-2">
          <UserSymbol label={name[0].toUpperCase()} />
          <span className="text-2xl">
            {name[0].toUpperCase() + name.slice(1)}{" "}
          </span>
        </div>
        <p>Amount (in rs)</p>
        <input
          onChange={(e) => {
            setAmount(e.target.value);
            setFlag(0);
          }}
          value={amount}
          type="number"
          placeholder="Amount"
          className="text-stone-950 p-1 px-2 rounded-lg outline-none"
        />
        <Btn onPress={handleTransaction} label={"Initiate Transfer"} />
      </Card>
      <div>
        {flag == 1 ? (
          <div className="text-white text-2xl my-7 border-2 p-7 rounded-2xl min-w-1/2 mx-auto shadow-2xl">
              <h1 className="text-center text-3xl mb-5 " >Transfer Successful 🥳</h1>
            <div className="flex gap-3 items-center justify-center">
              <Btn
                onPress={() => {
                  navigate("/dashboard");
                }}
                label={"Go To Dashboard"}
              />
              <Btn onPress={() => setFlag(0)} label={"send Again"} />
            </div>
            <div className="flex flex-col gap-3 items-center justify-center my-2">
              <h2>
                Amount : ₹
                {transAmount[0] == 0 ? transAmount.slice(1) : transAmount}
              </h2>
              <h2>
                from :{" "}
                {host.firstName[0].toUpperCase() + host.firstName.slice(1)}
              </h2>
              <h2>to : {name[0].toUpperCase() + name.slice(1)}</h2>
              <h3>
                Ref No: {Math.floor(Math.random() * 1000000000000000 + 1)}
              </h3>
            </div>
          </div>
        ) : flag == 2 ? (<div>
          <h1 className="text-white text-center text-2xl my-10">Insufficient Balance :{parseInt(balance)} 😔</h1>
          <div className="flex gap-3 items-center justify-center">
              <Btn
                onPress={() => {
                  navigate("/dashboard");
                }}
                label={"Go To Dashboard"}
              />
              <Btn onPress={() => setFlag(0)} label={"Try Again"} />
            </div>
          </div>
        ) : flag==-1? <div> <h1 className="text-white text-center text-2xl my-10">Invalid Transaction 😔</h1>
                    <div className="flex gap-3 items-center justify-center">
              <Btn
                onPress={() => {
                  navigate("/dashboard");
                }}
                label={"Go To Dashboard"}
              />
              <Btn onPress={() => setFlag(0)} label={"Try Again"} />
            </div>
        </div>:null}
      </div>
    </>
  );
}

export default Send;
