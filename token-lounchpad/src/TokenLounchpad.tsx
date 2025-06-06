import React from 'react'

function TokenLounchpad() {
    const createToken = () => {
        console.log('createToken');
    }

  return (
    <div className='flex flex-col items-center justify-center'>
        <input type="text" placeholder='Token Name' />
        <input type="text" placeholder='Token Symbol' />
        <input type="text" placeholder='Token url' />
        <input type="text" placeholder='Initial Supply' />
        <button onClick={createToken} className='bg-blue-500 text-white p-2 rounded-md w-1/3 cursor-pointer'>Create Token</button>
        
    </div>
  )
}

export default TokenLounchpad