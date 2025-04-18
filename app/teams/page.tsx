import React from 'react'
import ReturnOfSolar from './components/ReturnOfSolar'

function page() {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
      <div className="bg-shade-500 rounded-xl p-4 flex flex-col min-w-[362px]">
        <ReturnOfSolar />
      </div>
      <div className="bg-shade-500 rounded-xl min-w-[362px]">
        
      </div>
      <div className="bg-shade-500">
        <div>03</div>
      </div>
      <div className="col-span-2 row-span-2 row-start-2 bg-shade-500">
        
      </div>
      <div className="row-span-2 row-start-2 bg-shade-500 p-4 rounded-xl">
        
      </div>
    </div>
  )
}

export default page
