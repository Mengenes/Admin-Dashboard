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
const changeEmailSchema=z.object({
currentPassword:z.string().min(6).max(20),
email: z.string().email()


})
type changeEmailType =z.infer<typeof changeEmailSchema>
function ChangeEmail() {
const {register,handleSubmit}=useForm<changeEmailType>({resolver:zodResolver(changeEmailSchema)})

async function onSubmit(data:changeEmailType){
try {
await apiBaseUrl.patch("/users/profile/update", {
  email: data.email,
  currentPassword: data.currentPassword
})
    toast.success("Email changed successfully")
    
} catch (error) {
    console.log(error)
    toast.error("Failed to update email")
}


}


  return (
 <Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild  >
<Button variant="outline">Change Email</Button>
 </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Email</DialogTitle>
            <DialogDescription >
             Enter Your Current Password To Change Your Email.
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-3' >
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type='password'  required {...register('currentPassword')} />
            </div>
            <div className='flex flex-col gap-3'>
              <Label htmlFor="newEmail">New Email</Label>
              <Input id="newUsername"  required   {...register('email')} />
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

export default ChangeEmail