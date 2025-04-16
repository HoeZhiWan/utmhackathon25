export default function HomePage() {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
      <div className="bg-shade-500">
        <div>01</div>
      </div>
      <div className="bg-shade-500">
        <div>02</div>
      </div>
      <div className="bg-shade-500">
        <div>03</div>
      </div>
      <div className="row-span-2 row-start-2 bg-shade-500">
        <div>04</div>
      </div>
      <div className="col-span-2 row-span-2 row-start-2 bg-shade-500">
        <div>05</div>
      </div>
    </div>
  );
}