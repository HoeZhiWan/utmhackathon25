import { Grid, HousePlug, Sun, UtilityPole } from 'lucide-react'
import React from 'react'

function TestEnergyFlow() {
  return (
    <>
      <div className="text-[20px] font-semibold">Energy Flow</div>
      <div className="grid grid-cols-3 grid-rows-2 -translate-y-8 h-full">
        <div className="col-start-2 flex justify-center">
            <div className="bg-purple-neon rounded-[100px] w-[90px] h-[90px] p-4 flex flex-col items-center border-2 border-primary-purple">
                <Sun />
                925W
            </div>

        </div>
        <div className="row-start-2 col-start-1">
        <div className="bg-purple-neon rounded-[100px] w-[90px] h-[90px] p-4 flex flex-col items-center border-2 border-primary-purple">
                <UtilityPole />
                <div className="text-[12px]">{"<- 286 W"}</div>
                <div className="text-[12px]">{"0 W ->"}</div>
            </div>
        </div>
        <div className="row-start-2 col-start-3 flex justify-end">
        <div className="bg-orange-neon rounded-[100px] w-[90px] h-[90px] p-4 flex flex-col items-center border-2 border-primary-orange">
                <HousePlug />
                639 W
            </div>
        </div>
      </div>
    </>
  )
}

export default TestEnergyFlow
