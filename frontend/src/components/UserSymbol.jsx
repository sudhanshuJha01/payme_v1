import React from 'react'

const UserSymbol = ({label , onClick}) => {
  return (
    <div className='bg-white w-10 h-10 rounded-full  text-black p-1'>
        <span onClick={onClick} className='mx-1 text-black font-semibold text-xl cursor-pointer'>{label}</span>
    </div>
  )
}

export default UserSymbol