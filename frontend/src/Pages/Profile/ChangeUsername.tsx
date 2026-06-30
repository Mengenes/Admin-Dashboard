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
const changeUsernameSchema=z.object({
currentPassword:z.string().min(6).max(20),
username:z.string().min(6).max(10)


})
type changeUsernameType =z.infer<typeof changeUsernameSchema>
function ChangeUsername() {
const {register,handleSubmit}=useForm<changeUsernameType>({resolver:zodResolver(changeUsernameSchema)})

async function onSubmit(data:changeUsernameType){
try {
   await apiBaseUrl.patch("/users/profile/update", {
  username: data.username,
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
         <DialogTrigger asChild  >
<Button variant="outline">Change Username</Button>
 </DialogTrigger>
        <DialogContent className="w-full  flex flex-col flex-wrap max-w-50    sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Username</DialogTitle>
            <DialogDescription>
             Enter Your  Current Password to Change Your Username
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-3'>
              <Label htmlFor="name-1" >Current Password</Label>
              <Input id="currentPassword" type='password'  required {...register('currentPassword')} />
            </div>
            <div className='flex flex-col gap-3'>
              <Label htmlFor="newUsername">New Username</Label>
              <Input id="newUsername"  required   {...register('username')} />
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

export default ChangeUsername