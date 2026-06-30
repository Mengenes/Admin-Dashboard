import { ArrowUpDown } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { OrderActions } from  "./OrdersActions"

export type orderStatus = "pending" | "shipped" | "delivered" | "cancelled"

export interface ordersData {
  order_id: number
  user_id: string
  status: orderStatus
  total: number
  created_at: string
}

export const columns = (
  setSelectedOrder: (order: ordersData) => void,
  setDialog: (value: "update" | "delete" | null) => void
): ColumnDef<ordersData>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "order_id",
    filterFn: (row, columnId, value) => {
  const cellValue = String(row.getValue(columnId))
  const filterValue = String(value)

 
  if (filterValue.length === 1) {
    return cellValue.includes(filterValue)
  }

  return cellValue === filterValue
},
    header: ({ column }) => (
      <Button
        variant="ghost"
        
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Order ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
  <div className="text-center w-full font-medium">
    {getValue<number>()}
  </div>
)
  },

  {
    accessorKey: "user_id",
    header: "User ID",
  },

  {
    accessorKey: "status",
    header: "Status",
  },

  {
    accessorKey: "total",
   header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },

  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) =>
      new Date(row.getValue("created_at")).toLocaleString(),
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <OrderActions
        order={row.original}
        setSelectedOrder={setSelectedOrder}
        setDialog={setDialog}
      />
    ),
  },
]