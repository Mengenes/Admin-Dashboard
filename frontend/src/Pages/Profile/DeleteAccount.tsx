import {z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {Input} from '../../components/ui/input'
import {Button} from "../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";    
import {toast} from "sonner"
import {Label} from "../../components/ui/label"
import { apiBaseUrl } from '../../config/axios'
const deleteuserSchema=z.object({
currentPassword:z.string().min(6).max(20)


})
type deleteUserType =z.infer<typeof deleteuserSchema>
function DeleteAccount() {
const {register,handleSubmit}=useForm<deleteUserType>({resolver:zodResolver(deleteuserSchema)})

async function onSubmit(data:deleteUserType){
try {
    await apiBaseUrl.patch("/users/profile/update", {
 currentPassword: data.currentPassword
})
    toast.success("Username changed successfully")
} catch (error) {
    console.log(error)
    toast.error("Failed to update username")
}


}


  return (
 <Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
        <Button variant="outline" className='bg-red-600'>Delete Account</Button>
          </DialogTrigger>
        <DialogContent className="sm:max-w-sm w-full ">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
            Enter Your  Current Password To  Delete Your Account.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div >
              <Label htmlFor="name-1" className='mb-3'>Current Password</Label>
              <Input id="currentPassword" type='password'  required {...register('currentPassword')} />
            </div>
          
          </div>
          <DialogFooter>
            
            <Button type="submit" className='bg-red-500'>Delete Account</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default DeleteAccount