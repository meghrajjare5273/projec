"use client";

import { currentUser } from "@/lib/getSession";
import { userSession } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Homepage() {
  const [user, setUser] = useState<userSession | undefined>(undefined);
  useEffect(() => {
    async function fetchUser() {
      const user = await currentUser();
      if (user) {
        setUser(user);
      }
    }
    fetchUser();
  }, []);

  return(
    <>
      <h1>Welcome {user?.name}</h1>
    </>
  )
}
