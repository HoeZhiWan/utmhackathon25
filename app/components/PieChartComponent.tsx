"use client"

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label, Sector } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/app/components/ui/chart";

// Sample data for the pie chart
const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

// Chart configuration with directly defined HSL colors
const chartConfig = {
  'Group A': { 
    label: 'Group A',
    theme: {
      light: 'hsl(12, 76%, 61%)',   
      dark: 'hsl(220, 70%, 50%)'    
    }
  },
  'Group B': { 
    label: 'Group B',
    theme: {
      light: 'hsl(173, 58%, 39%)',
      dark: 'hsl(160, 60%, 45%)'
    }
  },
  'Group C': { 
    label: 'Group C',
    theme: {
      light: 'hsl(197, 37%, 24%)',
      dark: 'hsl(30, 80%, 55%)'
    }
  },
  'Group D': { 
    label: 'Group D',
    theme: {
      light: 'hsl(43, 74%, 66%)',
      dark: 'hsl(280, 65%, 60%)'
    }
  },
} satisfies ChartConfig;

// Define colors for light and dark modes
const COLORS_LIGHT = [
  'hsl(12, 76%, 61%)',   // Group A
  'hsl(173, 58%, 39%)',  // Group B
  'hsl(197, 37%, 24%)',  // Group C
  'hsl(43, 74%, 66%)'    // Group D
];

const COLORS_DARK = [
  'hsl(220, 70%, 50%)',  // Group A
  'hsl(160, 60%, 45%)',  // Group B
  'hsl(30, 80%, 55%)',   // Group C
  'hsl(280, 65%, 60%)'   // Group D
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
  // Calculate sum of all values for the center label
  const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);
  
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
    <div className="w-full h-full min-h-[300px] p-4">
      <h2 className="text-lg font-medium mb-2">Data Distribution</h2>
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
          <ChartLegend content={<ChartLegendContent />} />
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
                          200
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default PieChartComponent;