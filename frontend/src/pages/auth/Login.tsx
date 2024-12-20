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
import { login } from "@/api/apiController";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import useAppStore from "@/useAppStore";

// Login form type
type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const { setUser } = useAppStore();
  const navigate = useNavigate();
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { user } = useAppStore();
  const token = localStorage.getItem("authToken");
  console.log(token, user);

  useEffect(() => {
    if (user?.id && token) {
      navigate("/", { replace: true });
    }
  }, [user, navigate, token]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login(data);
      const token = response.token;
      localStorage.setItem("authToken", JSON.stringify(token));
      setUser(response?.user);
      toast({
        variant: "success",
        title: response.message,
      });
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
            Welcome back!
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            We're so excited to see you again!
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
              <Button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600"
              >
                Log In
              </Button>
              <div className="space-y-4 text-sm text-gray-400">
                <div className="pt-2">
                  Need an account?{" "}
                  <Link
                    to="/signup"
                    className="text-indigo-400 hover:underline"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
