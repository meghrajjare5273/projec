"use server"

import { ProfileFormValues } from "@/app/profile/profile-page"
import prisma from "./prisma"
// import { userSession } from "./types"

export default async function updateUser(sessionId : string | undefined, data : ProfileFormValues){
    const updatedUser = await prisma.user.update({
        data : {
          username : data.username,
          email : data.email,
          name : data.name
        },
        where : {
          id : sessionId
        }
      })
  
      console.log(updatedUser)
}
