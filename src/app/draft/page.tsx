import Link from "next/link";
import { PokemonDrafter } from "../_components/drafter";

export default async function DraftHomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <PokemonDrafter />
    </main>
  );
}
