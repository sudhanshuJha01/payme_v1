import React from "react";
import UserSymbol from "../components/UserSymbol";
import Btn from "../components/Btn";
const NavBar = () => {
  return (
    <>
      <div className=" bg-slate-950 rounded-md shadow-2xl text-white flex  justify-between items-center border-slate-800 border-2 p-4">
        <h1 className="text-3xl ml-3">Payment App</h1>
        <div className="flex items-center gap-3 mr-5">
          <span className="font-medium text-lg">Hello , User</span>
          <UserSymbol label={"U"} />
        </div>
      </div>
    </>
  );
};

export default NavBar;
