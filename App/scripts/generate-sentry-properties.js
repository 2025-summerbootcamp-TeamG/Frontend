const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.sentry") });

const content = `
defaults.url=https://sentry.io/
defaults.org=${process.env.SENTRY_ORG}
defaults.project=${process.env.SENTRY_PROJECT}
auth.token=${process.env.SENTRY_AUTH_TOKEN}
`.trim();

fs.writeFileSync(path.resolve(__dirname, "../sentry.properties"), content);
console.log("✅ sentry.properties generated!");
