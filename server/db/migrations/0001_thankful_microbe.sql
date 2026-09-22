CREATE TABLE `chat_message` (
	`id` text NOT NULL,
	`chat_id` text NOT NULL,
	`role` text NOT NULL,
	`text` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`chat_id`, `id`)
);
--> statement-breakpoint
CREATE INDEX `idx_chat_message_chat_id_created_at` ON `chat_message` (`chat_id`,"created_at" desc);