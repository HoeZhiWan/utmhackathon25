import { Brush, CloudRain, Sun, ThermometerSun, X } from 'lucide-react';
import React from 'react'

const solarIssues = [
  {
    icon: <Sun />,
    title: "Solar panel malfunctioning",
    description: "Error message on the inverter",
  },
  {
    icon: <CloudRain />,
    title: "Cloudy weather on coming",
    description: "Low sunlight intensity reduce solar energy production",
  },
  {
    icon: <Brush />,
    title: "Dirt & Dust",
    description: "Dirt & dust blocks the sunlight to reach on solar cells",
  },
  {
    icon: <ThermometerSun />,
    title: "Extremely high temperature",
    description:
      "Solar panels are less efficient in extreme heat, work best around 25°C",
  },
];
function AlertAndPerformance() {
  return (
    <div className="bg-[#1E1E1E] rounded-2xl shadow-xl p-4 w-full max-w-sm h-full overflow-hidden flex flex-col">
      <h2 className="text-white text-xl font-semibold mb-4">Alert & Performance Tips</h2>
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 scroll-custom">
        {solarIssues.map((s, idx) => (
          <div
            key={idx}
            className="border border-primary-tint-500 bg-primary-neon-tint-400 rounded-xl p-3 flex items-start justify-between text-white gap-3"
          >
            <div className="flex-shrink-0 mt-1">{s.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-[15px]">{s.title}</h3>
              <p className="text-[12px] font-light text-gray-300">{s.description}</p>
            </div>
            <button className="flex-shrink-0 text-white hover:text-red-400 transition">
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertAndPerformance
