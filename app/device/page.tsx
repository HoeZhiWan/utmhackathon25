import React from 'react'
import DropdownComponent from '../components/DropdownComponent'

function page() {
  const roomList = [
    {
      room: "Kitchen",
      devices: [
        {
          name: "Refrigerator",
          watt: 300,
        }
      ]
    },
    {
      room: "Kitchen",
      devices: [
        {
          name: "Refrigerator",
          watt: 300,
        }
      ]
    },
    {
      room: "Kitchen",
      devices: [
        {
          name: "Refrigerator",
          watt: 300,
        }
      ]
    },
  ]
  return (
    <div className="grid grid-cols-3 gap-4 gap-y-8 items-start">
      {roomList.map((rooms, index) => {
        return (
          <DropdownComponent key={index} room={rooms.room} devices={rooms.devices} />
        )
      })}
      <div className="w-full bg-primary-neon-tint-500 rounded-xl flex justify-between items-center cursor-pointer p-4 font-bold text-xl">
        Add more...
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
    </div>
  )
}

export default page
