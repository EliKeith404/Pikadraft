import { Icons } from "@pkmn/img";
import Image from "next/image";
import DraftContainer from "~/app/_components/draft-container";
import { api } from "~/trpc/server";

export default async function DraftPickPage() {
  const randomized = await api.pokemon.getRandomSetByTier.query({
    generation: 9,
    format: "tier",
    tier: "AG",
    currentParty: [],
    // choose: 4,
    filters: {
      // noRegionalFormes: false,
      // noMegaFormes: false,
      // noItemFormes: false,
      // noBattleFormes: false,
      // noEventFormes: false,
    },
  });

  console.log(randomized);

  const { style, url, css } = Icons.getPokemon("pichu");

  console.log("url", url);
  console.log("style", style);
  console.log("css", css);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <span style={css} className="h-12 w-12" />
      <DraftContainer pokeSelections={randomized} />
    </main>
  );
}
