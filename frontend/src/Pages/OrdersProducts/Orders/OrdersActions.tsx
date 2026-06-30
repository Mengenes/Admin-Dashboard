
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import type { ordersData } from "./columns"

export function OrderActions({
  order,
  setSelectedOrder,
  setDialog,
}: {
  order: ordersData
  setSelectedOrder: (o: ordersData) => void
  setDialog: (v: "update" | "delete" | null) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className=" p-4">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <div className="px-2 py-1 text-xs text-muted-foreground">
          Order #{order.order_id}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            setSelectedOrder(order)
            setDialog("update")
          }}
        >
          Update Order Status
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(String(order.order_id))}
        >
          Copy Order ID
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-500"
          onClick={() => {
            setSelectedOrder(order)
            setDialog("delete")
          }}
        >
          Delete Order
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}