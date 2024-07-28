import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { skiens } from "~/server/db/schema";

export const skienRouter = createTRPCRouter({

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(skiens).values({
        name: input.name,
      }).returning()

    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const skiens = await ctx.db.query.skiens.findMany({
      orderBy: (skiens, { desc }) => [desc(skiens.createdAt)],
      limit: 20,
    });

    return skiens ?? null;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const skien = await ctx.db.query.skiens.findFirst({
        where: (skiens, { eq }) => eq(skiens.id, input.id),
      });

      return skien ?? null;
    }),

});
