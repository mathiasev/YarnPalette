import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { wishlist, wishlistItems } from "~/server/db/schema";

export const wishlistRouter = createTRPCRouter({

  createWishlist: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      public: z.boolean()
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(wishlist).values({
        name: input.name,
        public: input.public,
        createdBy: ctx.user,
        organization: ctx.organization
      }).returning()
    }),

  updateWishlist: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1),
      public: z.boolean()
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.update(wishlist).set({
        name: input.name,
        public: input.public
      }).where(
        eq(wishlist.id, input.id)
      ).returning()
    }),

  deleteWishlist: protectedProcedure
    .input(z.object({
      id: z.number().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(wishlist).where(
        eq(wishlist.id, input.id)
      )
    }),

  getPrivateWishlist: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const wishlist = await ctx.db.query.wishlist.findFirst({
        where: (wishlist, { eq }) => eq(wishlist.id, input.id),
        with: { wishlistItems: true }
      });

      return wishlist ?? null;
    }),

  getWishlist: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const wishlist = await ctx.db.query.wishlist.findFirst({
        where: (wishlist, { eq, and }) => and
          (eq(wishlist.id, input.id),
            eq(wishlist.public, true)
          ),
        with: { wishlistItems: true }
      });

      return wishlist ?? null;
    }),

  getWishlists: protectedProcedure.query(async ({ ctx }) => {
    let wishlists = null;
    if (ctx?.organization !== undefined && ctx?.organization !== null) {
      wishlists = await ctx.db.query.wishlist.findMany({
        where: (wishlist, { eq }) =>
          eq(wishlist.organization, ctx.organization ?? ""),
        orderBy: (wishlist, { desc }) => [desc(wishlist.createdAt)],
        with: { wishlistItems: true },
        limit: 20,
      });
    } else {
      wishlists = await ctx.db.query.wishlist.findMany({
        where: (wishlist, { eq }) =>
          eq(wishlist.createdBy, ctx.user),
        orderBy: (wishlist, { desc }) => [desc(wishlist.createdAt)],
        with: { wishlistItems: true },
        limit: 20,
      });
    }
    return wishlists ?? null;
  }),


  createWishlistItem: protectedProcedure
    .input(z.object({
      wishlistId: z.number(),
      name: z.string().min(1),
      description: z.string().optional(),
      link: z.string().optional(),
      status: z.enum(["favourite", "complete"]).optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(wishlistItems).values({
        wishlistId: input.wishlistId,
        name: input.name,
        description: input.description,
        link: input.link,
        status: input.status,
        createdBy: ctx.user
      }).returning()
    }),

  updateWishListItem: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1),
      description: z.string(),
      link: z.string(),
      status: z.enum(["favourite", "complete"]).optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.update(wishlistItems).set({
        name: input.name,
        description: input.description,
        link: input.link,
        status: input.status
      }).where(
        eq(wishlistItems.id, input.id)
      ).returning()
    }),

  deleteWishListItem: protectedProcedure
    .input(z.object({
      id: z.number().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(wishlistItems).where(
        and(
          eq(wishlistItems.createdBy, ctx.user),
          eq(wishlistItems.id, input.id),
        )
      )
    }),


  getWishListItems: protectedProcedure
    .input(z.object({ wishlistId: z.number() }))
    .query(async ({ ctx, input }) => {
      const wishlistItems = await ctx.db.query.wishlistItems.findMany({
        where: (wishlistItem, { eq }) => eq(wishlistItem.wishlistId, input.wishlistId),
        orderBy: (wishlistItem, { desc }) => [desc(wishlistItem.createdAt)],
      });

      return wishlistItems ?? null;
    }),

  deleteWishlistItem: protectedProcedure
    .input(z.object({
      id: z.number().min(1),
      wishlistId: z.number().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(wishlistItems).where(
        and(
          eq(wishlistItems.wishlistId, input.wishlistId),
          eq(wishlistItems.createdBy, ctx.user),
          eq(wishlistItems.id, input.id),
        )
      )
    }),
});
