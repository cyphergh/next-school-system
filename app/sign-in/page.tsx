"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Button} from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import Logo from "@/public/logo.png"
import Image from "next/image";
import { useState } from "react";
import FullScreenLoading from "@/components/loading/fullscreen-loading";
import { LoginServerAction } from "@/actions/auth/login-action";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { loginFormSchema } from "@/lib/class";
import { useRouter } from "next/navigation";


function SignInPage() {
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      userId: "",
      password: "",
    },
  });
  const router = useRouter();
  const handleSubmit = async(value:z.infer<typeof loginFormSchema>) => {
    try {
      setLoading(true);
      let res = await LoginServerAction(value);
      if(res.error){
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: res.errorMessage!,
          action: (
            <ToastAction altText={res.errorMessage!}>Ok</ToastAction>
          ),
        });
      }
      router.replace("/dashboard");
    } catch (error:any) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message,
      });
    }
  };
  if(loading) return <FullScreenLoading></FullScreenLoading>
  return (
    <main className="p-4 flex min-h-screen flex-col items-center justify-center w-full gap-y-6">
      <Image src={Logo} alt="logo" className="w-[200px]"></Image>
      <h1 className="text-xl">Sign In </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="gap-y-6 flex flex-col">

          <FormField
            name="userId"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter User ID" autoComplete="on" type="text" {...field} className="p-4"></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          ></FormField>
          <FormField
           name="password"
           control={form.control}
           render={({field})=>{
            return <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter password" autoComplete="current-password" type="password" {...field} className="p-4"></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
           }}
          >
          </FormField>
          <Button type="submit" disabled={loading}>SignIn</Button>
        </form>
      </Form>
    </main>
  );
}

export default SignInPage;

