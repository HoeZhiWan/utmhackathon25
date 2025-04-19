import PieChartComponent from './components/PieChartComponent';
import AreaChartComponent from './components/AreaChartComponent';
import TotalCost from './components/dashboard/TotalCost';
import SuggestionComponent from './components/dashboard/SuggestionComponent';
import EnergyFlow from './components/dashboard/EnergyFlow';

export default function HomePage() {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
      <div className="bg-shade-500 rounded-xl p-4 flex flex-col min-w-[362px]">
        <TotalCost />
      </div>
      <div className="bg-shade-500 rounded-xl min-w-[362px]">
        <SuggestionComponent />
      </div>
      <div className="bg-shade-500">
        <EnergyFlow solarWatts={19} gridWatts={20} homeWatts={30}/>
      </div>
      <div className="row-span-2 row-start-2 bg-shade-500">
        <PieChartComponent />
      </div>
      <div className="col-span-2 row-span-2 row-start-2 bg-shade-500 p-4 rounded-xl">
        <AreaChartComponent />
      </div>
    </div>
  );
}