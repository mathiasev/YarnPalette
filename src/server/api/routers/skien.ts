import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { skiens } from "~/server/db/schema";

export const skienRouter = createTRPCRouter({

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(skiens).values({
        name: input.name,
      })
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const skiens = await ctx.db.query.skiens.findMany({
      orderBy: (skiens, { desc }) => [desc(skiens.createdAt)],
      limit: 20,
    });

    return skiens ?? null;
  }),
});
