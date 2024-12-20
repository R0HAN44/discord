import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "@/api/apiController";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import useAppStore from "@/useAppStore";

// Sign up form type
type SignUpFormValues = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const { user, setUser } = useAppStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<SignUpFormValues>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && user?.id) {
      if (window.location.pathname !== "/") {
        navigate("/");
      }
      return;
    }
  }, [navigate]);

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      const response = await signup(data);
      console.log(response);
      const token = response.token;
      const expiryInMinutes = 1400;
      const expiryTime = new Date().getTime() + expiryInMinutes * 60 * 1000;
      const tokenData = {
        value: token,
        expiry: expiryTime,
      };
      localStorage.setItem("authToken", JSON.stringify(tokenData));
      setUser(response?.user);
      if (response.success) {
        toast({
          variant: "default",
          title: response.message,
        });
        navigate("/");
      }
    } catch (error: any) {
      console.log(error?.response?.data?.message || "Something went wrong");
      const errMsg = error?.response?.data?.message || "Something went wrong";
      toast({
        variant: "destructive",
        title: errMsg,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800 text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Join our community today!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-200">
                      EMAIL
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="name@example.com"
                        className="bg-slate-700 border-slate-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-200">
                      NAME
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-slate-700 border-slate-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 4,
                    message: "Password must be at least 4 characters",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-200">
                      PASSWORD
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="bg-slate-700 border-slate-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === form.getValues("password") ||
                    "Passwords do not match",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-200">
                      CONFIRM PASSWORD
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="bg-slate-700 border-slate-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600"
              >
                Sign Up
              </Button>
              <div className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-400 hover:underline">
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
