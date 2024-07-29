import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { skienStocks, skiens } from "~/server/db/schema";

export const skienRouter = createTRPCRouter({

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      imageUrl: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await currentUser();
      if (!user) throw new Error("User not logged in");
      return await ctx.db.insert(skiens).values({
        name: input.name,
        imageUrl: input.imageUrl,
        createdBy: user.id
      }).returning()
    }),

  updateStock: publicProcedure
    .input(z.object({
      skienId: z.number(),
      location: z.string().min(1),
      stock: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await currentUser();
      if (!user) throw new Error("User not logged in");
      return await ctx.db.insert(skienStocks).values({
        skienId: input.skienId,
        location: input.location,
        stock: input.stock,
        createdBy: user.id
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
