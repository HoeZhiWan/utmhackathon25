"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart"
import { getEnergyBalance, refreshEnergyBalanceMaterializedView } from "../lib/data"

// Define the energy data structure that comes from Supabase
interface EnergyBalanceData {
  day: string;
  total_consumption: number;
  total_solar_generation: number;
  total_from_grid: number;
  total_to_grid: number;
}

// Define the structure for monthly grouped data
interface MonthlyGroup {
  totalUsage: number;
  totalCost: number;
}

// Define chart data type
interface ChartDataItem {
  month: string;
  usage: number;
  cost: number;
}

// Fallback data in case the API call fails
const fallbackData: ChartDataItem[] = [
  { month: "January", cost: 186, usage: 80 },
  { month: "February", cost: 305, usage: 200 },
  { month: "March", cost: 237, usage: 120 },
  { month: "April", cost: 73, usage: 190 },
  { month: "May", cost: 209, usage: 130 },
  { month: "June", cost: 214, usage: 140 },
]

const chartConfig = {
  cost: {
    label: "Cost (RM)",
    color: "var(--chart-1)",
  },
  usage: {
    label: "Usage (kWh)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

// Helper function to format date in a stable way for SSR/client consistency
function formatDate(date: Date) {
  // Use en-US locale for consistent formatting between server and client
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export function Component() {
  const [chartData, setChartData] = useState<ChartDataItem[]>(fallbackData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Use null for initial state to avoid hydration mismatch
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function fetchEnergyData() {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the date 6 months ago
      const today = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(today.getMonth() - 6);
      
      // Format dates for the API
      const endDate = today.toISOString().split('T')[0];
      const startDate = sixMonthsAgo.toISOString().split('T')[0];

      // Fetch energy balance data from materialized view
      const energyData = await getEnergyBalance(startDate, endDate);
      
      if (energyData && energyData.length > 0) {
        // Group data by month
        const monthlyData = groupDataByMonth(energyData);
        setChartData(monthlyData);
        setLastRefreshed(new Date());
      } else {
        // If no data was returned but also no error, show an information message
        setError("No energy data available for the selected period");
      }
    } catch (error) {
      console.error('Error fetching energy data:', error);
      // Show user-friendly error message
      if (error instanceof Error && error.message.includes('timed out')) {
        setError("Data request timed out. Showing sample data instead.");
      } else {
        setError("Couldn't load energy data. Showing sample data instead.");
      }
      // Keep fallback data if there's an error
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  // Function to refresh the materialized view and then fetch data
  async function handleRefresh() {
    try {
      setIsRefreshing(true);
      
      // First attempt to refresh the materialized view
      const refreshResult = await refreshEnergyBalanceMaterializedView();
      
      if (!refreshResult.success) {
        // If the refresh failed due to permissions, still try to fetch the latest data
        // but show a warning to the user
        setError(refreshResult.message);
      }
      
      // Fetch the data regardless of whether refresh succeeded
      await fetchEnergyData();
      
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError("Failed to refresh data. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    fetchEnergyData();
  }, []);

  // Function to group data by month
  function groupDataByMonth(data: EnergyBalanceData[]): ChartDataItem[] {
    const monthlyGroups: Record<string, MonthlyGroup> = {};
    const rate = 0.571; // Electricity rate in RM per kWh
    
    // Group by month
    data.forEach((entry: EnergyBalanceData) => {
      const date = new Date(entry.day);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      if (!monthlyGroups[monthYear]) {
        monthlyGroups[monthYear] = {
          totalUsage: 0,
          totalCost: 0
        };
      }
      
      // Net consumption = consumption - generation + from_grid - to_grid
      const netUsage = entry.total_consumption - entry.total_solar_generation + 
                      entry.total_from_grid - entry.total_to_grid;
      
      monthlyGroups[monthYear].totalUsage += netUsage;
      monthlyGroups[monthYear].totalCost += netUsage * rate;
    });
    
    // Convert to chart format
    return Object.entries(monthlyGroups).map(([month, data]) => ({
      month: month.split(' ')[0], // Just use month name without year
      usage: Math.round(data.totalUsage),
      cost: Math.round(data.totalCost)
    })).slice(-6); // Get the last 6 months
  }

  return (
    <Card className="border-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Total Energy Consumption Overview</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[280px] w-full flex items-center justify-center">
            <div className="animate-pulse">Loading energy data...</div>
          </div>
        ) : error ? (
          <div className="h-[280px] w-full flex flex-col items-center justify-center text-muted-foreground">
            <div className="mb-2">{error}</div>
            <div className="text-sm">Using sample data for visualization</div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="flex flex-col justify-center items-center w-1 mr-5">
              <span className="text-sm text-muted-foreground rotate-[-90deg] whitespace-nowrap">Energy Consumption (Watt)</span>
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
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis 
                    dataKey="cost"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={[0, "dataMax + 25000000"]}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-usage)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-usage)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="usage"
                  type="natural"
                  fill="url(#fillUsage)"
                  fillOpacity={0.4}
                  stroke="var(--color-usage)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default Component;