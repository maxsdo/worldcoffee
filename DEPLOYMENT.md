# Vercel Deployment Guide

## Prerequisites

Before deploying to Vercel, ensure you have:
- A Vercel account (sign up at https://vercel.com)
- A Worldcoin Developer Portal account with your Mini App configured
- Your app registered in the Worldcoin Developer Portal

## Environment Variables

The following environment variables must be configured in your Vercel project settings:

### Required Variables

1. **AUTH_SECRET**
   - Generate using: `npx auth secret`
   - This is used by NextAuth.js to encrypt session tokens
   - In Vercel: Settings → Environment Variables → Add

2. **HMAC_SECRET_KEY**
   - Generate using: `openssl rand -base64 32`
   - Used for HMAC signature validation
   - In Vercel: Settings → Environment Variables → Add

3. **AUTH_URL**
   - Your production URL (e.g., `https://your-app.vercel.app`)
   - This should be the full URL where your app is deployed
   - In Vercel: Settings → Environment Variables → Add

4. **NEXT_PUBLIC_APP_ID**
   - Your App ID from the Worldcoin Developer Portal (e.g., `app_1234567890`)
   - Get this from https://developer.worldcoin.org
   - In Vercel: Settings → Environment Variables → Add
   - Note: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser

### Optional Variables

5. **NEXT_PUBLIC_APP_ENV** (Recommended for Production)
   - Set to `production` to disable Eruda debug console in production
   - Value: `production`
   - In Vercel: Settings → Environment Variables → Add (Production only)
   - Eruda will be disabled automatically when this is set to `production`

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push
   ```

2. **Import Project in Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure Environment Variables**
   - During import, or in Settings → Environment Variables
   - Add all four required variables listed above
   - Make sure to add them for Production, Preview, and Development environments as needed

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Build time: ~2-3 minutes

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add AUTH_SECRET
   vercel env add HMAC_SECRET_KEY
   vercel env add AUTH_URL
   vercel env add NEXT_PUBLIC_APP_ID
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Post-Deployment Configuration

### 1. Update Worldcoin Developer Portal

After deployment, update your Mini App configuration:

1. Go to https://developer.worldcoin.org
2. Navigate to your app settings
3. Update the app URL to your Vercel deployment URL
4. Add your Vercel domain to allowed origins if needed

### 2. Update next.config.ts

If needed, update the `allowedDevOrigins` in `next.config.ts` to include your production domain:

```typescript
const nextConfig: NextConfig = {
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com'],
  },
  allowedDevOrigins: ['https://your-app.vercel.app'],
  reactStrictMode: false,
};
```

### 3. Verify Deployment

Test the following:
- [ ] App loads correctly at your Vercel URL
- [ ] Authentication works via Worldcoin Minikit
- [ ] API routes respond correctly
- [ ] Image optimization works
- [ ] No console errors in browser

## Build Configuration

Vercel automatically detects and uses the following from `package.json`:

- **Build Command**: `npm run build` (or `next build`)
- **Output Directory**: `.next` (automatic for Next.js)
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

These don't need to be changed unless you have a custom setup.

## Framework Preset

Vercel automatically detects Next.js and applies the correct preset. You don't need to manually configure this.

## Production Optimizations

The following are automatically handled by Vercel:

- ✅ Serverless Functions for API routes
- ✅ Edge Caching
- ✅ Image Optimization via Next.js Image component
- ✅ Automatic HTTPS
- ✅ Gzip/Brotli compression
- ✅ HTTP/2 Server Push

## Important Notes

### Eruda (Development Console)

The template includes [Eruda](https://github.com/liriliri/eruda) for debugging. **You should disable this in production**. Check your code and remove or conditionally load Eruda:

```typescript
// Only load in development
if (process.env.NODE_ENV === 'development') {
  import('eruda').then(eruda => eruda.default.init());
}
```

### Security Considerations

- Never commit `.env` files with real secrets to your repository
- Always use Vercel's Environment Variables for sensitive data
- Ensure `AUTH_SECRET` is cryptographically random
- Regularly rotate your secrets
- Review the 4 moderate severity vulnerabilities reported by `npm audit`

### Custom Domain (Optional)

To use a custom domain:
1. Go to your project in Vercel
2. Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed
5. Update `AUTH_URL` environment variable to your custom domain
6. Update Worldcoin Developer Portal with the new domain

## Monitoring

After deployment, monitor your app:
- **Vercel Analytics**: Automatic performance monitoring
- **Logs**: Check deployment logs in Vercel dashboard
- **Function Logs**: View serverless function execution logs
- **Error Tracking**: Consider integrating Sentry or similar

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors
- Check that environment variables are set correctly

### Authentication Issues
- Verify `AUTH_SECRET` is set
- Confirm `AUTH_URL` matches your deployment URL
- Check Worldcoin Developer Portal configuration
- Ensure `NEXT_PUBLIC_APP_ID` is correct

### API Route Errors
- Check function logs in Vercel
- Verify environment variables for API routes
- Ensure proper error handling in route handlers

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Worldcoin Mini Apps Docs**: https://docs.worldcoin.org/mini-apps
- **NextAuth.js Documentation**: https://authjs.dev

## Deployment Checklist

Before going live, verify:

- [ ] All environment variables are set in Vercel
- [ ] `AUTH_URL` points to your production domain
- [ ] Worldcoin Developer Portal is configured with your production URL
- [ ] Eruda is disabled for production
- [ ] Custom domain configured (if applicable)
- [ ] Security audit completed (`npm audit`)
- [ ] All features tested in production environment
- [ ] Error monitoring set up
- [ ] Analytics configured
