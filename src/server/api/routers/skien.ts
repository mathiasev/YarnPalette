import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { skienStocks, skiens } from "~/server/db/schema";

export const skienRouter = createTRPCRouter({

  updateInfo: protectedProcedure.input(z.object({
    id: z.number(),
    info: z.array(z.object({
      key: z.string(),
      value: z.string()
    }))
  })).mutation(async ({ ctx, input }) => {
    return await ctx.db.update(skiens).set({
      info: input.info
    }).where(
      eq(skiens.id, input.id)
    ).returning()
  }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      imageUrl: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {

      return await ctx.db.insert(skiens).values({
        name: input.name,
        imageUrl: input.imageUrl,
        createdBy: ctx.user.id,
        organization: ctx.organization?.id
      }).returning()
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.number().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(skiens).where(
        eq(skiens.id, input.id)
      )
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
    let skiens = null;
    if (ctx?.organization?.id !== undefined && ctx?.organization?.id !== null) {
      skiens = await ctx.db.query.skiens.findMany({
        where: (skiens, { eq, or }) => or(
          eq(skiens.createdBy, ctx.user.id),
          eq(skiens.organization, ctx.organization?.id ?? "")),
        orderBy: (skiens, { desc }) => [desc(skiens.createdAt)],
        limit: 20,
      });
    } else {
      skiens = await ctx.db.query.skiens.findMany({
        where: (skiens, { eq }) =>
          eq(skiens.createdBy, ctx.user.id),
        orderBy: (skiens, { desc }) => [desc(skiens.createdAt)],
        limit: 20,
      });
    }
    return skiens ?? null;
  }),
  getLatest: publicProcedure.query(async ({ ctx }) => {
    const skiens = await ctx.db.query.skiens.findMany({
      orderBy: (skiens, { desc }) => [desc(skiens.createdAt)],
      limit: 20,
      with: {
        skienStocks: {
          columns: { "stock": true }
        }
      },
    });

    return skiens ?? null;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const skien = await ctx.db.query.skiens.findFirst({
        where: (skiens, { eq }) => eq(skiens.id, input.id),
        with: { skienStocks: true },

      });

      return skien ?? null;
    }),

});
