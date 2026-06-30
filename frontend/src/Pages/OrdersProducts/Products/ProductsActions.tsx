import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import type { ProductData } from "./columns"

export function ProductActions({
  product,
  setSelectedProduct,
  setDialog,
}: {
  product: ProductData
  setSelectedProduct: (p: ProductData) => void
  setDialog: (v: "update" | "delete" | null) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-8 w-8 flex items-center justify-center">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open product actions</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <div className="px-2 py-1 text-xs text-muted-foreground">
          Product ID: {product.id}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            setSelectedProduct(product)
            setDialog("update")
          }}
        >
           Update Product
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            navigator.clipboard.writeText(String(product.id))
          }
        >
           Copy Product ID
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            setSelectedProduct(product)
            setDialog("delete")
          }}
          className="text-red-500"
        >
           Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}