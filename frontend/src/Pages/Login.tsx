import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiBaseUrl } from "../config/axios"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

import zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useUserStore } from  "../store/Zustand"

const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod
    .string()
    .min(6, "Password has to be longer than 6 characters")
    .max(20, "Password has to be shorter than 20 characters"),
})

type LoginFormData = zod.infer<typeof loginSchema>

function LoginCard() {
  const setUserData = useUserStore((state) => state.setUser)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  async function onSubmit(data: LoginFormData) {
    try {
      
      const res = await apiBaseUrl.post("/auth/login", {email:data.email,password:data.password})

      setUserData(res.data.user)

      toast.success("Logged in successfully!")
      navigate("/")

    } catch (error) {
      console.error(error)
      toast.error(
        "Login failed. Please check your credentials and try again."
      )
    }
  }

  return (
       <main className="  flex items-center justify-center">
    <Card className="w-full max-w-md shadow-lg p-2  flex flex-col gap-10">
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold">
          Login to your Account
        </CardTitle>

        <CardDescription>
          Enter your credentials to login to your account.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5 flex flex-col gap-2">
          <div>
            <Label className="mb-2 font-bold" htmlFor="email">Email</Label>

            <Input
              type="email"
              {...register("email")}
              id="email"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="font-bold" htmlFor="password">
                Password
              </Label>

              <Link
                to="/forgot-password"
                className="text-sm font-bold text-primary"
              >
                Forgot Password?
              </Link>
            </div>

            <Input
              type="password"
              {...register("password")}
              id="password"
            
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="mt-8">
          <Button
            type="submit"
            className="w-full"
          >
            Login
          </Button>
        </CardFooter>
      </form>
    </Card>
    </main>
  )
}

export default LoginCard