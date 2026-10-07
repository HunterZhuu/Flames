# 🎉 Events Feature Guide - Flames EPOS

## Overview

The Events feature allows you to create special package deals for parties, corporate events, weddings, birthdays, and family gatherings. You can bundle multiple items together at a special price and upload custom images for each package.

---

## 📍 Where to Find Events

### Admin Panel
1. Login with admin PIN (default: 1234)
2. Click **Admin** in the top navigation
3. Select the **Events** tab (🎉 icon)

### POS Screen
1. After creating event packages, they appear as a new **🎉 Events** tab in the POS
2. Staff can sell event packages just like regular menu items

---

## 🎯 Event Categories

The system comes with 5 pre-defined event categories:

| Category | Emoji | Use Case |
|----------|-------|----------|
| **Party Packages** | 🎉 | Birthday parties, celebrations |
| **Family Deals** | 👨‍👩‍👧‍👦 | Family gatherings, weekend meals |
| **Corporate Events** | 💼 | Business meetings, office parties |
| **Wedding Catering** | 💍 | Wedding receptions, engagements |
| **Birthday Specials** | 🎂 | Birthday celebrations |

You can create custom categories by editing the code or contact support for customization.

---

## 📸 How to Upload Pictures

### Step 1: Go to Events Management
1. Login as admin
2. Navigate to **Admin → Events**
3. Click **"Add Event Package"** button

### Step 2: Fill in Package Details
- **Package Name** (required): e.g., "Party Bundle for 10 People"
- **Description**: Brief description of the package
- **Price** (required): Total price in OMR (e.g., 15.000)
- **Category**: Select from dropdown
- **Includes**: List items included (comma-separated)
  - Example: `10 Burgers, 5 Fries, 10 Drinks, 2 Pasta`

### Step 3: Upload Image
1. Scroll to **"Package Image"** section
2. Click **"Upload Image"** button
3. Select image from your computer
4. Image is automatically compressed (max 5MB, resized to 600px)
5. Preview appears below the upload button

### Step 4: Save
- Click **"Add Package"** to save
- Package appears in the Events list
- Available in POS immediately

---

## 🖼️ Image Requirements

### Recommended Specifications
- **Format**: JPG, PNG, or WebP
- **Size**: Max 5MB (auto-compressed)
- **Dimensions**: 600x600px or larger (auto-resized)
- **Aspect Ratio**: Square (1:1) works best
- **Quality**: High resolution for best display

### Tips for Best Results
✅ Use professional food photography  
✅ Good lighting (natural or studio)  
✅ Clean background (white or branded)  
✅ Show the full package contents  
✅ High contrast for visibility  

### What Happens During Upload
1. System checks file size (max 5MB)
2. Image is compressed to 80% quality
3. Resized to 600px width (maintains aspect ratio)
4. Converted to base64 for storage
5. Stored in browser localStorage

---

## 🎨 Creating Event Packages

### Example 1: Party Package
```
Name: Party Bundle for 10
Price: 15.000 OMR
Category: Party Packages
Includes: 10 Signature Burgers, 5 Large Fries, 10 Drinks, 2 Appetizers
Image: [Upload group photo of burgers and fries]
```

### Example 2: Family Deal
```
Name: Family Feast (4 People)
Price: 12.500 OMR
Category: Family Deals
Includes: 4 Burgers, 2 Fries, 4 Drinks, 1 Salad
Image: [Upload family meal photo]
```

### Example 3: Corporate Event
```
Name: Corporate Lunch Box (20 People)
Price: 35.000 OMR
Category: Corporate Events
Includes: 20 Mini Sliders, 10 Fries, 20 Drinks, 5 Pasta Boxes
Image: [Upload corporate catering photo]
```

---

## 📱 How Events Appear in POS

### Events Tab
- Appears as **🎉 Events** tab in category list
- Only shows if you have at least 1 available event package
- Purple theme (different from regular menu)

### Event Card Display
Each event package shows:
- **Large image** (if uploaded) or purple gradient with 🎉 emoji
- **Package name** (bold)
- **Description** (if provided)
- **Includes list** (first 3 items + "+X more")
- **Price** (OMR, purple color)
- **Cart badge** (shows quantity when added)

### Selling Events
1. Click **🎉 Events** tab
2. Browse available packages
3. Click on package to add to cart
4. Package appears in cart like regular items
5. Complete order as normal

