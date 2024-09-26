import "dotenv/config";

const appUrl = process.env.NUXT_APP_URL;
const cronToken = process.env.NUXT_CRON_TOKEN;

fetch(`${appUrl}/cron/updateRecentVods?token=${cronToken}`)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });
