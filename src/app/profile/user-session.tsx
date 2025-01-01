'use client'

import { useState, useEffect } from 'react';
import { authClient } from "@/lib/authClient";
import ClientPage from './profile-page';

export default function UserSession() {
  const [isLoading, setIsLoading] = useState(true);
  const session = authClient.useSession();

  useEffect(() => {
    if (session !== undefined) {
      console.log(session);
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <ClientPage session={session} />;
}

