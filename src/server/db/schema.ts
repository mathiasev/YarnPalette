// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  json,
  integer
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
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);

export const skiens = createTable(
  "skien",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    info: json("info"),
    color: varchar("color", { length: 256 }),
    imageUrl: varchar("image_url", { length: 256 }),
    description: varchar("description", { length: 256 }),
    createdBy: varchar("created_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    skienNameIndex: index("skien_name_idx").on(example.name),
  })
);


export const skienStocks = createTable(
  "skien_stock",
  {
    id: serial("id").primaryKey(),
    skienId: integer("skien_id").notNull(),
    location: varchar("location", { length: 256 }).notNull(),
    stock: integer("stock").notNull(),
    createdBy: varchar("created_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    skienStockNameIndex: index("skien_stock_name_idx").on(example.location),
  })
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