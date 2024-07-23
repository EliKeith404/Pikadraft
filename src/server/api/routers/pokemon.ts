import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { Sprites } from "@pkmn/img";
import {
  Generations,
  type TierTypes,
  type SpeciesFormatsData,
} from "~/server/lib/formats-data/format-types";
import { Pokedex } from "~/server/lib/pokedex/pokedex";

export const pokemonRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      // Stuff
      console.log(input);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      // Stuff
      console.log(input);
    }),

  /**
   * Gets Pokemon names and sprites by a Smogon format.
   *
   * @returns An array of Pokemon names and sprite URLs
   */
  getAllByTier: publicProcedure
    .input(
      z.object({
        generation: z.custom<keyof typeof Generations>(),
        format: z.enum(["doublesTier", "natDexTier", "tier"]),
        tier: z.custom<
          SpeciesFormatsData["doublesTier" | "natDexTier" | "tier"]
        >(),
      }),
    )
    .query(({ input }) => {
      const pokeArr = [];
      for (const poke in Generations[input.generation]) {
        if (
          Generations[input.generation][poke]?.[input.format] === input.tier
        ) {
          const { url: spriteUrl } = Sprites.getPokemon(poke);

          pokeArr.push({ name: poke, spriteUrl: spriteUrl });
        }
      }

      return pokeArr;
    }),

  /**
   * Gets N amount of randomly picked Pokemon names and sprites by a Smogon format.
   * @param generation Integer value of generation to use.
   * @param format Singles, Doubles, or NatDex formats.
   * @param tierArray Array of tiers to grab Pokemon from. Determines total party size.
   * @returns A list of arrays each containing Pokemon names and sprite URLs, based on the `tierArray` param.
   */
  getRandomByTier: publicProcedure
    .input(
      z.object({
        generation: z.custom<keyof typeof Generations>(),
        format: z.enum(["doublesTier", "natDexTier", "tier"]),
        tierArray: z
          .array(
            z.custom<
              TierTypes["singles"] | TierTypes["doubles"] | TierTypes["other"]
            >(),
          )
          .default(["OU", "UU", "RU", "NU", "PU", "ZU"]),
        choose: z.number().default(3),
      }),
    )
    .query(({ input }) => {
      type PokemonInfo = {
        name: string;
        tier: string;
        spriteUrl: string;
        typeIconUrls: string[];
      };

      //! Change to grab one tier index at a time, to allow pokemon that weren't chosen to be entered back into the pool

      const result = [];

      const uniqueTiers = [...new Set(input.tierArray)];
      const pokemonInTiers: Record<string, PokemonInfo[]> = uniqueTiers.reduce(
        (obj, key) => ({ ...obj, [key]: [] }),
        {},
      );

      for (const tier of uniqueTiers) {
        for (const poke in Generations[input.generation]) {
          if (Generations[input.generation][poke]?.[input.format] === tier) {
            const { url: spriteUrl } = Sprites.getPokemon(poke);
            const { name, types } = Pokedex[poke]!;

            // Get typeIconUrl
            const typeIconUrls = [];
            for (const type of types) {
              typeIconUrls.push(
                `https://play.pokemonshowdown.com/sprites/types/${type}.png`,
              );
            }

            pokemonInTiers[tier]!.push({
              name: name,
              tier: tier,
              spriteUrl: spriteUrl,
              typeIconUrls: typeIconUrls,
            });
          }
        }

        // Shuffle the array once a tier has been filled out
        pokemonInTiers[tier] =
          pokemonInTiers[tier]!.sort(() => 0.5 - Math.random()) ?? [];
      }

      // Take N number of Pokemon, place them in their own array and remove them from the original array
      for (const tier of input.tierArray) {
        const randomizedPicks = pokemonInTiers[tier]!.splice(0, input.choose);
        result.push(randomizedPicks);
      }

      return result;
    }),

  getRandomSetByTier: publicProcedure
    .input(
      z.object({
        generation: z.custom<keyof typeof Generations>(),
        format: z.enum(["doublesTier", "natDexTier", "tier"]),
        tier: z.custom<
          TierTypes["singles"] | TierTypes["doubles"] | TierTypes["other"]
        >(),
        choose: z.number().default(3),
        currentParty: z.array(z.string()),
        filters: z
          .object({
            noRegionalFormes: z.boolean().default(false),
            noNFE: z.boolean().default(false),
            noMegaFormes: z.boolean().default(true),
            noItemFormes: z.boolean().default(true),
            noBattleFormes: z.boolean().default(true),
            noEventFormes: z.boolean().default(true),
          })
          .optional(),
      }),
    )
    .query(({ input }) => {
      const pokemonInTierArray = [];

      for (const poke in Generations[input.generation]) {
        const pokemonTierObj = Generations[input.generation][poke];

        if (
          // FILTERS ======
          // Filter for tier, if input tier is 'AG' include all tiers
          (pokemonTierObj?.[input.format] === input.tier ||
            input.tier === "AG") &&
          // Filter out any weird custom Pokemon
          pokemonTierObj?.isNonstandard !== "CAP" &&
          pokemonTierObj?.isNonstandard !== "Custom" &&
          // Filter out Illegal Pokemon, unless they have a National Dex tier for AG filtering
          !(
            pokemonTierObj?.tier === "Illegal" &&
            pokemonTierObj?.natDexTier === undefined
          ) &&
          // Filter out regonal variants
          !(
            !poke.includes("pikachu") &&
            input.filters?.noRegionalFormes === true &&
            [
              "Alola",
              "Galar",
              "Hisui",
              "Paldea",
              "Paldea-Combat",
              "Paldea-Blaze",
              "Paldea-Aqua",
            ].includes(Pokedex[poke]?.forme ?? "")
          ) &&
          // Filter out NFE
          !(
            input.filters?.noNFE === true && Pokedex[poke]?.evos !== undefined
          ) &&
          // Filter out mega formes
          !(
            input.filters?.noMegaFormes === true &&
            Pokedex[poke]?.forme === "Mega"
          ) &&
          !(
            input.filters?.noItemFormes === true &&
            [
              "Griseous Core",
              "Lustrous Globe",
              "Adamant Crystal",
              "Douse Drive",
              "Shock Drive",
              "Burn Drive",
              "Chill Drive",
              "Bug Memory",
              "Dark Memory",
              "Dragon Memory",
              "Electric Memory",
              "Fairy Memory",
              "Fighting Memory",
              "Fire Memory",
              "Flying Memory",
              "Ghost Memory",
              "Grass Memory",
              "Ground Memory",
              "Ice Memory",
              "Poison Memory",
              "Psychic Memory",
              "Rock Memory",
              "Steel Memory",
              "Water Memory",
              "Rusted Sword",
              "Rusted Shield",
            ].includes(Pokedex[poke]?.requiredItem ?? "")
          ) &&
          // Filter out battle formes
          !(
            !poke.includes("zacian") &&
            !poke.includes("zamazenta") &&
            input.filters?.noBattleFormes === true &&
            Pokedex[poke]?.battleOnly !== undefined
          ) &&
          // Filter out Event versions of Pokemon
          !(
            poke.includes("pikachu") &&
            input.filters?.noEventFormes === true &&
            [
              "Cosplay",
              "Rock-Star",
              "Belle",
              "Pop-Star",
              "PhD",
              "Libre",
              "Original",
              "Hoenn",
              "Sinnoh",
              "Unova",
              "Kalos",
              "Alola",
              "Partner",
              "Starter",
              "World",
            ].includes(Pokedex[poke]?.forme ?? "")
          ) &&
          // Filter out Pokemon that are already in the party, no duplicates
          !input.currentParty.includes(poke)
          //* ================================================ END FILTERS ===============================================
        ) {
          const { url: spriteUrl } = Sprites.getPokemon(poke);
          const { name, types, num: id } = Pokedex[poke]!;

          const pokeBattleName = (Pokedex[poke]?.battleOnly ?? "")
            .toString()
            .replaceAll("-", "");

          // Grab and format the pokemon's tier. If the pokemon is a form, grab base form tier.
          const tier =
            input.tier === "AG"
              ? // If tier is AnythingGoes, use Natdex tier
                Generations[input.generation][poke]?.natDexTier ??
                Generations[input.generation][pokeBattleName]?.natDexTier ??
                Generations[input.generation][poke]?.tier ??
                Generations[input.generation][pokeBattleName]?.tier ??
                ""
              : // Otherwise use normal tier
                Generations[input.generation][poke]?.tier ??
                Generations[input.generation][pokeBattleName]?.tier ??
                "";

          // Get typeIconUrl
          const typeIconUrls = [];
          for (const type of types) {
            typeIconUrls.push(
              `https://play.pokemonshowdown.com/sprites/types/${type}.png`,
            );
          }

          pokemonInTierArray.push({
            id: id,
            name: name,
            tier: tier,
            spriteUrl: spriteUrl,
            typeIconUrls: typeIconUrls,
          });
        }
      }

      // Shuffle and select X Pokemon from Array
      const result = pokemonInTierArray
        .sort(() => 0.5 - Math.random())
        .slice(0, input.choose);

      return result;
    }),

  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        iconUrl: z.string().optional(),
        spriteUrl: z.string().optional(),
        animatedUrl: z.string().optional(),
      }),
    )
    .query(({ input }) => {
      // Stuff
      // Could prob add some logic here to add missing sprites
      // if input.iconUrl === undefined {fetch(pokeAPI resource)}

      if (!input.animatedUrl) {
        const { url } = Sprites.getPokemon(input.name);
        input.animatedUrl = url;
      }
    }),

  creates: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
