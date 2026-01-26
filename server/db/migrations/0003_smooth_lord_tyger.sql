CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`error` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
