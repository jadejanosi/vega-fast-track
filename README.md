# VEGA — Digital Product Builder

## Stack
- React + Vite (frontend)
- Vercel Serverless Functions (API proxy + order validation)
- Anthropic Claude API (AI generation)
- WooCommerce REST API (order/tier validation)

## Local dev

```bash
npm install
cp .env.example .env.local
# Fill in your values — set USE_MOCK_AUTH=true to skip WooCommerce during dev
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import in Vercel — framework preset: **Vite**
3. Add environment variables in Vercel dashboard:
   - `ANTHROPIC_API_KEY`
   - `WC_CONSUMER_KEY`
   - `WC_CONSUMER_SECRET`
   - `FAST_TRACK_PRODUCT_ID` (WooCommerce product ID for the $17 Fast Track order bump)
   - `USE_MOCK_AUTH` → set to `false` in production
4. Deploy

## Connecting WooCommerce order validation

In WooCommerce > Settings > Advanced > REST API, create a key with **Read** permissions. Add the consumer key and secret to Vercel env vars.

The `api/validate-order.js` function checks the order number + email against your WooCommerce store and returns `fastTrack: true` if the Fast Track product ID is in the order's line items.

## Fast Track product ID

After you create the Fast Track product in WooCommerce, copy its product ID from the URL (e.g. `/wp-admin/post.php?post=XXXX`) and add it as `FAST_TRACK_PRODUCT_ID` in Vercel.

## Systeme.io member area

Embed the deployed Vercel URL in a Systeme.io member page as an iframe, or link directly to it from the post-purchase Brevo email. Buyers create their account using their order number + the email they purchased with.
