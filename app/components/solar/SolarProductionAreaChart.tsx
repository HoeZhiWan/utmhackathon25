"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart"
import { getSolarGenerationByPanelId, getSolarPanels } from "@/app/lib/data"

// Define data structure for daily solar production
interface SolarProductionData {
  day: string;
  production: number;
}

// Define chart data type
interface ChartDataItem {
  date: string;
  production: number;
}

// Fallback data in case the API call fails
const fallbackData: ChartDataItem[] = [
  { date: "Apr 1", production: 186 },
  { date: "Apr 5", production: 250 },
  { date: "Apr 10", production: 305 },
  { date: "Apr 15", production: 270 },
  { date: "Apr 20", production: 320 },
  { date: "Apr 25", production: 290 },
  { date: "Apr 30", production: 310 },
]

const chartConfig = {
  production: {
    label: "Production (kWh)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

// Helper function to format date
function formatDate(date: Date) {
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}

export function SolarProductionAreaChart() {
  const [chartData, setChartData] = useState<ChartDataItem[]>(fallbackData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  async function fetchSolarProductionData() {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the current date and date 30 days ago
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      // Format dates for the API
      const endDate = today.toISOString().split('T')[0];
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];

      // First get all solar panels
      const solarPanels = await getSolarPanels();
      
      if (solarPanels && solarPanels.length > 0) {
        // Then get generation data for each panel
        const generationPromises = solarPanels.map(panel => 
          getSolarGenerationByPanelId(panel.id, startDate, endDate)
        );
        
        const allGenerationData = await Promise.all(generationPromises);
        
        // Combine all data and group by day
        const dailyProduction: Record<string, number> = {};
        
        allGenerationData.forEach(panelData => {
          panelData.forEach(entry => {
            const day = entry.timestamp.split('T')[0];
            if (!dailyProduction[day]) {
              dailyProduction[day] = 0;
            }
            dailyProduction[day] += entry.energy_generated;
          });
        });
        
        // Convert to chart format
        const formattedData = Object.entries(dailyProduction)
          .map(([day, production]) => {
            const date = new Date(day);
            return {
              date: formatDate(date),
              production: Math.round(production)
            };
          })
          .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA.getTime() - dateB.getTime();
          });
        
        if (formattedData.length > 0) {
          // Take the last 30 days or fewer if not enough data
          setChartData(formattedData.slice(-30));
          setLastRefreshed(new Date());
        } else {
          setError("No solar production data available for the selected period");
        }
      } else {
        setError("No solar panels found in the system");
      }
    } catch (error) {
      console.error('Error fetching solar production data:', error);
      // Show user-friendly error message
      if (error instanceof Error && error.message.includes('timed out')) {
        setError("Data request timed out. Showing sample data instead.");
      } else {
        setError("Couldn't load solar production data. Showing sample data instead.");
      }
      // Keep fallback data if there's an error
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSolarProductionData();
  }, []);

  return (
    <Card className="border-none h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Solar Energy Production</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[280px] w-full flex items-center justify-center">
            <div className="animate-pulse">Loading solar production data...</div>
          </div>
        ) : error ? (
          <div className="h-[280px] w-full flex flex-col items-center justify-center text-muted-foreground">
            <div className="mb-2">{error}</div>
            <div className="text-sm">Using sample data for visualization</div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="flex flex-col justify-center items-center w-1 mr-5">
              <span className="text-sm text-muted-foreground rotate-[-90deg] whitespace-nowrap">Solar Production (kWh)</span>
            </div>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} horizontal={false}/>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  dataKey="production"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={[0, 'dataMax + 10']}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillProduction" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-production)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-production)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="production"
                  type="natural"
                  fill="url(#fillProduction)"
                  fillOpacity={0.4}
                  stroke="var(--color-production)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SolarProductionAreaChart;