import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { apiBaseUrl } from "../../config/axios";

import { Label } from "../ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long"),
  confirmPassword: z
    .string()
    .min(6, "Confirm password must be at least 6 characters long")
    .max(20, "Confirm password must be at most 20 characters long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterModal() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      await apiBaseUrl.post("/auth/register", { email: data.email, username: data.username, password: data.password });
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        
        <Button variant="outline" className="border-0 hover:bg-cyan-600 hover w-full max-w-19 p-4 bg-primary">Register</Button>
        
        </DialogTrigger> 

      <DialogContent className="w-full max-w-md gap-10  sm:max-w-sm ">
        <DialogHeader>
          <DialogTitle className="font-extrabold">
            Register to your account
          </DialogTitle>
          <DialogDescription>
            Enter your credentials to create an account.
          </DialogDescription>
          
        </DialogHeader>


        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col w-full max-w-md gap-3">
            <div className="mb-2">
              <Label className="font-bold mb-2" htmlFor="email">Email</Label>
              <Input type="email" {...register("email")} id="email" />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="w-full max-w-md mb-2">
              <Label className="font-bold mb-2" htmlFor="username">Username</Label>
              <Input type="username" {...register("username")}  id="username"/>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="mb-2">
              <Label className="font-bold mb-2" htmlFor="password">Password</Label>
              <Input type="password" {...register("password")} id="password" />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="mb-5">
              <Label className="font-bold mb-2" htmlFor="confirmPassword">Confirm Password</Label>
              <Input type="password" {...register("confirmPassword")} id="confirmPassword" />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full max-w-sm">
              Register
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RegisterModal;