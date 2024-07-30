import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { skienStocks, skiens } from "~/server/db/schema";

export const skienRouter = createTRPCRouter({

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      imageUrl: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {

      return await ctx.db.insert(skiens).values({
        name: input.name,
        imageUrl: input.imageUrl,
        createdBy: ctx.user.id
      }).returning()
    }),

  getSkienStock: protectedProcedure
    .input(
      z.object({
        skienId: z.number()
      }))
    .query(async ({ ctx, input }) => {
      const skienStocks = await ctx.db.query.skienStocks.findMany({
        where: (skienStocks, { eq }) =>
          eq(skienStocks.id, input.skienId),
        orderBy: (skienStocks, { desc }) => [desc(skienStocks.createdAt)]
      });

      return skienStocks ?? null;
    }),

  updateStock: protectedProcedure
    .input(z.object({
      skienId: z.number(),
      location: z.string().min(1),
      stock: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(skienStocks).values({
        skienId: input.skienId,
        location: input.location,
        stock: input.stock,
        createdBy: ctx.user.id
      }).returning()
    }),

  getMySkiens: protectedProcedure.query(async ({ ctx }) => {
    const skiens = await ctx.db.query.skiens.findMany({
      where: (skiens, { eq }) => eq(skiens.createdBy, ctx.user.id),
      orderBy: (skiens, { desc }) => [desc(skiens.createdAt)],
      limit: 20,
    });

    return skiens ?? null;
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
