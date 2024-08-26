import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";



function Signup() {
  const [firstName , setFirstName] = useState("")
  const [lastName , setLastName] = useState("")
  const [userName , setUserName] = useState("")
  const [password, setPassword] = useState("")
  const[loading , setLoading] = useState(0);
 const navigate = useNavigate()
 const token = localStorage.getItem("token");
 useEffect(()=>{
  axios.post("https://basiconlinetransactionwebapplicationproj.onrender.com/api/v1/me",{token})
  .then((response)=>{
    if(response.data.success){
      navigate('/dashboard')
    }else{
      navigate('/signup')
    }
  }).catch((error)=>{
    console.log('Error in the signup navigator' , error);
    
  })
 },[token])
  const handleSignUp = async () => {
    try {
      const response = await axios.post("https://basiconlinetransactionwebapplicationproj.onrender.com/api/v1/user/signup", {
        userName,
        firstName,
        lastName,
        password
      });
      console.log('Response:', response.data.token);
      setLoading(1);
      localStorage.setItem("token" , response.data.token)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error:', error);
      setLoading(-1);
    }
  };
  
  
  return (
    <>
        <Card>
        <h1 className="text-4xl">Registration</h1>
        <p className="text-lg text-center">Enter your Information to create your account</p>
        <div>
          <h2>First Name</h2>
          <input onChange={e=>{setFirstName(e.target.value.toLowerCase())
            setLoding(0);
          }} className="px-2 rounded-md py-0.5 w-64 text-black font-normal outline-none" type="text" placeholder="firstname" />
        </div>
        <div>
          <h2>Last Name</h2>
          <input onChange={e=>setLastName(e.target.value.toLowerCase())} className="px-2 rounded-md py-0.5 w-64 text-black font-normal outline-none" type="text" placeholder="lastname" />
        </div>
        <div>
          <h2>Email</h2>
          <input onChange={e=>{setUserName(e.target.value)
            setLoding(0);
          }} className="px-2 rounded-md py-0.5 w-64 text-black font-normal outline-none" type="text" placeholder="demo@gmail.com" />
          </div>
        <div>
          <h2>Password</h2>
          <input  onChange={e=>{setPassword(e.target.value)
            setLoading(0);
          }} className="px-2 rounded-md py-0.5 w-64 text-black font-normal outline-none" type="text" placeholder="Password" />
        </div>
        <button onClick={handleSignUp} className="text-xl bg-black p-2 rounded-lg border-slate-300 border-2 text-slate-300">Sign Up</button>
        <p className="text-sm">Already have and account ?<Link to={'/signin'}> <span className="underline">login</span> </Link> </p>
    </Card>
    <div className="text-white text-2xl text-center">{loading==1?<span>Loading......</span>:loading==-1?<span>Enter valid Email and password (min length 6)  </span>:null}</div>
    </>
  );
}

export default Signup;


