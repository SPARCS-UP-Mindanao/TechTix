import Skeleton from './Skeleton';

function TableSkeleton({ colCount, rowCount }: { colCount: number; rowCount: number }) {
  return (
    <div className="rounded-md border w-full">
      {Array.from(Array(rowCount)).map((_, index) => (
        <div key={index} className="grid grid-cols-6 gap-3 w-full py-4 px-2">
          {Array.from(Array(colCount)).map((_, index) => (
            <Skeleton className="w-full h-5" key={index} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default TableSkeleton;
