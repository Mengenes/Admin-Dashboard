import { useQuery, useQueryClient } from "@tanstack/react-query"
import { apiBaseUrl } from "../../../config/axios"
import { DataTable } from "./data-table"
import { columns, type ProductData } from "./columns"
import * as React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import AddProductModal from "@/components/custom/AddProductModal"
import { Spinner } from "@/components/ui/spinner"

const updateSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
})

type updateFormData = z.infer<typeof updateSchema>

function Products() {
  const queryClient = useQueryClient()

  const [selectedProduct, setSelectedProduct] =
    React.useState<ProductData | null>(null)

  const [dialog, setDialog] =
    React.useState<"update" | "delete" | null>(null)
const tableColumns = React.useMemo(
  () => columns(setSelectedProduct, setDialog),
  [setSelectedProduct, setDialog]
)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<updateFormData>({
    resolver: zodResolver(updateSchema),
  })

  React.useEffect(() => {
    if (selectedProduct) {
      reset({
        name: selectedProduct.name,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
      })
    }
  }, [selectedProduct, reset])

  const handleUpdate = async (data: updateFormData) => {
    try {
      if (!selectedProduct) return

      await apiBaseUrl.patch(`/products/${selectedProduct.id}`, {
        name: data.name,
        price: data.price,
        stock: data.stock,
      })

      queryClient.invalidateQueries({ queryKey: ["products"] })

      toast.success("Product updated")

      setDialog(null)
      setSelectedProduct(null)
    } catch (error) {
      console.error(error)
      toast.error("Failed to update product")
    }
  }

  const handleDelete = async () => {
    try {
      if (!selectedProduct) return

      await apiBaseUrl.delete(`/products/${selectedProduct.id}`)

      queryClient.invalidateQueries({ queryKey: ["products"] })

      toast.success("Product deleted")

      setDialog(null)
      setSelectedProduct(null)
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete product")
    }
  }

  async function fetchProducts() {
    const response = await apiBaseUrl.get("/products")
    return response.data
  }

  const { data: productsData, isLoading } = useQuery<ProductData[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
        staleTime: 5 * 60 * 1000,//5 minutes
gcTime: 30 * 60 * 1000, // 30 minutes
  })

  if (isLoading) return (    <div className="absolute inset-0 flex items-center justify-center">
              <Spinner  className="size-6" />
            </div>)

  return (
    <div className="flex-1 flex w-full justify-center items-start p-2 sm:p-4 overflow-x-auto">
      <div className="w-full max-w-4xl overflow-x-auto">
        <DataTable
          columns={tableColumns}
          data={productsData ?? []}
          action={<AddProductModal />}
        />
      </div>

      <Dialog open={dialog === "update"} onOpenChange={() => setDialog(null)}>
        <DialogContent className="w-[95%] sm:max-w-md">
          <DialogTitle>Update Product</DialogTitle>

          {selectedProduct && (
            <p className="text-sm text-muted-foreground mt-1">
              Product ID: {selectedProduct.id}
            </p>
          )}

          <form
            onSubmit={handleSubmit(handleUpdate)}
            className="space-y-4 mt-5"
          >
            <div className="space-y-1">
              <Label htmlFor="name">Product Name</Label>
              <input
                className="w-full border p-2 rounded"
                {...register("name")}
                id="name"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="price">Product Price</Label>
              <input
                type="number"
                className="w-full border p-2 rounded"
                {...register("price", { valueAsNumber: true })}
                id="price"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label  htmlFor="stock">Product Stock</Label>
              <input
                type="number"
                className="w-full border p-2 rounded"
                {...register("stock", { valueAsNumber: true })}
                id="stock"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">
                  {errors.stock.message}
                </p>
              )}
            </div>

            <Button type="submit" className="mt-6 w-full">
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "delete"} onOpenChange={() => setDialog(null)}>
        <DialogContent className="w-[95%] sm:max-w-md">
          <DialogTitle>Delete Product</DialogTitle>

          {selectedProduct && (
            <p className="text-sm text-muted-foreground mt-2">
              Product ID: {selectedProduct.id}
            </p>
          )}

          <p className="mt-3 text-sm">
            Are you sure you want to delete{" "}
            <span className="font-medium">{selectedProduct?.name}</span>?
          </p>

          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-5">
            <Button
              variant="outline"
              onClick={() => setDialog(null)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              className="bg-red-500 text-white w-full sm:w-auto"
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

export default Products