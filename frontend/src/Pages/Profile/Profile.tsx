import { useQuery } from "@tanstack/react-query"
import { apiBaseUrl } from "../../config/axios"
import   {Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle} from "../../components/ui/card"
import ChangeUsername from "./ChangeUsername"
import ChangeEmail from "./ChangeEmail"
import ChangePassword from "./ChangePassword"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import DeleteAccount from "./DeleteAccount"

function Profile() {
async function  profileFetch(){
try {
  const response=await apiBaseUrl.get('/auth/me')
  
return response.data

} catch (error) {
 console.log("ERROR:", error); 
}


}





    const {data:profileData,isLoading}=useQuery({queryKey:['profileData'],queryFn:profileFetch,
    staleTime: 5 * 60 * 1000,//5 minutes
gcTime: 30 * 60 * 1000, // 30 minutes

    })



if(isLoading) return <Spinner/>



  return (
    <div className="flex-1 flex  w-full  justify-center items-center  text-white">
 <Card className="w-full max-w-sm   p-5 text-center">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>
          Profile details of <span className="text-[0.9rem]  ">{profileData.username} </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
       
          <div className="flex flex-col flex-wrap    gap-6">
           <div className="flex flex-rows gap-2  w-full justify-center items-center">
          <Label htmlFor="username">Username:</Label>
           <p>{profileData.username}</p> 
           
           <ChangeUsername/>
           </div> 
           <div className="flex flex-rows gap-2  w-full justify-center items-center">
                <Label htmlFor="username">Email:</Label>
            <p>{profileData.email}</p> 
            <ChangeEmail/>
            </div> 
            <div className="flex flex-rows gap-2  w-full justify-center items-center"> 
                  <Label htmlFor="username">Password:</Label> 
             <p>*******</p>
             <ChangePassword/>
             </div> 
          </div>
    
      </CardContent>
      <CardFooter className="flex  justify-end">
<DeleteAccount/>
      </CardFooter>
    </Card>
</div>

    )
}

export default Profile