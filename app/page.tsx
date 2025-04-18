import PieChartComponent from './components/PieChartComponent';
import AreaChartComponent from './components/AreaChartComponent';
import TotalCost from './components/dashboard/TotalCost';
import SuggestionComponent from './components/dashboard/SuggestionComponent';

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
        <div>03</div>
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