"use client";

import React from "react";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";

const SignInButton = () => {
  return (
    <SessionProvider>
      <SignInOutButtons />
    </SessionProvider>
  );
};

const SignInOutButtons = () => {
  const { data: session } = useSession();

  return !session?.user ? (
    <button onClick={() => signIn("discord")}>Sign In</button>
  ) : (
    <button onClick={() => signOut()}>Sign Out</button>
  );
};

export default SignInButton;
