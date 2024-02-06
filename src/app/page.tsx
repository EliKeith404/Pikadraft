import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  // const ouFormat = await api.pokemon.getAllByTier.query({
  //   generation: 9,
  //   format: "tier",
  //   tier: "ZU",
  // });

  // console.log(ouFormat);

  const randomized = await api.pokemon.getRandomByTier.query({
    generation: 9,
    format: "tier",
    tierArray: ["OU", "OU", "UU", "UU", "RU", "RU"],
    // limit: 4,
  });

  console.log(randomized);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="grid grid-cols-1">
        {/* {ouFormat
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((poke) => {
            return <img key={poke.name} src={poke.spriteUrl} alt={poke.name} />;
          })} */}
        {randomized.map((tier, i) => (
          <div key={i} className="flex items-center justify-center">
            {tier.map((poke) => (
              <div key={poke.name} className="flex">
                <img src={poke.spriteUrl} alt={poke.name} />
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* <CrudShowcase /> */}
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
