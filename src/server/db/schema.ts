// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { or, relations, sql } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  json,
  integer,
  boolean,
  PgEnumColumn,
  pgEnum
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `yarn-palette_${name}`);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    createdBy: varchar("created_by").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  }
);


export const wishlistStatus = pgEnum("wishlist_status", ["public", "private"]);

export const wishlistItems = createTable(
  "wishlist_item",
  {
    id: serial("id").primaryKey(),
    wishlistId: integer("wishlist_id").notNull(),
    name: varchar("name", { length: 256 }),
    createdBy: varchar("created_by").notNull(),
    description: varchar("description", { length: 256 }),
    link: varchar("link", { length: 256 }),
    status: wishlistStatus("status"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  }
);

export const wishlist = createTable(
  "wishlist", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  public: boolean("public").notNull(),
  organization: varchar("organization", { length: 256 }),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
});

export const wishlistRelations = relations(wishlist, ({ many }) => ({
  wishlistItems: many(wishlistItems)
}));

export const wishlistItemRelations = relations(wishlistItems, ({ one }) => ({
  wishlist: one(wishlist, {
    fields: [wishlistItems.wishlistId],
    references: [wishlist.id]
  })
}));

export const skiens = createTable(
  "skien",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    organization: varchar("organization", { length: 256 }),
    info: json("info"),
    color: varchar("color", { length: 256 }),
    imageUrl: varchar("image_url", { length: 256 }),
    description: varchar("description", { length: 256 }),
    createdBy: varchar("created_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  }
);


export const skienStocks = createTable(
  "skien_stock",
  {
    id: serial("id").primaryKey(),
    skienId: integer("skien_id").notNull().references(() => skiens.id, { onDelete: 'cascade' }),
    location: varchar("location", { length: 256 }).notNull(),
    stock: integer("stock").notNull(),
    createdBy: varchar("created_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
  }
);


export const skienRelations = relations(skiens, ({ many }) => ({
  skienStocks: many(skienStocks)
}));

export const skienStockRelations = relations(skienStocks, ({ one }) => ({
  skien: one(skiens, {
    fields: [skienStocks.skienId],
    references: [skiens.id]
  }),


}));