"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { authClient } from "@/lib/authClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name should be at least 5 characters." })
    .max(50, { message: "Name should not exceed 50 characters." })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Name should only contain letters and spaces.",
    }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password should be at least 8 characters long." })
    .max(50, { message: "Password should not exceed 50 characters." }),
});

export default function SignUpPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      if (error) {
        setError(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, error]);

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    // Here you would typically send the data to your backend
    setIsPending(true);
    console.log(values);
    try {
      await authClient.signUp.email(
        {
          name: values.name,
          email: values.email,
          password: values.password,
        },
        {
          onRequest: () => {
            console.log("Pending");
          },
          onSuccess: () => {
            console.log("SUCESS!!");
            router.push("profile");
          },
          onError: (ctx) => {
            console.log(ctx);
            form.resetField("password");
            setError(ctx.error.message);

          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>
            Welcome! Create your account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 text-sm text-red-800 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Signing Up" : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy.
            <br></br>
            <br />
            Already Have an Account.?{" "}
            <Link
              className="hover:cursor-pointer hover:text-black"
              href={"/sign-in"}
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