---

## 🔧 Managing Events

### Edit Event Package
1. Go to **Admin → Events**
2. Find the event in the list
3. Click **Edit** button (blue pencil icon)
4. Modify details or upload new image
5. Click **"Update Package"**

### Toggle Availability
- Click **"Available"** button (green) to hide
- Click **"Hidden"** button (red) to show
- Hidden events don't appear in POS

### Delete Event Package
1. Find the event in the list
2. Click **Delete** button (red trash icon)
3. Confirm deletion
4. Event is permanently removed

---

## 💡 Best Practices

### Pricing Strategy
- Calculate individual item costs
- Add 10-20% discount for bundle
- Make it attractive but profitable
- Example: 10 burgers (20 OMR) + 5 fries (5 OMR) = 25 OMR → Sell for 22 OMR

### Image Selection
- Use real photos of your food
- Show all items in the package
- Use consistent style across all events
- Update seasonally for freshness

### Package Naming
- Be descriptive and clear
- Include quantity (e.g., "for 10 people")
- Use appealing words (Feast, Bundle, Deal)
- Keep it short but informative

### Includes List
- List all major items
- Use clear names (match menu items)
- Keep it concise (3-5 items visible)
- Mention quantity for each item

---

## 🎯 Use Cases

### Birthday Parties
- Create age-specific packages (Kids, Teens, Adults)
- Include birthday cake option
- Add decoration service as extra
- Offer party favors add-on

### Corporate Events
- Create tiered packages (Small, Medium, Large)
- Include vegetarian options
- Offer delivery setup service
- Add branded packaging option

### Wedding Catering
- Create engagement vs wedding packages
- Include premium items
- Offer tasting session add-on
- Provide setup and service staff

### Family Gatherings
- Create weekend special deals
- Include variety for different tastes
- Offer kids menu option
- Add dessert package

---

## 🔍 Troubleshooting

### Image Not Uploading
**Problem**: Upload fails or shows error  
**Solution**: 
- Check file size (max 5MB)
- Try different format (JPG/PNG)
- Clear browser cache
- Try different browser

### Events Tab Not Showing in POS
**Problem**: No Events tab visible  
**Solution**:
- Make sure you have at least 1 event package
- Check that event is set to "Available"
- Refresh the POS page
- Clear browser cache

### Package Not Appearing in Cart
**Problem**: Click but nothing happens  
**Solution**:
- Check browser console for errors
- Verify event is available
- Try different browser
- Contact support

---

## 📊 Event Analytics

Track event performance in **Admin → Orders**:
- Filter by event packages
- See which packages sell most
- Track revenue from events
- Identify popular categories

---

## 🚀 Advanced Features

### Custom Event Categories
Want to add custom categories? Edit `src/data/menu.ts`:
```typescript
export const eventCategories: EventCategory[] = [
  { id: 'party', name: 'Party Packages', emoji: '🎉' },
  { id: 'family', name: 'Family Deals', emoji: '👨‍👩‍👧‍👦' },
  { id: 'corporate', name: 'Corporate Events', emoji: '💼' },
  { id: 'wedding', name: 'Wedding Catering', emoji: '💍' },
  { id: 'birthday', name: 'Birthday Specials', emoji: '🎂' },
  // Add your custom categories here:
  { id: 'ramadan', name: 'Ramadan Specials', emoji: '🌙' },
  { id: 'national', name: 'National Day Deals', emoji: '🇴🇲' },
];
```

### Bulk Image Upload
For multiple events, prepare images in advance:
- Name files clearly (e.g., "party-10.jpg", "family-4.jpg")
- Use consistent dimensions
- Compress before upload
- Upload one by one in Events panel

---

## 📞 Support

### Need Help?
- Check this guide first
- Review troubleshooting section
- Contact support team
- Request feature customization

### Feature Requests
Want additional event features?
- Seasonal events with auto-expiry
- Event scheduling calendar
- Customer event history
- Event-specific discounts
- Bulk order management

---

## 🎉 Summary

The Events feature lets you:
✅ Create special package deals  
✅ Upload custom images  
✅ Set custom prices  
✅ Organize by category  
✅ Sell through POS  
✅ Track performance  
✅ Manage availability  

**Start creating your first event package today!**

---

**Flames Burgers & More - EPOS System**  
*Events Feature v1.0*  
*Barka, Oman | Tel: 92809445*
