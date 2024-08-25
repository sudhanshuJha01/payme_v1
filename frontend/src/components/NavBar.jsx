import React, { useState } from "react";
import UserSymbol from "../components/UserSymbol";
import Btn from "../components/Btn";
import { Link, useNavigate } from "react-router-dom";
const NavBar = ({hostName}) => {
  const [flag , setFlag]=useState(0)
  const navigate = useNavigate()
  const handleClick = ()=>{
    setFlag(flag=>!flag)
  }
  
  const handleLogOut = ()=>{
    localStorage.removeItem('token')
    navigate('/signin')
  }
  
  return (
    <>
      <div className=" bg-slate-950 rounded-md shadow-2xl text-white flex  justify-between items-center border-slate-800 border-2 p-4">
      <Link to={'/'}> <h1 className="text-3xl ml-3">Payment App</h1></Link> 
        <div className="flex items-center gap-3 mr-5">
          <span className="font-medium text-lg">Hello , {hostName && hostName[0].toUpperCase()+hostName.slice(1)}</span>
          <UserSymbol onClick={handleClick} label={hostName ? hostName[0].toUpperCase() : "U" } />
        </div>
      </div>
      <div >{flag?<div>
        <ul className="text-white absolute z-10 bg-slate-900 right-0 mr-20 w-1/6 min-h-1/6 p-1 border-2 border-slate-500 shadow-slate-500 shadow-2xl rounded-xl">
          <li className="cursor-pointer m-3 text-xl" onClick={()=>{
            navigate('/profile')
          }}>Profile</li>
          <li className="cursor-pointer m-3 text-xl" onClick={()=>{
            navigate('/dashboard')
          }}>Dashboard</li>
          <li className="cursor-pointer m-3 text-xl" onClick={handleLogOut}>LogOut</li>
        </ul>
      </div>  :null}</div>
    </>
  );
};

export default NavBar;
