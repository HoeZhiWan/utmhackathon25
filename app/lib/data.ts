import { supabase } from './supabase';

// Types based on the database schema
export type Room = {
  id: string;
  name: string;
  floor: number;
  area_sqft: number;
  created_at?: string;
};

export type Appliance = {
  id: string;
  room_id: string;
  name: string;
  type: string;
  power_rating: number;
  brand?: string;
  model?: string;
  created_at?: string;
};

export type EnergyConsumption = {
  id: string;
  appliance_id: string;
  timestamp: string;
  duration_minutes: number;
  energy_consumed: number;
  created_at?: string;
};

export type SolarPanel = {
  id: string;
  location: string;
  capacity_watts: number;
  efficiency: number;
  installation_date: string;
  brand?: string;
  model?: string;
  created_at?: string;
};

export type SolarGeneration = {
  id: string;
  panel_id: string;
  timestamp: string;
  duration_minutes: number;
  energy_generated: number;
  weather_condition?: string;
  created_at?: string;
};

export type GridExchange = {
  id: string;
  timestamp: string;
  duration_minutes: number;
  energy_amount: number; // positive = from grid, negative = to grid
  created_at?: string;
};

// Room functions
export async function getRooms() {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as Room[];
}

export async function getRoomById(id: string) {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Room;
}

// Appliance functions
export async function getAppliancesByRoomId(roomId: string) {
  const { data, error } = await supabase
    .from('appliances')
    .select('*')
    .eq('room_id', roomId)
    .order('name');
  
  if (error) throw error;
  return data as Appliance[];
}

export async function getAllAppliances() {
  const { data, error } = await supabase
    .from('appliances')
    .select('*, rooms(name, floor)')
    .order('name');
  
  if (error) throw error;
  return data;
}

