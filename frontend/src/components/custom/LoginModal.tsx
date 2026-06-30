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
import zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUserStore } from "../../store/Zustand";

const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod
    .string()
    .min(6, "Password has to be longer than 6 characters")
    .max(20, "Password has to be shorter than 20 characters"),
});

type LoginFormData = zod.infer<typeof loginSchema>;

function LoginModal() {
  const setUserData = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
   resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      
      const res = await apiBaseUrl.post("/auth/login", data);
      console.log(res.data);
      setUserData(res.data.user);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials and try again.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
   <Button
            variant="outline"
            className="bg-green-300 border-0 hover:bg-cyan-600 hover w-full max-w-19 p-4"
          
            >Login
          </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-10 w-full sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-extrabold">
            Login to your Account
          </DialogTitle>
          <DialogDescription>
            Enter your credentials to login to your account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col w-full max-w-md">
            <div className="mb-5">
              <Label className="mb-2 font-bold">Email</Label>
              <Input
                type="email"
                {...register("email")}
                className="w-full max-w-sm"
                id="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between">
                <Label className="mb-2 font-bold">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary ml-auto font-bold"
                >
                  Forgot Your Password ?
                </Link>
              </div>
              <Input
                type="password"
                {...register("password")}
                className="w-full max-w-sm"
                id="password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full max-w-sm">
              Login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;