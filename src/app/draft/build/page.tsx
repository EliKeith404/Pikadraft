import { Icons } from "@pkmn/img";
import Image from "next/image";
import DraftContainer from "~/app/_components/draft-container";
import { api } from "~/trpc/server";

export default async function DraftPickPage() {
  const randomized = await api.pokemon.getRandomSetByTier.query({
    generation: 9,
    format: "tier",
    tier: ["AG"],
    currentParty: [],
    // choose: 4,
    filters: {
      // noRegionalFormes: false,
      // noNFE: true,
      // noMegaFormes: false,
      // noItemFormes: false,
      // noBattleFormes: false,
      // noEventFormes: false,
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center">
      <DraftContainer pokeSelections={randomized} />
    </main>
  );
}
