import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = process.cwd();
const envPath = resolve(root, ".env");
const npmCli = process.env.npm_execpath;

if (!npmCli) {
  console.error("Run this setup with `npm run db:setup`.");
  process.exit(1);
}

let env = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
const updates = new Map([
  ["DATABASE_URL", "file:./dev.db"],
  ["AUTH_SECRET", randomBytes(48).toString("base64url")],
  ["ADMIN_EMAIL", "admin@shopit.local"],
  ["ADMIN_PASSWORD", randomBytes(24).toString("base64url")],
  ["NEXT_PUBLIC_SITE_URL", "http://localhost:3000"],
]);

for (const [key, generatedValue] of updates) {
  const expression = new RegExp(`^\\s*${key}\\s*=\\s*(.*)\\s*$`, "m");
  const match = env.match(expression);
  const currentValue = match?.[1]?.replace(/^["']|["']$/g, "");
  const placeholder =
    currentValue === undefined ||
    (key === "AUTH_SECRET" && (currentValue.length < 32 || currentValue.startsWith("generated-by-"))) ||
    (key === "ADMIN_PASSWORD" && currentValue.startsWith("set-a-unique-password"));

  if (!match) {
    env += `${env.endsWith("\n") || !env ? "" : "\n"}${key}="${generatedValue}"\n`;
  } else if (placeholder) {
    env = env.replace(expression, `${key}="${generatedValue}"`);
  }
}

writeFileSync(envPath, env, { flag: "w" });
console.log("Prepared .env with a private local database and secure admin/session credentials.");

for (const args of [
  ["run", "db:migrate", "--", "--name", "init"],
  ["run", "db:seed"],
  ["run", "db:admin"],
]) {
  const result = spawnSync(process.execPath, [npmCli, ...args], {
    cwd: root,
    stdio: "inherit",
  });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log("Shopit database and administrator are ready.");
console.log("Admin credentials are stored in the ignored .env file.");
console.log("Customers can create accounts from the Sign up page.");
