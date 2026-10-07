# 🚀 Flames EPOS - Deployment Guide

## Quick Start (2 Minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Flames EPOS - Initial deployment"
git remote add origin https://github.com/YOUR_USERNAME/flames-epos.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Visit https://vercel.com
2. Sign up with GitHub
3. Click "New Project" → Import your repo
4. Click "Deploy"
5. ✅ Live in 60 seconds!

### 3. Share with Customers
- Your app is live at: `https://flames-epos.vercel.app`
- Share this link with customers to try

---

## Custom Domain (flames.om)

### Step 1: Add Domain in Vercel
1. Go to Project Settings → Domains
2. Enter: `flames.om`
3. Vercel shows DNS records to add

### Step 2: Update DNS
At your domain registrar, add:

```
Type: A     | Name: @    | Value: 76.76.21.21
Type: CNAME | Name: www  | Value: cname.vercel-dns.com
```

### Step 3: Wait 15-30 minutes
- SSL certificate auto-provisions
- https://flames.om goes live!

---

## Testing Options

### For Customer Demo
- Share Vercel URL: `flames-epos.vercel.app`
- Works on phones, tablets, computers
- No installation needed

### For In-Store Use
```bash
npm run dev -- --host 0.0.0.0
```
Access from any device on same WiFi

### For Temporary Public Access
```bash
npm install -g ngrok
npm run dev
ngrok http 5173
```
Get temporary public URL

---

## Auto-Deploy on Changes

Every time you push to GitHub:
1. Vercel auto-builds
2. Creates preview URL
3. Deploys to production

No manual deployment needed!

---

## Environment Setup

### For Production
No environment variables needed - everything is client-side!

### Data Storage
- All data stored in browser localStorage
- Works offline
- Persists between sessions

---

## Mobile-Friendly

The app is fully responsive:
- ✅ Works on phones
- ✅ Works on tablets
- ✅ Works on desktops
- ✅ Touch-optimized for POS tablets

---

## Security

- ✅ HTTPS by default (Vercel)
- ✅ PIN-based authentication
- ✅ Role-based access control
- ✅ No sensitive data on server

---

## Support

### Vercel Documentation
https://vercel.com/docs

### Custom Domain Help
https://vercel.com/docs/concepts/projects/domains

### Need Help?
Contact: support@vercel.com

---

## Checklist

Before going live:
- [ ] Test all features locally
- [ ] Verify menu items and prices
- [ ] Test payment flow
- [ ] Test receipt printing
- [ ] Test on mobile device
- [ ] Set up staff accounts
- [ ] Configure email settings (optional)

---

**Flames Burgers & More**
*Point of Sale System*
*Barka, Oman | Tel: 92809445*
