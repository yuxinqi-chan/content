CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reply_to` text,
	`nickname` text NOT NULL,
	`email` text NOT NULL,
	`site` text,
	`content` text NOT NULL,
	`avatar` text,
	`location` text,
	`user_agent` text,
	`created_at` text NOT NULL
);
