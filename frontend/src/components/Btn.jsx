import React from 'react'
import { Link } from 'react-router-dom';

const Btn = ({label , onPress , className}) => {
    let success = true;
  return (
    <button  onClick={onPress} className={`text-xl bg-black p-2 rounded-lg border-slate-300 border-2 text-slate-300 $`}>{label}</button>
  )
}

export default Btn