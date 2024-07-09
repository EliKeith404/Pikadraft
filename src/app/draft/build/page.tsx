import DraftContainer from "~/app/_components/draft-container";
import { api } from "~/trpc/server";

export default async function DraftPickPage() {
  const randomized = await api.pokemon.getRandomSetByTier.query({
    generation: 9,
    format: "tier",
    tier: "UU",
    currentParty: [],
    // choose: 4,
  });

  console.log(randomized);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <DraftContainer pokeSelections={randomized} />
    </main>
  );
}
