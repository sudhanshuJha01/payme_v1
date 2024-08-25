import React, { useEffect, useState } from "react";
import UserSymbol from "../components/UserSymbol";
import Btn from "../components/Btn";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [host, setHost] = useState({});
  const [balance, setBalance] = useState(0);
  const [filter, setFilter] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios
        .post("http://localhost:3000/api/v1/me", { token })
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

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:3000/api/v1/user/bulk/?filter=" + filter, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          setUsers(response.data.user.filter(items=>items.firstName!=host.firstName));
        })
        .catch((error) => {
          console.error("There was an error fetching the users!", error);
        });
    }
  }, [token, filter]);  

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:3000/api/v1/accounts/balance", {
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
  }, [token]);  // Removed 'balance' from dependencies

  return (
    <>
      <NavBar hostName={host?.firstName} />
      <div className="text-white m-auto p-7 mt-1 rounded-md bg-slate-950 border-slate-800 border-2 min-h-[90%] shadow-2xl">
        <h2 className="font-medium text-2xl my-1">Your Balance ₹{parseInt(balance)}</h2>
        <h3 className="font-medium text-xl my-6">{host?.firstName?.toUpperCase()||""}</h3>
        <div>
          <input
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            type="text"
            placeholder="search user..."
            className="w-full mb-3 p-1.5 rounded-md px-3 outline-none text-black text-xl"
          />
          <ul>
            {users && 
              users.map((user) => (
                <li
                  key={user._id}
                  className="flex justify-between items-center my-2 border-slate-800 border-2 p-4 rounded-md"
                >
                  <div className="flex justify-between items-center gap-5">
                    <UserSymbol label={user.firstName[0].toUpperCase()} />
                    <span className="text-2xl">
                      {user.firstName[0].toUpperCase() +
                        user.firstName.slice(1) +
                        " " +
                        user.lastName}
                    </span>
                  </div>
                  <Btn onPress={()=>{
                    navigate('/send/?id='+user._id+"&name="+user.firstName)
                  }} label={"Send Money"} />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
