CREATE TABLE `ai_query` (
	`id` text PRIMARY KEY NOT NULL,
	`prompt` text NOT NULL,
	`response` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_ai_query_created_at` ON `ai_query` ("created_at" desc);