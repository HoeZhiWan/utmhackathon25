import React from 'react'
import DropdownComponent from '../components/DropdownComponent'

// Define consumption level type
type ConsumptionLevel = 'high' | 'medium' | 'low';

// Define device position interface
interface DevicePosition {
  x: number;
  y: number;
  room: string;
  device: string;
  consumption: ConsumptionLevel;
}

function page() {
  // Sample device positions with energy consumption levels
  const devicePositions: DevicePosition[] = [
    { x: 50, y: 90, room: "Kitchen", device: "Refrigerator", consumption: "high" },
    { x: 45, y: 20, room: "Living Room", device: "TV", consumption: "medium" },
    { x: 50, y: 55, room: "Bedroom", device: "Light", consumption: "low" },
    { x: 60, y: 60, room: "Bathroom", device: "Heater", consumption: "high" },
    { x: 60, y: 40, room: "Office", device: "Computer", consumption: "medium" },
  ];

  // Function to determine dot color based on consumption level
  const getDotColor = (consumption: ConsumptionLevel): string => {
    switch(consumption) {
      case 'high': return 'bg-[#a855f7]'; // Purple for high consumption (Grid color)
      case 'medium': return 'bg-[#f97316]'; // Orange for medium consumption (Home color)
      case 'low': return 'bg-[#facc15]'; // Yellow for low consumption (Solar color)
      default: return 'bg-[#facc15]';
    }
  };

  // Function to determine dot shadow color based on consumption
  const getDotShadow = (consumption: ConsumptionLevel): string => {
    switch(consumption) {
      case 'high': return 'shadow-[#a855f7]/50';
      case 'medium': return 'shadow-[#f97316]/50';
      case 'low': return 'shadow-[#facc15]/50';
      default: return 'shadow-[#facc15]/50';
    }
  };

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
      room: "Bathroom",
      devices: [
        {
          name: "Hair Dryer",
          watt: 300,
        }
      ]
    },
    {
      room: "Living Room",
      devices: [
        {
          name: "Ceiling Fan",
          watt: 300,
        }
      ]
    },
  ]
  return (
    <div className="flex flex-col gap-8">
      {/* Floor Plan Section */}
      <div className="w-full bg-[#1e1e1e] rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-white">Home Floor Plan</h2>
        <div className="relative w-full" style={{ height: "400px" }}>
          {/* Floor plan image placeholder - replace src with your actual image */}
          <div className="w-full h-full bg-gray-900 flex items-center justify-center border border-dashed border-gray-600">
            {/* <p className="text-gray-400">Your floor plan image will go here</p> */}
            {/* Uncomment and update the following line when you have the image */}
            {/* <img src="/path/to/your/floorplan.jpg" alt="Floor Plan" className="w-full h-full object-contain" /> */}
            <img src="/floor-plan.png" alt='Floor Plan' className='w-full h-full object-contain' />
          </div>
          
          {/* Interactive device dots with energy consumption animation */}
          {devicePositions.map((pos, index) => (
            <div 
              key={index}
              className={`absolute w-4 h-4 ${getDotColor(pos.consumption)} ${getDotShadow(pos.consumption)} shadow-lg rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:w-5 hover:h-5 transition-all animate-pulse`}
              style={{ 
                left: `${pos.x}%`, 
                top: `${pos.y}%`,
                animationDuration: pos.consumption === 'high' ? '0.7s' : pos.consumption === 'medium' ? '1.5s' : '2.5s'
              }}
              title={`${pos.room} - ${pos.device} (${pos.consumption} consumption)`}
            />
          ))}
        </div>
        <div className="mt-2 text-sm text-white flex flex-wrap gap-4 items-center">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-[#a855f7] rounded-full mr-2"></span> 
            <span>High consumption</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-[#f97316] rounded-full mr-2"></span> 
            <span>Medium consumption</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-[#facc15] rounded-full mr-2"></span> 
            <span>Low consumption</span>
          </div>
        </div>
      </div>

      {/* Device List Grid */}
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
    </div>
  )
}

export default page
