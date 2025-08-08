# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: One-Click Deploy (Easiest)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/claudebuildsapps/MermaidRenderer)

### Option 2: Manual Import
1. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub account

2. **Import Project**
   - Click "New Project" or "Add New..."
   - Select "Import Git Repository" 
   - Search for `MermaidRenderer` or paste: `https://github.com/claudebuildsapps/MermaidRenderer`

3. **Configure Project**
   - Project Name: `mermaid-renderer` (or your choice)
   - Framework Preset: **Create React App** (auto-detected)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `build` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build completion
   - Your app will be live at `https://mermaid-renderer-[username].vercel.app`

## 🔧 Configuration Details

The repository includes optimal Vercel configuration:

### `vercel.json`
```json
{
  "name": "mermaid-renderer",
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": { "cache-control": "s-maxage=31536000,immutable" },
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### `package.json` 
- ✅ Proper build scripts configured
- ✅ Homepage set to relative paths
- ✅ All dependencies included

## 🌐 Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Common Domains**
   - `mermaid.yourdomain.com`
   - `diagrams.yourdomain.com` 
   - `renderer.yourdomain.com`

## 🚦 Environment Variables (None Required)

This project runs entirely client-side and requires no environment variables or API keys.

## 🔄 Auto-Deployment

Once connected, Vercel automatically deploys on:
- ✅ Push to `main` branch
- ✅ Pull request previews
- ✅ Branch deployments

## 📊 Performance Optimizations

The deployment includes:
- ✅ Static asset caching (1 year)
- ✅ Gzip compression
- ✅ CDN distribution
- ✅ Automatic HTTPS
- ✅ SPA routing support

## 🐛 Troubleshooting

### Build Fails
```bash
# Test build locally first
npm install
npm run build

# Check for errors in output
```

### Routes Don't Work
- Ensure `vercel.json` is properly configured
- SPA routing is handled by catch-all route to `/index.html`

### Static Assets 404
- Verify `package.json` has `"homepage": "."`
- Check build output in `build/` directory

## 📈 Analytics & Monitoring

Enable in Vercel dashboard:
- **Analytics**: Track page views and performance
- **Speed Insights**: Core Web Vitals monitoring
- **Functions**: Monitor any API routes (none in this project)

## 🎯 Expected Build Output

```
✅ Creating optimized production build...
✅ Compiled successfully.
✅ Build completed in ~45-60 seconds
✅ File sizes after gzip:
   - Main bundle: ~150kb (includes Mermaid.js)
   - CSS: ~5kb
   - HTML: ~2kb

🌐 Live URL: https://your-app.vercel.app
```

## 🔗 Post-Deployment

After successful deployment:
1. ✅ Test all example diagrams work
2. ✅ Verify SVG export functionality  
3. ✅ Check file upload/download features
4. ✅ Test zoom controls
5. ✅ Update README with live demo URL

---

**Deployment Time**: ~2-3 minutes
**Build Time**: ~45-60 seconds  
**Bundle Size**: ~150kb gzipped