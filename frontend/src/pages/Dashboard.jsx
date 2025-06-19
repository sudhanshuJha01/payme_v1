import { useEffect, useState } from "react";
import UserSymbol from "../components/UserSymbol";
import Btn from "../components/Btn";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showToast } from "../helper/getTostify.js";
import { useUserStore } from "../store/userStore";
import { getEnv } from "../helper/getEnv";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [filter, setFilter] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fullname = useUserStore((state) => state.fullname);
  const email = useUserStore((state) => state.email);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingUsers(true);
      axios
        .get(`${getEnv("VITE_BACKEND_URI")}/user/bulk/?filter=${filter}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUsers(response.data?.user || []);
        })
        .catch(() => {
          showToast("error", "Error fetching users");
        })
        .finally(() => setLoadingUsers(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [filter]);

  useEffect(() => {
    axios
      .get(`${getEnv("VITE_BACKEND_URI")}/account/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBalance(response.data.balance || 0);
      })
      .catch(() => {
        showToast("error", "Error fetching balance");
      });
  }, []);

  return (
    <div>
      <div className=" text-white m-auto p-7 mt-1 rounded-md bg-slate-950 border-slate-800 border-2 shadow-2xl min-h-screen">

    <div className="sm:flex sm:justify-between sm:items-center sm:m-5 my-3">
            <h2 className="font-medium text-2xl my-1">
             Account Name : {fullname.toUpperCase() || ""}
            </h2>

          <h2 className="font-medium text-2xl my-1">
            Your Balance :  ₹{parseInt(balance)}
          </h2>
    </div>


        <div>
          <input
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            type="text"
            placeholder="search user..."
            className="w-full mb-3 p-1.5 rounded-md px-3 outline-hidden text-xl border-2 border-amber-50 text-white"
          />

          {loadingUsers ? (
            <p className="text-center my-4 text-lg text-slate-400">
              Loading users...
            </p>
          ) : (
            <ul>
              {users?.length > 0 ? (
                users.map((user) =>
                  email !== user?.email ? (
                    <li key={user._id}>
                      <div className="flex justify-between items-center my-2 border-slate-800 border-2 p-4 rounded-md">
                        <div className="flex items-center gap-5">
                          <UserSymbol label={user?.fullname[0].toUpperCase()} />
                          <span className="text-2xl">
                            {user?.fullname[0].toUpperCase() +
                              user?.fullname.slice(1)}
                          </span>
                        </div>
                        <Btn
                          className="max-sm:max-w-20 max-sm:text-base max-sm:p-1"
                          onPress={() =>
                            navigate(
                              `/send/?id=${user.accountNumber}&name=${user.fullname}`
                            )
                          }
                          label={"Send Money"}
                        />
                      </div>
                    </li>
                  ) : null
                )
              ) : (
                <p className="text-center text-slate-400">No users found</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
