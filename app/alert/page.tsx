"use client";
import React, { useState, useEffect } from 'react'
import AlertComponent from '../components/AlertComponent'

function AlertPage() {
  const [alerts, setAlerts] = useState<Array<{
    id: number,
    time: string,
    message: string,
    severity: 'high' | 'medium' | 'low'
  }>>([
    {
      id: 1,
      time: new Date().toLocaleTimeString(),
      message: "High energy consumption detected",
      severity: "high"
    }
  ]);

  useEffect(() => {
    // Function to generate a random alert
    const generateRandomAlert = () => {
      const alertMessages = [
        { message: "Unusual power spike detected", severity: "high" },
        { message: "Battery level below 20%", severity: "medium" },
        { message: "Solar panel efficiency decreased", severity: "medium" },
        { message: "Device left on while away", severity: "low" },
        { message: "Energy usage above monthly average", severity: "low" },
        { message: "Grid power outage detected", severity: "high" },
        { message: "Water heater consuming excess power", severity: "medium" },
        { message: "HVAC system needs maintenance", severity: "low" }
      ];
      
      const randomAlert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
      
      return {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        message: randomAlert.message,
        severity: randomAlert.severity as 'high' | 'medium' | 'low'
      };
    };
    
    // Set interval to generate a new alert every 2-5 minutes
    const intervalTime = (Math.floor(Math.random() * 3) + 2) * 60 * 1000;
    const interval = setInterval(() => {
      setAlerts(prevAlerts => [...prevAlerts, generateRandomAlert()]);
    }, intervalTime);
    
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Function to handle alert dismissal
  const dismissAlert = (id: number) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">System Alerts</h1>
      
      <div className="grid grid-cols-1 gap-4 items-start">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <AlertComponent 
              key={alert.id} 
              time={alert.time} 
              message={alert.message} 
              severity={alert.severity} 
            />
          ))
        ) : (
          <div className="text-center p-8 bg-primary-neon-tint-500 rounded-xl">
            <p className="text-xl">No active alerts at this time.</p>
          </div>
        )}
      </div>
      
      <div className="w-full bg-primary-neon-tint-500 rounded-xl flex justify-between items-center cursor-pointer p-4 font-bold text-xl mt-4">
        Clear all alerts
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </div>
    </div>
  )
}

export default AlertPage