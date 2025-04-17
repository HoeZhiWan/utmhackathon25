import { Pie } from 'recharts';
import PieChartComponent from './components/PieChartComponent';
import TotalCost from './components/dashboard/TotalCost';

export default function HomePage() {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
      <div className="bg-shade-500 rounded-xl p-4 flex flex-col min-w-[362px]">
        <TotalCost />
      </div>
      <div className="bg-shade-500 min-w-[362px]">
        <div>02</div>
      </div>
      <div className="bg-shade-500">
        <div>03</div>
      </div>
      <div className="row-span-2 row-start-2 bg-shade-500">
        <PieChartComponent />
      </div>
      <div className="col-span-2 row-span-2 row-start-2 bg-shade-500">
        <div>05</div>
      </div>
    </div>
  );
}