# A+Market — Deployment Guide

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Edit .env.local with your values (see below)

# 4. Set up free PostgreSQL database at https://neon.tech
#    Copy connection string into DATABASE_URL

# 5. Push database schema
npx prisma db push

# 6. Seed database (creates products + admin user)
npm run db:seed

# 7. Run development server
npm run dev
```

Visit: http://localhost:3000
Admin: http://localhost:3000/admin (username: admin, password: admin1234)

---

## Environment Variables (.env.local)

```env
# Required
DATABASE_URL="postgresql://..."       # Neon free tier: https://neon.tech
NEXTAUTH_URL="http://localhost:3000"  # Change to your domain in prod
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# PayFast (already set for you)
PAYFAST_MERCHANT_ID="27575353"
PAYFAST_MERCHANT_KEY="ovuun5haqvset"
PAYFAST_SANDBOX="true"               # Set to "false" for live payments

# Email (Gmail example)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your.email@gmail.com"
SMTP_PASS="your-app-password"        # Gmail: Settings > Security > App Passwords
SMTP_FROM="A+Market <your@gmail.com>"
ADMIN_EMAIL="Andre.vdheever1010@gmail.com"

# WhatsApp (free via CallMeBot)
# 1. Send WhatsApp message to +34 644 59 78 65 saying: "I allow callmebot to send me messages"
# 2. You'll receive an API key
WHATSAPP_PHONE="+27694274833"
WHATSAPP_API_KEY="your-key-here"

NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

---

## Deploy to Vercel (Free)

1. **Push to GitHub** (this repo)

2. **Go to [vercel.com](https://vercel.com)** → New Project → Import your repo

3. **Add Environment Variables** in Vercel dashboard:
   - All variables from `.env.example`
   - Set `PAYFAST_SANDBOX="false"` for live
   - Set `NEXT_PUBLIC_BASE_URL="https://your-app.vercel.app"`

4. **Set up Neon PostgreSQL** (free):
   - Go to [neon.tech](https://neon.tech)
   - Create project → Copy connection string
   - Add as `DATABASE_URL` in Vercel

5. **Deploy** → Vercel runs `npm run build` which includes `prisma generate`

6. **Run seed** (one-time, after first deploy):
   ```bash
   # In Vercel dashboard → Functions → Run
   # Or via Vercel CLI:
   vercel env pull .env.local
   npx prisma db push
   npm run db:seed
   ```

7. **Set PayFast ITN URL** in PayFast merchant settings:
   ```
   https://your-app.vercel.app/api/payfast/notify
   ```

---

## Admin Access

- URL: `/admin`
- Default login: `admin` / `admin1234`
- **Change password immediately** in Admin → Settings

### Admin Features:
- View all orders with status management
- Toggle products sold out/in stock
- Real-time stats (orders, revenue)
- Automatic WhatsApp + email notifications on status change

---

## WhatsApp Notifications (CallMeBot — Free)

1. Save +34 644 59 78 65 in contacts as "CallMeBot"
2. Send WhatsApp: `I allow callmebot to send me messages`
3. You'll receive your API key in ~2 minutes
4. Add to `.env.local` as `WHATSAPP_API_KEY`

Customers receive WhatsApp when:
- Order marked as **paid** (payment confirmed)
- Order marked as **processing** (being prepared)
- Order marked as **ready** (for pickup/delivery)
- Order marked as **delivered**

---

## PayFast Live vs Sandbox

- **Sandbox** (testing): `PAYFAST_SANDBOX=true`
  - Use test cards from PayFast docs
- **Live** (production): `PAYFAST_SANDBOX=false`
  - Real payments, real money

To test PayFast ITN locally, use ngrok:
```bash
ngrok http 3000
# Set NEXT_PUBLIC_BASE_URL to your ngrok URL
```
