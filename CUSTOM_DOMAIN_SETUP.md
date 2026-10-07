# 🌐 Custom Domain Setup Guide - flames.om

## ⚠️ Important Note

The URL `https://3e61e9f8-f49a-4ba1-8ce0-93af6dfff29b.preview.qwenlm.io/` is a **deployment preview URL** from your hosting platform. This cannot be changed through code modifications in the EPOS application.

To use `https://flames.om`, you need to configure your **hosting platform** and **DNS settings**.

---

## 🎯 What You Need

### Prerequisites:
1. ✅ Domain name `flames.om` registered and owned by you
2. ✅ Access to DNS management for flames.om
3. ✅ Hosting platform account (Vercel, Netlify, Cloudflare Pages, etc.)
4. ✅ The EPOS application code (already built)

---

## 🚀 Step-by-Step Setup

### Option 1: Vercel (Recommended)

#### Step 1: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy your app
vercel

# Follow the prompts to deploy
```

#### Step 2: Add Custom Domain
1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter: `flames.om`
6. Click **Add**

#### Step 3: Configure DNS
Vercel will show you DNS records to add. Typically:

**For Root Domain (flames.om):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW (www.flames.om):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### Step 4: Wait for DNS Propagation
- DNS changes can take 5 minutes to 48 hours
- Usually completes within 15-30 minutes
- Vercel will automatically provision SSL certificate

---

### Option 2: Netlify

#### Step 1: Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy your app
netlify deploy --prod
```

