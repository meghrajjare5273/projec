"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
//import { authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import updateUser from "../../lib/updatedUser";
//import {user} from "@/lib/getSession";
import { currentUser } from "../../lib/getSession";
import { userSession } from "@/lib/types";
//import prisma from "@/lib/prisma";


const profileSchema = z.object({
  username: z.string().min(3).max(20),
  name: z.string().min(2).max(50),
  email: z.string().email(),
  bio: z.string().max(160).optional(),
  profilePicture: z.instanceof(File).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const [activeUser, setActiveUser] = useState<userSession | undefined>(undefined)
  const [isUser, setIsUser] = useState(false)
  //const user = currentUser     //await userSession()  //authClient.useSession();
  const router = useRouter()
  //const sessionId = user.id

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      bio: ""
    },
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await currentUser();
        if (user) {
          setActiveUser(user as userSession);
          setIsUser(true);
          // Set form values and other state only after getting user data
          form.reset({
            name: user.name || "",
            email: user.email || "",
            username: user.username || ""
          });
          setUserId(user.id);
          setAvatarUrl(user.image || "");
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function onSubmit(data: ProfileFormValues) {
    console.log(data);
    // Here you would typically send this data to your backend
    await updateUser(userId, data)

    
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("profilePicture", file);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-1/3" />
        </CardContent>
      </Card>
    );
  }

  else if (!activeUser){
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Sorry You Cannot Access The Contents on This Page</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={()=>{
            router.push("/sign-in")
          }}>Login Here</Button>
        </CardContent>

      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={avatarUrl || "/placeholder.svg?height=96&width=96"}
                />
                <AvatarFallback>
                  {form.watch("name")?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <FormField
                control={form.control}
                name="profilePicture"
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                       //onChange={handleFileChange}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a profile picture (max 5MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can only contain
                    letters, numbers, and dashes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
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
                    <Input placeholder="johndoe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little about yourself"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can @mention other users and organizations to link to
                    them.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
