CREATE TABLE `short_links` (
	`slug` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`is_proxy` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
