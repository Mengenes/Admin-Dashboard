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
const changePasswordSchema=z.object({
currentPassword:z.string().min(6).max(20),
newPassword:z.string().min(6).max(20),
confirmNewPassword:z.string().min(6).max(20)


}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
});
type changePasswordType =z.infer<typeof changePasswordSchema>
function ChangePassword() {
const {register,handleSubmit}=useForm<changePasswordType>({resolver:zodResolver(changePasswordSchema)})

async function onSubmit(data:changePasswordType){
try {
    await apiBaseUrl.patch("/users/profile/update",{currentPassword:data.currentPassword,
    newPassword:data.newPassword,
})
    toast.success("Password changed successfully")
} catch (error) {
    console.log(error)
    toast.error("Failed to update password")
}


}


  return (
 <Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
       <DialogTrigger asChild  >
<Button variant="outline">Change Password</Button>
 </DialogTrigger>
        <DialogContent className="  sm:max-w-sm ">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
             Enter Your  Current Password to Change Your Password.
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-3'>
              <Label htmlFor="name-1">Current Password</Label>
              <Input id="currentPassword"   type='password' required {...register('currentPassword')} />
            </div>
            <div className='flex flex-col gap-3'>
              <Label htmlFor="newUsername">New Password</Label>
              <Input id="newUsername" type='password' required   {...register('newPassword')} />
            </div>
            <div className='flex flex-col gap-3'>
              <Label htmlFor="name-1">Confirm New Password</Label>
              <Input id="confirmNewPassword" type='password'  required {...register('confirmNewPassword')} />
            </div>


          </div>
          <DialogFooter>
            
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default ChangePassword