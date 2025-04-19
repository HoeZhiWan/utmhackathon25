'use client';

import React, { useEffect, useState } from 'react';
import { getEnergyBalance } from '@/app/lib/data';

function TotalCost() {
  const [totalCost, setTotalCost] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchEnergyData() {
      try {
        // Get the current date and date 30 days ago
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        // Format dates for the API
        const endDate = today.toISOString().split('T')[0];
        const startDate = thirtyDaysAgo.toISOString().split('T')[0];

        // Fetch energy balance data for the last 30 days
        const energyData = await getEnergyBalance(startDate, endDate);
        
        if (energyData && energyData.length > 0) {
          // Calculate total cost based on consumption data
          // Assuming a rate of RM 0.571 per kWh (adjust as needed)
          const rate = 0.571;
          
          // Total consumption is grid usage minus what was sent back to grid
          const totalConsumption = energyData.reduce((sum, day) => {
            return sum + (day.total_from_grid - day.total_to_grid);
          }, 0);
          
          const calculatedCost = parseFloat((totalConsumption * rate).toFixed(2));
          setTotalCost(calculatedCost);
          
          // Calculate percentage change (compare first 15 days vs last 15 days)
          const halfwayPoint = Math.floor(energyData.length / 2);
          const firstHalf = energyData.slice(0, halfwayPoint);
          const secondHalf = energyData.slice(halfwayPoint);
          
          const firstHalfConsumption = firstHalf.reduce((sum, day) => 
            sum + (day.total_from_grid - day.total_to_grid), 0);
          const secondHalfConsumption = secondHalf.reduce((sum, day) => 
            sum + (day.total_from_grid - day.total_to_grid), 0);
            
          if (firstHalfConsumption > 0) {
            const change = ((secondHalfConsumption - firstHalfConsumption) / firstHalfConsumption) * 100;
            setPercentageChange(parseFloat(change.toFixed(1)));
          }
        } else {
          // Fallback to sample data if no database data available
          setTotalCost(15000);
          setPercentageChange(19.6);
        }
      } catch (error) {
        console.error('Error fetching energy data:', error);
        // Fallback to sample data
        setTotalCost(15000);
        setPercentageChange(19.6);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEnergyData();
  }, []);

  // Format the total cost with commas for thousands
  const formattedCost = new Intl.NumberFormat('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(totalCost);

  return (
    <>
      <div className="flex justify-between items-center text-[20px] font-semibold">
        Total Cost
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      </div>
      <div className="flex justify-between text-[34px] font-bold items-end flex-1 mb-4">
        {isLoading ? (
          <div className="animate-pulse">Loading...</div>
        ) : (
          <>
            RM {formattedCost}
            <div className={`flex text-[16px] ${percentageChange > 0 ? 'text-primary-tint-500' : 'text-green-500'} mb-3`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d={percentageChange > 0 
                  ? "M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" 
                  : "M15.75 6.75 12 3m0 0-3.75 3.75M12 3v18"} />
              </svg>
              {Math.abs(percentageChange)}%
            </div>
          </>
        )}
      </div>
      <div className='flex justify-between bg-primary-neon-tint-400 px-4 py-2 rounded-[25px] border-2 border-primary-tint-500'>
        <div className='font-medium'>View Tariff</div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </div>
    </>
  )
}

export default TotalCost
