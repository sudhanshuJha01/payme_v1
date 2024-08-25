import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const Home = () => {
  const token = localStorage.getItem("token")
  const navigator = useNavigate()
  useEffect(()=>{
    axios.post("http://localhost:3000/api/v1/me",{
      token
    })
    .then(response=>{
      console.log(response.data.success);
      if(response.data.success){
        navigator('/dashboard')
      }else{
        navigator('/signin')
      }
    }).catch(error=>{
      console.log('error in Home',error);
    })
  },[token])
  return (
  <div></div>
  )
}

export default Home