#### Step 2: Add Custom Domain
1. Go to [netlify.com](https://netlify.com)
2. Select your site
3. Go to **Domain settings**
4. Click **Add custom domain**
5. Enter: `flames.om`
6. Follow the DNS configuration instructions

#### Step 3: Configure DNS
Netlify will provide DNS records. Typically:

**For Root Domain:**
```
Type: A
Name: @
Value: 75.2.60.5
```

**For WWW:**
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

---

### Option 3: Cloudflare Pages

#### Step 1: Deploy to Cloudflare Pages
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Create new project
3. Connect your Git repository
4. Deploy the app

#### Step 2: Add Custom Domain
1. Go to your project
2. Click **Custom domains**
3. Click **Set up a custom domain**
4. Enter: `flames.om`
5. Follow DNS instructions

#### Step 3: Configure DNS in Cloudflare
If using Cloudflare for DNS:
1. Go to Cloudflare dashboard
2. Select flames.om domain
3. Go to **DNS** → **Records**
4. Add the records provided by Cloudflare Pages

---

## 🔧 DNS Configuration Guide

### Where to Configure DNS

Depending on where you registered `flames.om`:

- **GoDaddy**: Domain Management → DNS Management
- **Namecheap**: Domain List → Advanced DNS
- **Cloudflare**: DNS → Records
- **Google Domains**: DNS → Custom Records
- **Oman Telecommunications**: Contact your registrar

### Common DNS Records

**A Record (Root Domain):**
```
Type: A
Name: @ (or leave blank)
Value: [Provided by hosting platform]
TTL: Auto or 3600
```

**CNAME Record (WWW):**
```
Type: CNAME
Name: www
Value: [Provided by hosting platform]
TTL: Auto or 3600
```

---

## 🔒 SSL Certificate

### Automatic SSL (Recommended)
Most modern hosting platforms provide **free automatic SSL**:
- ✅ Vercel: Automatic Let's Encrypt
- ✅ Netlify: Automatic Let's Encrypt
- ✅ Cloudflare: Automatic SSL

### Manual SSL (If Needed)
If your platform doesn't provide automatic SSL:

1. **Get SSL Certificate:**
   - Use Let's Encrypt (free)
   - Or purchase from SSL provider

2. **Install Certificate:**
   - Follow your hosting platform's instructions
   - Upload certificate files
   - Configure HTTPS redirect

---

## ✅ Verification Steps

### Step 1: Check DNS Propagation
Use these tools to verify DNS:
- [dnschecker.org](https://dnschecker.org)
- [whatsmydns.net](https://whatsmydns.net)

Enter: `flames.om`
Should show your hosting platform's IP addresses

### Step 2: Test the Domain
```bash
# Test if domain resolves
ping flames.om

# Test HTTPS
curl -I https://flames.om
```

### Step 3: Access Your App
Open browser and go to:
- `https://flames.om` ✅
- `https://www.flames.om` ✅ (if configured)

---

## 🔄 Redirect Configuration

### Redirect WWW to Non-WWW (Recommended)

**In Vercel:**
Create `vercel.json`:
```json
{
  "redirects": [
    {
      "source": "/(.*)",
      "has": [
        {
          "type": "host",
          "value": "www.flames.om"
        }
      ],
      "destination": "https://flames.om/$1"
    }
  ]
}
```

**In Netlify:**
Create `_redirects` file:
```
https://www.flames.om/* https://flames.om/:splat 301
```

---

## 📱 Update App Configuration

After setting up the custom domain, you may want to update:

### 1. Email Receipts
The app already uses `@flames.om` for Instagram. No changes needed.

### 2. Branch Information
Update in Admin Panel → Settings:
- Branch Name: FLAMES BURGERS & MORE
- Website: https://flames.om
- Instagram: @flames.om

### 3. SEO Meta Tags (Optional)
Update `index.html`:
```html
<meta property="og:url" content="https://flames.om" />
<meta property="og:title" content="Flames Burgers & More - EPOS System" />
<meta property="og:description" content="Point of Sale System for Flames Burgers & More" />
```

---

## 🎯 Quick Checklist

Before you start:
- [ ] Domain `flames.om` is registered
- [ ] You have DNS access
- [ ] Hosting platform account is ready
- [ ] App is built and ready to deploy

Deployment steps:
- [ ] Deploy app to hosting platform
- [ ] Add custom domain in hosting settings
- [ ] Configure DNS records
- [ ] Wait for DNS propagation (15-30 min)
- [ ] Verify SSL certificate is active
- [ ] Test https://flames.om
- [ ] Set up WWW redirect (optional)

Post-deployment:
- [ ] Update branch information in app
- [ ] Test all features work on custom domain
- [ ] Share new URL with team

---

## 🆘 Troubleshooting

### Issue: Domain not resolving
**Solution:**
- Wait 24-48 hours for DNS propagation
- Check DNS records are correct
- Clear browser cache
- Try incognito/private mode

### Issue: SSL certificate error
**Solution:**
- Wait for automatic SSL provisioning (can take 15-30 min)
- Check DNS records point to correct IP
- Contact hosting platform support

### Issue: Site shows old preview URL
**Solution:**
- Clear browser cache and cookies
- Hard refresh (Ctrl+F5 or Cmd+Shift+R)
- Check you're accessing https://flames.om
- Verify DNS is pointing to hosting platform

### Issue: WWW version not working
**Solution:**
- Add CNAME record for www
- Configure redirect in hosting platform
- Test both versions

---

## 📞 Support Resources

### Hosting Platform Support:
- **Vercel**: https://vercel.com/support
- **Netlify**: https://netlify.com/support
- **Cloudflare**: https://support.cloudflare.com

### DNS Help:
- **DNS Checker**: https://dnschecker.org
- **What's My DNS**: https://whatsmydns.net

### Domain Registration:
Contact your domain registrar for DNS access:
- GoDaddy, Namecheap, Cloudflare, etc.

---

## 💡 Pro Tips

### Use Cloudflare (Recommended)
For best performance and security:
1. Transfer DNS to Cloudflare (free)
2. Enable Cloudflare proxy (orange cloud)
3. Get free SSL and DDoS protection
4. Faster global CDN

### Enable HTTP/2
Most platforms enable this automatically. Verify with:
```bash
curl -I https://flames.om
# Should show: HTTP/2 200
```

### Set Up Monitoring
- Use UptimeRobot (free) to monitor site availability
- Set up alerts for downtime
- Track performance metrics

---

## 🎉 Success Indicators

Your setup is complete when:
- ✅ `https://flames.om` loads your EPOS app
- ✅ SSL certificate is valid (green lock icon)
- ✅ All features work correctly
- ✅ Page loads quickly
- ✅ Mobile responsive

---

## 📝 Summary

**Current Preview URL:**
```
https://3e61e9f8-f49a-4ba1-8ce0-93af6dfff29b.preview.qwenlm.io/
```

**Target Custom Domain:**
```
https://flames.om
```

**Action Required:**
Configure hosting platform and DNS settings (not code changes)

**Estimated Time:**
- Deployment: 5-10 minutes
- DNS propagation: 15-30 minutes (up to 48 hours)
- Total: ~30-60 minutes

---

**Flames Burgers & More - EPOS System**  
*Custom Domain: https://flames.om*  
*Barka, Oman | Tel: 92809445*
