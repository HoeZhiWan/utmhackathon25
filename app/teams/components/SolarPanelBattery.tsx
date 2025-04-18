import React from 'react'

function SolarPanelBattery() {
    const batteryInfo = {
        batteryPercentage: 83,
    }
    return (
        <>
            <div className="text-xl font-semibold">Solar Energy Battery</div>
            <div className="flex items-center gap-4 text-4xl font-bold">
                {batteryInfo.batteryPercentage}%
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-12 ${batteryInfo.batteryPercentage >= 80 ? "text-green-700" : batteryInfo.batteryPercentage >= 30 ? "text-accent" : "text-red-700"}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0 0 21 15.75v-6a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 1.5 9.75v6A2.25 2.25 0 0 0 3.75 18Z" />
                </svg>
            </div>
            <div className="flex justify-between items-center gap-4 text-[15px] font-bold">
                Power Efficieny Mode
                <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-blue-800 peer-focus:outline-none dark:peer-focus:bg-primary-dark rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-dark dark:peer-checked:bg-primary-dark"></div>
                </label>
            </div>
            <div className="w-full border-1 border-[rgba(255,255,255,0.2)]"></div>
            <div className="flex justify-between items-center gap-4 text-[15px] font-bold">
                Battery Health
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </div>
        </>
    )
}

export default SolarPanelBattery
