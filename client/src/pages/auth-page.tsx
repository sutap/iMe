import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2, Calendar, Heart, DollarSign, Lightbulb } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, isLoading, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", displayName: "", email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const onLoginSubmit = (values: LoginValues) => { loginMutation.mutate(values); };
  const onRegisterSubmit = (values: RegisterValues) => {
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData);
  };

  if (user) return <Redirect to="/" />;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#e6e8d4' }}>
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md border-0 rounded-2xl shadow-lg" style={{ backgroundColor: '#f0ede4' }}>
          <CardHeader className="space-y-1 pb-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-xl p-2" style={{ backgroundColor: '#7d9b6f' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold" style={{ color: '#3d3d2e' }}>iMe</CardTitle>
            </div>
            <CardDescription style={{ color: '#8a8a72' }}>
              Your personal life management companion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full mb-6 rounded-xl" style={{ backgroundColor: '#e6e8d4' }}>
                <TabsTrigger value="login" className="rounded-lg data-[state=active]:shadow-sm" style={{ color: activeTab === 'login' ? '#3d3d2e' : '#8a8a72' }}>Login</TabsTrigger>
                <TabsTrigger value="register" className="rounded-lg data-[state=active]:shadow-sm" style={{ color: activeTab === 'register' ? '#3d3d2e' : '#8a8a72' }}>Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField control={loginForm.control} name="username" render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: '#5a5a48' }}>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" className="rounded-xl border-0" style={{ backgroundColor: '#e6e8d4', color: '#3d3d2e' }} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={loginForm.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: '#5a5a48' }}>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your password" className="rounded-xl border-0" style={{ backgroundColor: '#e6e8d4', color: '#3d3d2e' }} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button
                      type="submit"
                      className="w-full rounded-xl text-white border-0 hover:opacity-90"
                      style={{ backgroundColor: '#7d9b6f' }}
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Login
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField control={registerForm.control} name="username" render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: '#5a5a48' }}>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Choose a username" className="rounded-xl border-0" style={{ backgroundColor: '#e6e8d4', color: '#3d3d2e' }} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={registerForm.control} name="displayName" render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: '#5a5a48' }}>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" className="rounded-xl border-0" style={{ backgroundColor: '#e6e8d4', color: '#3d3d2e' }} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={registerForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: '#5a5a48' }}>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Your email address" className="rounded-xl border-0" style={{ backgroundColor: '#e6e8d4', color: '#3d3d2e' }} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={registerForm.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: '#5a5a48' }}>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Create a password" className="rounded-xl border-0" style={{ backgroundColor: '#e6e8d4', color: '#3d3d2e' }} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={registerForm.control} name="confirmPassword" render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: '#5a5a48' }}>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm your password" className="rounded-xl border-0" style={{ backgroundColor: '#e6e8d4', color: '#3d3d2e' }} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button
                      type="submit"
                      className="w-full rounded-xl text-white border-0 hover:opacity-90"
                      style={{ backgroundColor: '#7d9b6f' }}
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Register
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-center w-full" style={{ color: '#8a8a72' }}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>

      <div className="hidden lg:flex flex-1 p-8 flex-col justify-center" style={{ backgroundColor: '#dde0cc' }}>
        <div className="max-w-lg mx-auto">
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#3d3d2e' }}>
            Good morning.
          </h1>
          <p className="text-lg mb-8" style={{ color: '#5a5a48' }}>
            iMe brings together your schedule, health tracking, finances, and
            personalized recommendations — all in one place.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Calendar, title: "Schedule", desc: "Keep track of all your events and appointments.", color: '#7d9b6f' },
              { icon: Heart, title: "Health", desc: "Monitor steps, water intake, and sleep patterns.", color: '#5a7a50' },
              { icon: DollarSign, title: "Finance", desc: "Track expenses, income, and budgets.", color: '#c4a882' },
              { icon: Lightbulb, title: "Discover", desc: "Get personalized suggestions for your routine.", color: '#a08050' },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-2xl" style={{ backgroundColor: '#f0ede4' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${item.color}20` }}>
                  <item.icon className="h-5 w-5" style={{ color: item.color }} />
                </div>
                <h3 className="font-semibold mb-1" style={{ color: '#3d3d2e' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: '#8a8a72' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
