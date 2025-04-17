import React from 'react'

function TotalCost() {
  return (
    <>
      <div className="flex justify-between items-center text-[20px] font-semibold">
          Total Cost
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
        </div>
        <div className="flex justify-between text-[38px] font-bold items-end flex-1">
          RM 15,000.00
          <div className="flex text-[16px] text-primary-tint-500 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
            </svg>
            19.6%
          </div>
        </div>
        <div className='flex justify-between bg-primary-neon-tint-400 px-4 py-2 rounded-[25px] border-2 border-primary-tint-500'>
          <div className='font-medium'>View Tariff</div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>

        </div>
    </>
  )
}

export default TotalCost
