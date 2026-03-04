import { Skeleton } from "../ui/skeleton"
import { TableCell, TableRow } from "../ui/table"

function TransactionTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16 ml-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default TransactionTableSkeleton
