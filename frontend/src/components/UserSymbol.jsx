import React from 'react'

const UserSymbol = ({label}) => {
  return (
    <div className='bg-white w-10 h-10 rounded-full  text-black p-1'>
        <span className='mx-1 text-black font-semibold text-xl'>{label}</span>
    </div>
  )
}

export default UserSymbol