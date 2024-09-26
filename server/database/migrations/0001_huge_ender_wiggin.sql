CREATE TABLE `vods` (
	`provider` text NOT NULL,
	`vod_id` integer NOT NULL,
	`vod_name` text NOT NULL,
	`vod_remarks` text,
	`vod_time` text,
	PRIMARY KEY(`provider`, `vod_id`)
);
