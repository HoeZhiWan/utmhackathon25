"use client"

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label, Sector } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/app/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { getRoomEnergyConsumption } from '../lib/data';

// Fallback data for the pie chart
const fallbackData = [
  { name: 'Living Room', value: 400 },
  { name: 'Kitchen', value: 300 },
  { name: 'Bedroom', value: 300 },
  { name: 'Office', value: 200 },
];

// Define colors for light and dark modes
const COLORS_LIGHT = [
  'var(--chart-1)',  
  'var(--chart-2)',  
  'var(--chart-3)',   
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
  'var(--chart-8)'   
];

const COLORS_DARK = COLORS_LIGHT; // Using the same colors for both modes

// This is a proper renderActiveShape function that works with Recharts typing
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 4} // Make it slightly larger when active
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#ffffff"
        strokeWidth={4}
        style={{
          filter: 'drop-shadow(0px 2px 5px rgba(0,0,0,0.2))',
          transition: 'all 0.2s ease-in-out'
        }}
      />
    </g>
  );
};

const PieChartComponent = () => {
  const [data, setData] = useState(fallbackData);
  const [isLoading, setIsLoading] = useState(true);
  const [totalEnergyKWh, setTotalEnergyKWh] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoomEnergyData() {
      try {
        setIsLoading(true);
        setError(null);
        
        const roomEnergyData = await getRoomEnergyConsumption();
        
        if (roomEnergyData && roomEnergyData.length > 0) {
          // Transform the data for the pie chart
          const chartData = roomEnergyData.map(room => ({
            name: room.room_name,
            value: parseFloat(room.total_energy_consumed) || 0
          }));
          
          // Sort by energy consumption (highest first) and take top 8 rooms
          const sortedData = chartData
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);
          
          setData(sortedData);
          
          // Calculate total energy consumed
          const total = chartData.reduce((sum, room) => sum + room.value, 0);
          setTotalEnergyKWh(Math.round(total));
        } else {
          // If no data but no error, show information message
          setError("No room energy data available");
        }
      } catch (error) {
        console.error('Error fetching room energy data:', error);
        
        // Show user-friendly error message
        if (error instanceof Error && error.message.includes('timed out')) {
          setError("Data request timed out. Showing sample data instead.");
        } else {
          setError("Couldn't load room energy data. Showing sample data instead.");
        }
        // Keep fallback data
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoomEnergyData();
  }, []);
  
  // Create dynamic chart config based on data
  const chartConfig = data.reduce((config, item) => {
    config[item.name] = {
      label: item.name,
      theme: {
        light: '--chart-1',
        dark: '--chart-1'
      }
    };
    return config;
  }, {} as ChartConfig);
  
  const isDarkMode = 
    typeof window !== 'undefined' && 
    window.matchMedia && 
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const COLORS = isDarkMode ? COLORS_DARK : COLORS_LIGHT;
  
  // Track which segment is being hovered
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // Event handlers for mouse interactions
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Room Energy Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[250px] w-full flex items-center justify-center">
            <div className="animate-pulse">Loading energy data...</div>
          </div>
        ) : error ? (
          <div className="h-[250px] w-full flex flex-col items-center justify-center text-muted-foreground">
            <div className="mb-2">{error}</div>
            <div className="text-sm">Using sample data for visualization</div>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                    strokeWidth={0}
                    style={{ transition: 'all 0.2s ease-out' }}
                  />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent />}
                wrapperStyle={{ outline: 'none' }}
              />
              <ChartLegend 
                content={
                  <CustomLegend data={data} colors={COLORS} />
                } 
              />
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalEnergyKWh}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          kWh
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

// Custom Legend component that ensures legends stay within the card
const CustomLegend = ({ data, colors }: { data: any[], colors: string[] }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-2 px-2 max-w-full">
      {data.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center mr-2">
          <div 
            className="w-3 h-3 mr-1" 
            style={{ 
              backgroundColor: colors[index % colors.length],
              borderRadius: '50%'
            }}
          />
          <span className="text-xs truncate max-w-[80px]" title={entry.name}>
            {entry.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PieChartComponent;