import React from "react";
import UserSymbol from "../components/UserSymbol";
import Btn from "../components/Btn";
import NavBar from "../components/NavBar";
const Dashboard = () => {
  return (
    <>
      <NavBar />
      <div className="text-white m-auto p-7 mt-1 rounded-md bg-slate-950 border-slate-800 border-2 h-[90%] shadow-2xl ">
        <h2 className="font-medium text-2xl my-1">Your Balance $2000</h2>
        <h3 className="font-medium text-xl my-6">Users</h3>
        <div>
          <input
            type="text"
            placeholder="search user..."
            className="w-full mb-3 p-1.5 rounded-md px-3 outline-none text-black text-xl font-"
          />
          <div className=" flex justify-between items-center my-2 border-slate-800 border-2 p-4 rounded-md">
            <div className="flex justify-between items-center gap-5">
              <UserSymbol label={"U1"} />
              <span className="text-2xl">user 1</span>
            </div>
            <Btn label={"Send Money"} />
          </div>
          <div className=" flex justify-between items-center my-2 border-slate-800 border-2 p-4 rounded-md">
            <div className="flex justify-between items-center gap-5">
              <UserSymbol label={"U2"} />
              <span className="text-2xl">user 2</span>
            </div>
            <Btn label={"Send Money"} />
          </div>
          <div className=" flex justify-between items-center my-2 border-slate-800 border-2 p-4 rounded-md">
            <div className="flex justify-between items-center gap-5">
              <UserSymbol label={"U3"} />
              <span className="text-2xl">user 3</span>
            </div>
            <Btn label={"Send Money"} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
