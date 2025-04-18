import React from 'react'

function DropdownComponent({room, devices} : {room : string, devices : Array<any>}) {
  return (
    <details className='w-full bg-primary-neon-tint-500 open:rounded-tl-xl open:rounded-tr-xl rounded-xl'>
        <summary className='flex justify-between items-center cursor-pointer p-4'>
            <div className="font-bold text-xl">{room}</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 transition-transform duration-300 group-open:rotate-180">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
        </summary>
      <div className="bg-secondary-dark rounded-bl-xl rounded-br-xl transition-transform duration-300">
        {devices.map((device, index) => {
          let sum = 0;
          sum += device.watt;
          return (
            <div key={index} className="flex flex-col gap-4 p-4 text-xl font-semibold">
              <div className="flex justify-between">
                <div className="">{device.name}: {device.watt} W</div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </div>
              <div className="flex justify-between">
                Appliances/Devices:
                <button className="px-4 bg-primary-tint-500 rounded-xl">Add</button>
              </div>
              <div className="w-full border-1 border-[rgba(255,255,255,0.2)]"></div>
              <div className="">Total Energy: {sum} W</div>
            </div>
        )})}
      </div>
    </details>
  )
}

export default DropdownComponent
