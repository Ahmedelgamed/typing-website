# Google AdSense Domain Migration Guide

## 🎯 Current Situation:
- AdSense approved for: `ahmedelgamed.netlify.app` 
- New primary domain: `speedwpm.com`
- Need to migrate AdSense properly

## ✅ Step-by-Step Migration Process:

### Step 1: Add New Site in AdSense
1. Go to [Google AdSense Dashboard](https://www.google.com/adsense/)
2. Click **"Sites"** in left sidebar
3. Click **"Add site"** 
4. Enter: `speedwpm.com`
5. Wait for review/approval (usually 24-48 hours)

### Step 2: Update Site Settings
1. In AdSense dashboard, go to **"Sites"**
2. Find `speedwpm.com` 
3. Click **"Ready to show ads"** when approved
4. Copy your AdSense code for the new domain

### Step 3: Verify Domain Ownership
Google may ask you to verify ownership of speedwpm.com:
- Add DNS TXT record (if using domain registrar)
- Or upload HTML verification file to your site
- Or add meta tag to your HTML head

### Step 4: Remove Old Site (After Migration)
1. Wait 30 days after new site is active
2. In AdSense dashboard, go to **"Sites"**
3. Find `ahmedelgamed.netlify.app`
4. Click **"Remove site"** 

## 🚨 Important Notes:

### Don't Remove Old Site Immediately!
- Keep both sites active in AdSense for 30 days
- This ensures no revenue loss during transition
- Google needs time to update their systems

### Monitor Performance:
- Check AdSense earnings daily during migration
- Ensure ads are showing on speedwpm.com
- Verify click tracking is working

### AdSense Code Updates:
Your current AdSense code should work on both domains, but you may need to update:

```html
<!-- Current code (works on both domains) -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-ID"></script>

<!-- Ad unit code -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-YOUR-ID"
     data-ad-slot="YOUR-SLOT-ID"
     data-ad-format="auto"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

## 📊 Migration Timeline:

### Day 1-2: Setup
- ✅ Create _redirects file (Done!)
- ✅ Add speedwpm.com to AdSense
- ✅ Set up domain redirects

### Day 2-7: Review Period  
- ⏳ Wait for AdSense approval on new domain
- ⏳ Monitor traffic migration
- ⏳ Test ads on speedwpm.com

### Week 2-4: Stabilization
- ✅ Verify ads working on new domain
- ✅ Monitor revenue (shouldn't drop)
- ✅ Update all marketing materials

### Day 30+: Cleanup
- ✅ Remove old Netlify site from AdSense
- ✅ Update any remaining external links
- ✅ Celebrate successful migration! 🎉

## 🔧 Technical Checklist:

### Domain Configuration:
- [ ] DNS pointing to correct hosting
- [ ] SSL certificate active on speedwpm.com
- [ ] 301 redirects from netlify.app → speedwpm.com
- [ ] Sitemap updated with new domain
- [ ] Google Search Console updated

### AdSense Configuration:
- [ ] New site added to AdSense
- [ ] Domain verification completed
- [ ] Ad codes updated (if needed)
- [ ] Revenue tracking verified
- [ ] Old site removal scheduled

### SEO Updates:
- [ ] Google Search Console: Add speedwpm.com property  
- [ ] Submit updated sitemap
- [ ] Request reindexing of main pages
- [ ] Update social media profiles
- [ ] Update any external backlinks

## 💰 Revenue Protection:

### Expected Impact:
- **Week 1:** Possible 10-20% revenue dip (normal during migration)
- **Week 2-3:** Revenue should return to normal
- **Week 4+:** Potential increase due to better domain authority

### Warning Signs:
- Ads not showing on speedwpm.com after 48 hours
- Revenue drops more than 50%
- AdSense policy violations
- Redirect loops or broken links

## 🆘 Emergency Rollback Plan:
If something goes wrong:
1. Remove redirects temporarily
2. Keep old site active
3. Contact AdSense support
4. Gradually re-implement migration

## 📞 Support Resources:
- **AdSense Help:** https://support.google.com/adsense/
- **Domain Migration Guide:** https://support.google.com/adsense/answer/6023158
- **Netlify Redirects:** https://docs.netlify.com/routing/redirects/