import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface ProductData {
  id: number
  name: string
  price: number
  stock: number
}

export const columns = (
  setSelectedProduct: (product: ProductData) => void,
  setDialog: (value: "update" | "delete" | null) => void
): ColumnDef<ProductData>[] => [
  {


    
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
{
  accessorKey: "id",
  header: "ID",
},
  {
    accessorKey: "name",

    header: "Product Name",
  },

  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Price
        <ArrowUpDown className="ml-2 h-4 max-w-4 w-full " />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-center font-medium">{formatted}</div>
    },
  },

  {
    accessorKey: "stock",
    header: "Stock",
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedProduct(product)
                setDialog("update")
              }}
            >
              Update Product
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(String(product.id))
              }
            >
              Copy ID
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-red-500"
              onClick={() => {
                setSelectedProduct(product)
                setDialog("delete")
              }}
            >
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]