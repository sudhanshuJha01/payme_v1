import React from 'react'
import Card from '../components/Card'
import UserSymbol from '../components/UserSymbol'
import Btn from '../components/Btn'
import NavBar from '../components/NavBar'
function Send() {
  return (
    <>
    <NavBar/>
    <Card>
       <h1 className='text-4xl my-4'>Send Money</h1>
       <div className='flex items-center justify-center gap-2'>
       <UserSymbol label={"A"} />
       <span className='text-2xl'>Friend`S name </span>
       </div>
       <p>Amount (in rs)</p>
       <input type="number"  placeholder='Amount' className='p-1 px-2 rounded-lg outline-none'/>
       <Btn label={"Initiate Transfer"} />
    </Card>
    </>
  )
}

export default Send