"use client"

import React, { useState } from 'react';
import { PieChart, Pie, Cell, Label, Sector, Legend } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/app/components/ui/chart";

// Static data for the pie chart
const chartData = [
  { name: 'Solar Energy', value: 680, percentage: '65%' },
  { name: 'Grid Energy', value: 370, percentage: '35%' },
];

const totalEnergy = chartData.reduce((sum, item) => sum + item.value, 0);

// Define colors for both light and dark modes
const COLORS = [
  'var(--chart-2)',  // Solar - green
  'var(--chart-4)',  // Grid - purple
];

// This is a proper renderActiveShape function that works with Recharts typing
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 4}
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

// Custom Legend component that shows just labels
const renderLegend = (props: any) => {
  const { payload } = props;
  
  return (
    <div className="flex items-center justify-center gap-4 mt-2">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-item-${index}`} className="flex items-center">
          <div 
            className="w-3 h-3 mr-1" 
            style={{ 
              backgroundColor: entry.color,
              borderRadius: '50%'
            }}
          />
          <span className="text-xs">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const SolarVsGridPieChart = () => {
  // Track which segment is being hovered
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // Event handlers for mouse interactions
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(undefined);
  };
  
  // Create chart config based on data
  const chartConfig = chartData.reduce((config, item) => {
    config[item.name] = {
      label: item.name,
      theme: {
        light: '--chart-1',
        dark: '--chart-1'
      }
    };
    return config;
  }, {} as ChartConfig);

  return (
    <div className="h-full flex flex-col">
      <div className="pb-2">
        <h2 className="text-xl font-semibold">Solar vs Grid Energy</h2>
      </div>
      <div className="flex-1 flex flex-col justify-start pb-0">
        <ChartContainer config={chartConfig} className="h-full w-full pt-0 mt-[-10px]">
          <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              labelLine={false}
              outerRadius={50}
              innerRadius={35}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
            >
              {chartData.map((entry, index) => (
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
                        className="fill-foreground text-2xl font-bold"
                      >
                        {totalEnergy}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 15}
                        className="fill-muted-foreground text-xs"
                      >
                        kWh
                      </tspan>
                    </text>
                  )
                }
              }}
            />
            <Legend 
              content={renderLegend} 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ bottom: 40 }}
            />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default SolarVsGridPieChart;