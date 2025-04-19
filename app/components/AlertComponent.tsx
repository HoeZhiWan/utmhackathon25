import React from 'react'

function AlertComponent({time, message, severity} : {time: string, message: string, severity: 'high' | 'medium' | 'low'}) {
  const getSeverityColor = () => {
    switch(severity) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  }

  return (
    <div className='w-full bg-primary-neon-tint-500 rounded-xl overflow-hidden'>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <div className={`size-3 rounded-full ${getSeverityColor()}`}></div>
          <div className="font-bold text-xl">{message}</div>
        </div>
        <div className="text-sm opacity-70">{time}</div>
      </div>
      <div className="bg-secondary-dark p-4 flex justify-between items-center">
        <div>Severity: <span className="font-semibold">{severity.toUpperCase()}</span></div>
        <button className="px-4 py-1 bg-primary-tint-500 rounded-xl text-sm">Dismiss</button>
      </div>
    </div>
  )
}

export default AlertComponent