// Energy consumption functions
export async function getEnergyConsumptionByApplianceId(applianceId: string, startDate?: string, endDate?: string) {
  let query = supabase
    .from('energy_consumption')
    .select('*')
    .eq('appliance_id', applianceId)
    .order('timestamp', { ascending: false });
    
  if (startDate) {
    query = query.gte('timestamp', startDate);
  }
  
  if (endDate) {
    query = query.lte('timestamp', endDate);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as EnergyConsumption[];
}

// Solar panel functions
export async function getSolarPanels() {
  const { data, error } = await supabase
    .from('solar_panels')
    .select('*')
    .order('location');
  
  if (error) throw error;
  return data as SolarPanel[];
}

// Solar generation functions
export async function getSolarGenerationByPanelId(panelId: string, startDate?: string, endDate?: string) {
  let query = supabase
    .from('solar_generation')
    .select('*')
    .eq('panel_id', panelId)
    .order('timestamp', { ascending: false });
    
  if (startDate) {
    query = query.gte('timestamp', startDate);
  }
  
  if (endDate) {
    query = query.lte('timestamp', endDate);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as SolarGeneration[];
}

// Grid exchange functions
export async function getGridExchange(startDate?: string, endDate?: string) {
  let query = supabase
    .from('grid_exchange')
    .select('*')
    .order('timestamp', { ascending: false });
    
  if (startDate) {
    query = query.gte('timestamp', startDate);
  }
  
  if (endDate) {
    query = query.lte('timestamp', endDate);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as GridExchange[];
}

// Views
export async function getRoomEnergyConsumption() {
  const { data, error } = await supabase
    .from('room_energy_consumption')
    .select('*')
    .order('total_energy_consumed', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getEnergyBalance(startDate?: string, endDate?: string) {
  // Track retry attempts
  let retryCount = 0;
  const maxRetries = 3;
  
  // Recursive function to handle retries
  async function attemptFetch() {
    try {
      console.log(`Fetching energy balance from ${startDate} to ${endDate}`);
      
      // Start with a simpler query if date range is large (more than 30 days)
      const isLargeRange = startDate && endDate && 
        (new Date(endDate).getTime() - new Date(startDate).getTime() > 30 * 24 * 60 * 60 * 1000);
      
      // Create base query - USE MATERIALIZED VIEW INSTEAD
      let query = supabase
        .from('energy_balance_materialized')  // Changed from 'energy_balance' to 'energy_balance_materialized'
        .select('*');
        
      // Add date range filters first to maintain PostgrestFilterBuilder type
      if (startDate) {
        query = query.gte('day', startDate);
      }
      
      if (endDate) {
        query = query.lte('day', endDate);
      }
      
      // For large date ranges, optimize the query with aggregation
      if (isLargeRange) {
        // Apply transformations after filtering to avoid type errors
        query = query.order('day', { ascending: false });
        
        // For weekly aggregation, use a separate query with proper typing
        const { data: weeklyData, error: weeklyError } = await supabase
          .from('energy_balance_materialized')  // Changed from 'energy_balance' to 'energy_balance_materialized'
          .select('day, total_consumption, total_solar_generation, total_from_grid, total_to_grid')
          .gte('day', startDate || '')
          .lte('day', endDate || '')
          .order('day', { ascending: false });
          
        if (weeklyError) {
          console.error('Error fetching weekly data:', weeklyError);
          throw weeklyError;
        }
        
        // Process data to aggregate by week in JavaScript instead of database
        if (weeklyData) {
          const weeklyAggregated = aggregateByWeek(weeklyData);
          return weeklyAggregated;
        }
      } else {
        // For smaller ranges, just order the results
        query = query.order('day', { ascending: false });
      }
      
      // Execute query
      const { data, error } = await query;
      
      if (error) {
        // If timeout error and we haven't hit max retries, try with a more optimized query
        if (error.code === '57014' && retryCount < maxRetries) {
          console.warn(`Query timeout (attempt ${retryCount + 1}/${maxRetries}), retrying with a more optimized query...`);
          retryCount++;
          
          // Force a more aggressive optimization on retry
          return attemptFetch();
        }
        
        console.error('Supabase error in getEnergyBalance:', error);
        throw error;
      }
      
      return data;
    } catch (err: any) {
      // Specific handling for timeout errors
      if (err?.code === '57014' && retryCount < maxRetries) {
        console.warn(`Query timeout (attempt ${retryCount + 1}/${maxRetries}), retrying...`);
        retryCount++;
        return attemptFetch();
      }
      
      console.error('Error fetching energy balance data:', err);
      // Return empty array instead of throwing, to prevent component errors
      return [];
    }
  }
  
  return attemptFetch();
}

// Helper function to aggregate data by week
function aggregateByWeek(data: any[]) {
  const weeklyGroups: Record<string, any> = {};
  
  data.forEach(entry => {
    // Get the week start date (Sunday)
    const date = new Date(entry.day);
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    const diff = date.getDate() - day;
    const weekStart = new Date(date);
    weekStart.setDate(diff);
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeklyGroups[weekKey]) {
      weeklyGroups[weekKey] = {
        day: weekKey,
        total_consumption: 0,
        total_solar_generation: 0,
        total_from_grid: 0,
        total_to_grid: 0
      };
    }
    
    // Sum up the values
    weeklyGroups[weekKey].total_consumption += Number(entry.total_consumption) || 0;
    weeklyGroups[weekKey].total_solar_generation += Number(entry.total_solar_generation) || 0;
    weeklyGroups[weekKey].total_from_grid += Number(entry.total_from_grid) || 0;
    weeklyGroups[weekKey].total_to_grid += Number(entry.total_to_grid) || 0;
  });
  
  return Object.values(weeklyGroups);
}

// Function to refresh the materialized view
export async function refreshEnergyBalanceMaterializedView() {
  try {
    // Attempt to refresh the materialized view using Supabase's RPC functionality
    const { data, error } = await supabase.rpc('refresh_energy_balance_materialized');
    
    if (error) {
      console.error('Error refreshing materialized view:', error);
      
      // Check if it's a permission error
      if (error.code === '42501') {
        console.warn('Permission denied: User does not have privileges to refresh the materialized view');
        // Instead of throwing an error, return false with a specific error message
        return { success: false, message: 'Permission denied. Please contact your database administrator to refresh the materialized view.' };
      }
      
      return { success: false, message: `Database error: ${error.message || 'Unknown error'}` };
    }
    
    console.log('Energy balance materialized view refreshed successfully');
    return { success: true, message: 'Energy balance materialized view refreshed successfully' };
  } catch (err) {
    console.error('Failed to refresh materialized view:', err);
    return { success: false, message: 'Failed to refresh materialized view due to an unexpected error' };
  }
}