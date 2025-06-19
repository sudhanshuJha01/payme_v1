import { useState } from "react";
import UserSymbol from "../components/UserSymbol.jsx";
import { Link, useNavigate } from "react-router-dom";
import {
  profileRoute,
  rootRoute,
  transactionRoute,
} from "../helper/routeName.js";
import { showToast } from "../helper/getTostify.js";

const NavBar = ({ fullname = "" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    showToast("info", "Logged out successfully");
    navigate("/signin");
  };
  
  const displayName = fullname
    ? fullname.charAt(0).toUpperCase() + fullname.slice(1)
    : "User";

  return (
    <>
      <div className="bg-slate-950 rounded-md shadow-2xl text-white flex justify-between items-center border-slate-800 border-2 p-4 w-full z-40">
        <Link to={rootRoute}>
          <h1 className="text-3xl font-bold ml-3">PayMe</h1>
        </Link>

        <div
          className="flex items-center gap-3 mr-5 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="font-medium text-lg hidden sm:inline">
            Hi, {displayName}
          </span>
          <UserSymbol label={fullname ? fullname[0].toUpperCase() : "U"} />
        </div>
      </div>

      {isMenuOpen && (
        <ul className="absolute z-50 bg-slate-900 right-4 mt-2 w-48 p-2 text-white border border-slate-600 shadow-xl rounded-xl">
          <li
            className="cursor-pointer hover:bg-slate-800 p-2 rounded"
            onClick={() => {
              navigate(profileRoute);
              setIsMenuOpen(false);
            }}
          >
            Profile
          </li>
          <li
            className="cursor-pointer hover:bg-slate-800 p-2 rounded"
            onClick={() => {
              navigate(rootRoute);
              setIsMenuOpen(false);
            }}
          >
            Dashboard
          </li>
          <li
            className="cursor-pointer hover:bg-slate-800 p-2 rounded"
            onClick={() => {
              navigate(transactionRoute);
              setIsMenuOpen(false);
            }}
          >
            Transactions
          </li>
          <li
            className="cursor-pointer hover:bg-slate-800 p-2 rounded"
            onClick={() => {
              handleLogOut();
              setIsMenuOpen(false);
            }}
          >
            Log Out
          </li>
        </ul>
      )}
    </>
  );
};

export default NavBar;
