import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  emailToVerify: text("email_to_verify"),
  name: text("name").notNull(),
  avatar: text("avatar"),
  githubId: integer("github_id").unique(),
  githubToken: text("github_token"),
  twitchId: text("twitch_id").unique(),
  twitchToken: text("twitch_token"),
  verifiedAt: text("verified_at"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => sql`(current_timestamp)`)
    .$onUpdateFn(() => sql`(current_timestamp)`),
});

export const vods = sqliteTable(
  "vods",
  {
    provider: text("provider").notNull(),
    vodId: integer("vod_id").notNull(),
    vodName: text("vod_name").notNull(),
    vodRemarks: text("vod_remarks"),
    vodTime: text("vod_time"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.provider, t.vodId] }),
  }),
);
