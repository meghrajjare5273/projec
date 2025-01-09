"use server"

import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import prisma from "./prisma";

export  async function userSession(){
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session){
        return redirect("/")
    }else{
        return session?.user
    }
}

export const currentUser = async () =>{
    const userData = await userSession()
    const user = await prisma.user.findFirst({
        where:{
          id: userData.id as string
        }
      })
    return user  
} 