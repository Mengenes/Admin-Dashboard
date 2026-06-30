
import { apiBaseUrl } from "../../config/axios"

import { Dialog, DialogContent, DialogTitle,DialogTrigger,DialogHeader,DialogDescription,DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input"

const addProductSchema = z.object({
 name: z.string().trim().min(1, "Product name is required"),
  price: z.coerce.number<number>().positive(),
  stock: z.coerce.number<number>().int().nonnegative(),
})

type addProductData = z.infer<typeof addProductSchema>

function AddProductModal() {



  const {
    register,
    handleSubmit,
    
    formState: { errors },
  } = useForm<addProductData>({
    resolver: zodResolver(addProductSchema),
  })

async function onSubmit(data:addProductData){
try {
     const res = await apiBaseUrl.post("/products", data);
      console.log(res.data);
    toast.success("Product added succesfully!");
}
 catch (error) {
      console.error("Login failed:", error);
      toast.error("Action failed. Please check your values.");
}
  } 



  return (

      <Dialog>
      <DialogTrigger asChild>
   <Button
            variant="outline"
            className="bg-green-300  hover:bg-primary"
          
            >Add Product
          </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col flex-wrap gap-10 w-full max-w-md sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-extrabold">
            Add Product
          </DialogTitle>
          <DialogDescription>
            Enter product values to add a product.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col w-full max-w-md">
            <div className="mb-5">
              <Label className="mb-2 font-bold" htmlFor="name">Product Name</Label>
              <Input
                type="string"
                {...register("name")}
                className="w-full max-w-sm"
         
                id="name"
                autoComplete="off"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between">
                <Label className="mb-2 font-bold" htmlFor="price">Price</Label>
              </div>
              <Input
             type="text"
  inputMode="decimal"
                {...register("price")}
                className="w-full max-w-sm"
             
                id="price"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">
                  {errors.price.message}
                </p>
              )}
            </div>
<div className="mb-5">
              <Label className="mb-2 font-bold" htmlFor="stock">Stock</Label>
              <Input
                type="number"
                {...register("stock")}
                className="w-full max-w-sm"
       
                id="stock"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>


          </div>

          <DialogFooter>
            <Button type="submit" className="w-full max-w-sm">
              Add Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddProductModal