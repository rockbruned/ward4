# Deployment — Don Rockbrune Ward 4



Production runs on [Railway](https://railway.com). The default Railway URL is:



`https://don-rockbrune-ward4-production.up.railway.app`



Custom domain target: **https://donrockbrune.com**



## One-command setup



After `railway login` and `railway link` (project **don-rockbrune-ward4**, environment **production**):



```bash

npm run setup:production

```



This runs `scripts/setup-production.mjs`, which:



1. Adds custom domains in Railway (`donrockbrune.com`, `www.donrockbrune.com`) via CLI

2. Sets `NEXT_PUBLIC_SITE_URL` if missing

3. Prints the exact **CNAME** and **TXT** records for your registrar



### GitHub + deploy secret (optional flag)



```bash

RAILWAY_TOKEN=your_project_token npm run setup:production -- --github

```



Requires [GitHub CLI](https://cli.github.com) (`gh auth login`). Creates the repo if needed, sets the `RAILWAY_TOKEN` Actions secret, and skips push unless you pass `--push` (needs at least one git commit).



Individual scripts:



| npm script | Script | Purpose |

|------------|--------|---------|

| `npm run railway:setup` | `scripts/railway-setup-production.mjs` | Domains + env var + DNS output |

| `npm run github:setup` | `scripts/github-setup.mjs` | Repo + `RAILWAY_TOKEN` secret |

| `npm run setup:production` | `scripts/setup-production.mjs` | Orchestrator (above + matrix) |



## Automated vs manual



| Step | Automated? | How |

|------|------------|-----|

| Railway custom domains | **Yes** | `npm run railway:setup` (`railway domain …`) |

| `NEXT_PUBLIC_SITE_URL` | **Yes** | Set by `railway:setup` if unset |

| DNS CNAME + TXT at registrar | **No** (by default) | Copy records from `railway:setup` output into registrar UI |

| DNS via Cloudflare API | **Optional** | Copy `scripts/dns-cloudflare.example.mjs` → `dns-cloudflare.mjs`, set `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ZONE_ID` |

| GitHub repo | **Yes** | `RAILWAY_TOKEN=xxx npm run github:setup` |

| `RAILWAY_TOKEN` GitHub secret | **Yes** | Same as above |

| `railway login` / link project | **Manual once** | Per machine |

| TLS certificate | **Automatic** | Railway after DNS verifies |

| GoDaddy / Namecheap DNS | **Manual** | Their APIs need separate credentials; use registrar UI or point NS to Cloudflare |



**Honest limit:** apex DNS automation depends on your DNS provider. Cloudflare is scriptable; most registrars are copy-paste unless you integrate their API.



## Automated deploy (GitHub Actions)



Pushes to `main` run [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml):



1. `npm ci`

2. `npm run build` (fails the workflow if the site does not build)

3. `railway up --detach` to the `don-rockbrune-ward4` service



### GitHub secrets (required)



| Secret | How to get it |

|--------|----------------|

| `RAILWAY_TOKEN` | Railway → project **don-rockbrune-ward4** → **Settings** → **Tokens** → create a **project token** for **production**. Or: `RAILWAY_TOKEN=xxx npm run github:setup` |



Do **not** commit tokens or `.env` files.



### One-time GitHub setup (manual alternative)



1. Create a GitHub repo for this project (root = `in-ward4` contents).

2. Push the `main` branch.

3. Add `RAILWAY_TOKEN` as above.

4. Push to `main` or run **Actions** → **Deploy to Railway** → **Run workflow**.



### Alternative: Railway GitHub integration



Instead of Actions, you can connect the repo in Railway:



**Project → don-rockbrune-ward4 → Settings → Connect GitHub repo** and deploy on push.



Use either GitHub Actions **or** Railway’s native GitHub deploy—not both unless you intend duplicate deploys.



## Manual deploy (local)



```bash

railway login

railway link   # if not already linked to don-rockbrune-ward4 / production

npm run deploy

```



`npm run deploy` runs `railway up --detach`.



## Environment variables (Railway)



Set in **Railway → don-rockbrune-ward4 → Variables** (production), or via `npm run railway:setup`:



### Site



| Variable | Description | Example format |

|----------|-------------|----------------|

| `NEXT_PUBLIC_SITE_URL` | Public site URL (canonical links, OG, QR) | `https://donrockbrune.com` |

| `CONTACT_EMAIL` | Default campaign contact; fallback for chat notifications | `Oshawa@INsportify.com` |

| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | (optional) Google Analytics 4 measurement ID | `G-XXXXXXXXXX` |



### Chat email (Resend)



Required to forward “Talk to Don” messages to the campaign inbox. Without these, chat still works but no email is sent (messages are logged server-side only).



| Variable | Description | Example format |

|----------|-------------|----------------|

| `RESEND_API_KEY` | API key from [Resend](https://resend.com) dashboard | `re_xxxxxxxxxxxx` |

| `RESEND_FROM_EMAIL` | Verified sender domain/address in Resend | `Don Rockbrune <notify@donrockbrune.com>` |

| `CHAT_NOTIFY_EMAIL` | (optional) Inbox for chat notifications; defaults to `CONTACT_EMAIL` | `Oshawa@INsportify.com` |



**Resend setup (brief):**



1. Create a Resend account and add/verify your sending domain (or use Resend’s sandbox for testing).

2. Create an API key under **API Keys**.

3. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` on the Railway service (use an address on your verified domain).

4. Redeploy. Submit a test message via “Talk to Don” — you should receive email at `CHAT_NOTIFY_EMAIL` or `CONTACT_EMAIL`.



### Chat database (Railway Postgres)



Stores visitor messages for campaign follow-up. Without `DATABASE_URL`, chat and email still work; storage is skipped with a server log warning.



| Variable | Description | Example format |

|----------|-------------|----------------|

| `DATABASE_URL` | Postgres connection string from Railway Postgres plugin | `postgresql://postgres:password@hostname.railway.app:5432/railway` |



**Postgres setup (brief):**



1. In **Railway → don-rockbrune-ward4 project**, click **+ New** → **Database** → **PostgreSQL**.

2. Open the Postgres service → **Variables** → copy `DATABASE_URL` (or use **Reference Variable** on the web service to link it).

3. Add `DATABASE_URL` to the **don-rockbrune-ward4** web service variables (reference from the plugin is preferred so credentials stay in sync).

4. Redeploy. The `chat_messages` table is created automatically on first chat submission.



`NEXT_PUBLIC_SITE_URL` drives canonical URLs, Open Graph links, and QR codes in [`lib/config.ts`](../lib/config.ts). Local dev uses `.env` (see [`.env.example`](../.env.example)).



## Custom domain: donrockbrune.com



### 1. Add domains in Railway (automated)



```bash

npm run railway:setup

```



Equivalent CLI:



```bash

railway domain donrockbrune.com --service 3c5a837b-8552-4406-96c9-ced7859d060c --json

railway domain www.donrockbrune.com --service 3c5a837b-8552-4406-96c9-ced7859d060c --json

```



Each command returns the **CNAME target** (e.g. `xxxx.up.railway.app`) and a **TXT** verification record (`_railway-verify`).



**Dashboard alternative:** Project → **don-rockbrune-ward4** → **Settings** → **Networking** → **Custom Domain**.



### 2. DNS at your registrar



Railway does **not** provide static A-record IPs. Use the records printed by `npm run railway:setup`.



#### www.donrockbrune.com



| Type | Name / Host | Value |

|------|-------------|--------|

| CNAME | `www` | Railway CNAME target (e.g. `xxxx.up.railway.app`) |

| TXT | `_railway-verify.www` | Verification token from Railway |



#### donrockbrune.com (apex)



| Type | Name / Host | Value |

|------|-------------|--------|

| CNAME, ALIAS, or ANAME | `@` (apex) | Same Railway CNAME target |

| TXT | `_railway-verify` | Verification token from Railway |



#### Cloudflare (optional automation)



If DNS is on Cloudflare:



1. Copy `scripts/dns-cloudflare.example.mjs` to `scripts/dns-cloudflare.mjs` (gitignored).

2. Create an API token with **Zone → DNS → Edit**.

3. Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ZONE_ID`.

4. Run after `railway:setup`:



```bash

node scripts/dns-cloudflare.mjs --file railway-dns.json

# or pipe: railway domain donrockbrune.com --json | node scripts/dns-cloudflare.mjs --stdin

```



**Registrar notes:**



- **Cloudflare:** CNAME at apex works (CNAME flattening). Proxy can stay DNS-only (grey cloud) until TLS is issued.

- **Namecheap, DNSimple, bunny.net:** use their ALIAS/ANAME/CNAME-at-root feature per [Railway’s root-domain docs](https://docs.railway.com/networking/domains/working-with-domains#adding-a-root-domain).

- **Registrars without apex CNAME/ALIAS:** point nameservers to Cloudflare (or another provider that supports flattening), then add the Railway records there.



Plain **A records to an IP are not supported** by Railway.



### 3. Wait for verification and TLS



In Railway **Networking**, domain status should move from pending to active. Railway issues HTTPS certificates automatically after DNS verifies (often minutes; up to 24–48 hours for DNS propagation).



### 4. Redirect www → apex (optional)



In Railway, configure `www.donrockbrune.com` to redirect to `https://donrockbrune.com`, or add both and prefer the apex in marketing links.



### 5. Set production URL



Handled automatically by `npm run railway:setup`. Manual alternative:



```bash

railway variable set NEXT_PUBLIC_SITE_URL=https://donrockbrune.com --service 3c5a837b-8552-4406-96c9-ced7859d060c

```



Redeploy so Next.js picks up the public env var.



## Project IDs (non-secret)



Useful for scripts and CI; safe to commit:



| Name | Value |

|------|--------|

| Project | `4fb1ec52-627c-473d-9792-6f4c29a8749f` |

| Environment (production) | `5c0e1516-08d9-404e-af51-f12a4764ddc5` |

| Service (don-rockbrune-ward4) | `3c5a837b-8552-4406-96c9-ced7859d060c` |



## Troubleshooting



- **Domain CLI returns Unauthorized:** run `railway login` again, or export `RAILWAY_TOKEN` (project token from Railway → Settings → Tokens).

- **Actions asks to log in / pick a service:** `RAILWAY_TOKEN` must be a **project** token; deploy uses `--service` with the ID above.

- **Site shows old Railway URL in metadata:** set `NEXT_PUBLIC_SITE_URL` and redeploy.

- **Apex domain stuck on “waiting for DNS”:** confirm both CNAME/ALIAS **and** TXT records; many registrars need ALIAS instead of CNAME at `@`.

