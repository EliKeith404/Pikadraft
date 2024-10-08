"use server";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import React from "react";
import SignInButton from "./_components/signin-btn";

export default async function Home() {
  const randomized = await api.pokemon.getRandomSetByTier.query({
    generation: 9,
    format: "tier",
    tier: "UU",
    currentParty: [],
    // choose: 4,
    filters: { noBattleFormes: true },
  });

  console.log(randomized);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <SignInButton />
      <CrudShowcase />
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
