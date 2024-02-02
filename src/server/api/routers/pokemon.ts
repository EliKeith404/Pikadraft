import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { Sprites } from "@pkmn/img";
import {
  Generations,
  type SpeciesFormatsData,
} from "~/server/lib/formats-data/format-types";

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
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      // Stuff
    }),

  /**
   * Gets Pokemon names and sprites by a Smogon format.
   *
   * @returns An array of Pokemon names and sprite URLs
   */
  getAllByFormat: publicProcedure
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
   *
   * @returns An array of Pokemon names and sprite URLs
   */
  getRandomByFormat: publicProcedure
    .input(
      z
        .object({
          limit: z.number().default(3),
          rounds: z.number().default(6),
          generation: z.custom<keyof typeof Generations>(),
          formatList: z.array(z.enum(["doublesTier", "natDexTier", "tier"])),
          tier: z.custom<
            SpeciesFormatsData["doublesTier" | "natDexTier" | "tier"]
          >(),
        })
        .refine((value) => value.formatList.length === value.rounds, {
          message: "Format list length must match rounds",
          path: ["formatList"],
        }),
    )
    .query(({ input }) => {
      const pokeArr = [];
      for (const poke in Generations[input.generation]) {
        for (const format of input.formatList) {
          // TODO: Finish this function
          if (Generations[input.generation][poke]?.[format] === input.tier) {
            const { url: spriteUrl } = Sprites.getPokemon(poke);

            pokeArr.push({ name: poke, spriteUrl: spriteUrl });
          }
        }
      }

      return pokeArr;
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
