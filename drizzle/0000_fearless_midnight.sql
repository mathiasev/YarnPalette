CREATE TABLE IF NOT EXISTS "yarn-palette_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_by" varchar NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "yarn-palette_skien_stock" (
	"id" serial PRIMARY KEY NOT NULL,
	"skien_id" integer NOT NULL,
	"location" varchar(256) NOT NULL,
	"stock" integer NOT NULL,
	"created_by" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "yarn-palette_skien" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"info" json,
	"color" varchar(256),
	"image_url" varchar(256),
	"description" varchar(256),
	"created_by" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "yarn-palette_post" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "skien_stock_name_idx" ON "yarn-palette_skien_stock" ("location");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "skien_name_idx" ON "yarn-palette_skien" ("name");