import React from 'react'
import ReturnOfSolar from '../components/solar/ReturnOfSolar'
import SolarPanelBattery from '../components/solar/SolarPanelBattery'
import AlertAndPerformance from '../components/solar/AlertAndPerformance'
import SolarSavings from '../components/solar/SolarSavings'

function page() {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
      <div className="bg-shade-500 rounded-xl p-4 flex flex-col min-w-[362px]">
        <SolarSavings />
      </div>
      <div className="bg-shade-500 rounded-xl p-4 flex flex-col min-w-[362px]">
        <ReturnOfSolar />
      </div>
      <div className="bg-shade-500 rounded-xl p-4 flex flex-col gap-3 min-w-[362px]">
        <SolarPanelBattery />
      </div>
      <div className="col-span-2 row-span-2 row-start-2 bg-shade-500">
        
      </div>
      <div className="row-span-2 row-start-2 bg-shade-500 p-4 rounded-xl">
        <AlertAndPerformance />
      </div>
    </div>
  )
}

export default page
