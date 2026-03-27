# Absolute Two Face

AI Face Style Generator - Upload a face photo and generate two different style versions (Anime & Cyberpunk).

## Features

- 📸 Upload face photo (JPG, PNG, WebP)
- 🎨 AI-powered style transformation
- ⚡ Fast generation (10-30 seconds)
- 💳 Stripe payment integration (coming soon)
- 🌐 Deployed on Cloudflare Pages/Workers

## Tech Stack

- **Frontend:** Next.js 14 + Tailwind CSS
- **Backend:** Next.js API Routes
- **AI Service:** Replicate API (InstantID)
- **Payment:** Stripe
- **Deployment:** Cloudflare Pages + Workers

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/songtinglee/absolute-two-face.git
cd absolute-two-face
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API tokens:
- `REPLICATE_API_TOKEN` - Get from [Replicate](https://replicate.com/account/api-tokens)

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Mode

Without a Replicate API token, the app runs in demo mode and returns the original image as a placeholder. This allows you to test the UI without API costs.

## Deployment

### Cloudflare Pages

1. Push code to GitHub
2. Connect repository to Cloudflare Pages
3. Set environment variables in Cloudflare dashboard
4. Deploy!

## API Endpoints

### POST /api/generate

Generate two styled versions of an uploaded face photo.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "styleA": "https://...",
  "styleB": "https://...",
  "demo": false
}
```

## License

MIT

## Author

Built by [songtinglee](https://github.com/songtinglee)
