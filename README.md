# Don Rockbrune for Ward 4

Campaign site for Don Rockbrune — City Councillor, Ward 4, Oshawa (2026).

## Development

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Production is on Railway. See **[docs/DEPLOY.md](docs/DEPLOY.md)** for:

- **One-command setup:** `npm run setup:production` (Railway domains, env, DNS instructions)
- GitHub Actions deploy on push to `main`
- Custom domain **donrockbrune.com** and DNS steps
- Railway environment variables
- Manual `npm run deploy`

## Stack

- [Next.js](https://nextjs.org) 14 (App Router)
- Tailwind CSS
- Railway (hosting)
