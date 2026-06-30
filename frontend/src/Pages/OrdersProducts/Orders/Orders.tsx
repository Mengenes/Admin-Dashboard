"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { apiBaseUrl } from "../../../config/axios"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import * as React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { ordersData } from "./columns"
import type { orderStatus } from "./columns"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"

const updateStatusSchema = z.object({
  status: z.enum(["pending", "shipped", "delivered", "cancelled"]),
})

type UpdateStatusForm = z.infer<typeof updateStatusSchema>

function Orders() {



  const queryClient = useQueryClient()
  const [selectedOrder, setSelectedOrder] =
    React.useState<ordersData | null>(null)
  const [dialog, setDialog] =
    React.useState<"update" | "delete" | null>(null)
const tableColumns = React.useMemo(
  () => columns(setSelectedOrder, setDialog),
  [setSelectedOrder, setDialog]
)
  const form = useForm<UpdateStatusForm>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      status: selectedOrder?.status ?? "pending",
    },
  })

  React.useEffect(() => {
    if (selectedOrder) {
      form.reset({ status: selectedOrder.status })
    }
  }, [selectedOrder, form])

  const handleDelete = async () => {
    try {
      if (!selectedOrder) return

      await apiBaseUrl.delete(`/orders/${selectedOrder.order_id}`)

      queryClient.invalidateQueries({ queryKey: ["orders"] })

      toast.success("Order deleted")
      setDialog(null)
      setSelectedOrder(null)
    } catch (error) {
      console.log(error)
      toast.error("Error deleting order")
    }
  }

  async function fetchOrders() {
    const response = await apiBaseUrl.get("/orders")
    return response.data
  }

  const { data: ordersData, isLoading } = useQuery<ordersData[]>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
        staleTime: 5 * 60 * 1000,//5 minutes
gcTime: 30 * 60 * 1000, // 30 minutes
  })

  if (isLoading) return (    <div className="absolute inset-0 flex items-center justify-center">
              <Spinner  className="size-6" />
            </div>)

  return (
    <div className="flex flex-1 w-full justify-center items-start p-3 sm:p-6 ">
      <div className="w-full max-w-4xl overflow-x-auto">
        <DataTable
          columns={tableColumns}
          data={ordersData ?? []}
        
        />
      </div>

      <Dialog open={dialog === "update"} onOpenChange={() => setDialog(null)}>
        <DialogContent>
          <DialogTitle>Update Order Status</DialogTitle>

          {selectedOrder && (
            <form
              onSubmit={form.handleSubmit(async (data) => {
                await apiBaseUrl.patch(
                  `/orders/${selectedOrder.order_id}/status`,
                  data
                )

                queryClient.invalidateQueries({ queryKey: ["orders"] })

                toast.success("Order status updated")
                setDialog(null)
                setSelectedOrder(null)
              })}
              className="flex flex-col w-full space-y-4 mt-2"
            >
              <p className="text-sm text-muted-foreground">
                Order #{selectedOrder.order_id}
              </p>

              <Select
                // eslint-disable-next-line react-hooks/incompatible-library
                value={form.watch("status")}
                onValueChange={(value) =>
                  form.setValue("status", value as orderStatus)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button type="submit" className="w-full sm:w-auto">
                Save
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "delete"} onOpenChange={() => setDialog(null)}>
        <DialogContent>
          <DialogTitle className="text-red-500">Delete Order</DialogTitle>

          <p>
            Are you sure you want to delete order {selectedOrder?.order_id}?
          </p>

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setDialog(null)}>
              Cancel
            </Button>

            <Button
              className="bg-red-500 text-white"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Orders