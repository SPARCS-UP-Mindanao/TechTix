import Skeleton from './Skeleton';
import { TableBody } from './Table';

function TableSkeleton({ colCount, rowCount }: { colCount: number; rowCount: number }) {
  return (
    <TableBody>
      {new Array(rowCount).fill(0).map((_, index) => (
        <tr key={index}>
          {new Array(colCount).fill(0).map((_, index) => (
            <td key={index} className="p-1">
              <Skeleton className="w-full h-16 rounded-md" />
            </td>
          ))}
        </tr>
      ))}
    </TableBody>
  );
}

export default TableSkeleton;
