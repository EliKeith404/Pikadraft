import Link from "next/link";
import { api } from "~/trpc/server";

export default async function DraftHomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <p>hello</p>
      <Link href={"/draft/build"}>Start</Link>
    </main>
  );
}
