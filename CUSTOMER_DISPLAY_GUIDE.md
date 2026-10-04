# 📺 Customer Display Mode - GUTech Event Menu

## Overview

The Customer Display Mode is a fullscreen, interactive menu display designed specifically for the GUTech Event menu. It provides a beautiful, engaging way to showcase menu items to customers with large visuals and smooth animations.

---

## 🎯 Features

### 1. **Grid View**
- Large card layout showing all GUTech menu items
- Click any item to expand it to a larger view
- Shows item name, description, and price
- Professional food photography for each item
- Smooth hover and click animations

### 2. **Slideshow View**
- Fullscreen slideshow of menu items
- Auto-play mode (changes every 4 seconds)
- Manual navigation with prev/next buttons
- Progress indicators at the bottom
- Smooth transitions between items

### 3. **Interactive Elements**
- Click to expand items in grid view
- Large, readable text and prices
- High-quality food images
- Responsive design for different screen sizes
- Professional branding with Flames logo

---

## 🚀 How to Use

### Opening Customer Display

1. **From POS Screen:**
   - Look for the purple "Display" button in the top search bar
   - Click the button to open Customer Display Mode
   - The display will open in fullscreen

2. **Navigation:**
   - Use the "Grid" or "Slideshow" tabs to switch views
   - In Grid view: Click any item to expand it
   - In Slideshow view: Use arrows or wait for auto-play

### Grid View Controls

- **Expand Item:** Click any menu item card
  - Item expands to show full details
  - Shows large image, description, and price
  - Click "Close" button or click item again to collapse

- **View All Items:** Scroll through the grid
  - All 7 GUTech items are displayed
  - Each item shows image, name, and price
  - Hover effects for better visibility

### Slideshow View Controls

- **Auto-Play:** 
  - Enabled by default
  - Changes item every 4 seconds
  - Click "Pause" button to stop
  - Click "Play" button to resume

- **Manual Navigation:**
  - Use left/right arrow buttons
  - Click progress indicators at bottom
  - Jump to any specific item

---

## 🎨 Visual Features

### Grid View
```
┌─────────────────────────────────────┐
│  🔥 FLAMES                          │
│     GUTech Event Menu               │
│                                     │
│  [Grid] [Slideshow]  [Pause]  [X]  │
├─────────────────────────────────────┤
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ 🍔   │ │ 🍔   │ │ 🍗   │        │
│  │Image │ │Image │ │Image │        │
│  │      │ │      │ │      │        │
│  │Name  │ │Name  │ │Name  │        │
│  │Price │ │Price │ │Price │        │
│  └──────┘ └──────┘ └──────┘        │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ 🍗   │ │ 🍟   │ │ 🍟   │        │
│  │Image │ │Image │ │Image │        │
│  │Name  │ │Name  │ │Name  │        │
│  │Price │ │Price │ │Price │        │
│  └──────┘ └──────┘ └──────┘        │
│                                     │
│  ┌──────┐                           │
│  │ 🍝   │                           │
│  │Image │                           │
│  │Name  │                           │
│  │Price │                           │
│  └──────┘                           │
│                                     │
├─────────────────────────────────────┤
│  📍 Barka, Oman  📞 92809445       │
│  📷 @flames.om                      │
└─────────────────────────────────────┘
```

### Expanded Item View
```
┌─────────────────────────────────────┐
│  ┌────────────────────────────┐    │
│  │                            │    │
│  │      LARGE IMAGE           │    │
│  │                            │    │
│  │                            │    │
│  ├────────────────────────────┤    │
│  │                            │    │
│  │  Classic Beef Burger       │    │
│  │                            │    │
│  │  Juicy smashed beef patty, │    │
│  │  melted cheese, crispy     │    │
│  │  onion rings, fresh        │    │
│  │  lettuce, and classic      │    │
│  │  sauce.                    │    │
│  │                            │    │
│  │  OMR 2.200      [Close]   │    │
│  │                            │    │
│  └────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Slideshow View
```
┌─────────────────────────────────────┐
│  ┌────────────────────────────┐    │
│  │                            │    │
│  │                            │    │
│  │      FULLSCREEN IMAGE      │    │
│  │                            │    │
│  │                            │    │
│  │                            │    │
│  ├────────────────────────────┤    │
│  │                            │    │
│  │  Classic Beef Burger       │    │
│  │                            │    │
│  │  Juicy smashed beef patty, │    │
│  │  melted cheese, crispy     │    │
│  │  onion rings...            │    │
│  │                            │    │
│  │  OMR 2.200   [←] [→]      │    │
│  │                            │    │
│  └────────────────────────────┘    │
│                                     │
│     ●●●○○○○  (progress dots)       │
└─────────────────────────────────────┘
```

---

## 📋 Menu Items Displayed

All 7 GUTech Event menu items are shown:

1. **Classic Beef Burger** - OMR 2.200
2. **Smash Burger** - OMR 1.900
3. **Snickers Chicken Burger** - OMR 2.200
4. **Crunchy Chicken Burger** - OMR 1.900
5. **Classic Beef Dynamite French Fries** - OMR 2.300
6. **Crispy Chicken Dynamite Fries** - OMR 2.300
7. **Mac & Cheese Pasta** - OMR 2.000

---

## 🎯 Use Cases

### 1. **Customer-Facing Display**
- Place a tablet or monitor facing customers
- Show the menu in slideshow mode
- Auto-play creates an engaging experience
- Customers can see all items rotating

### 2. **Order Assistance**
- Staff can use grid view to help customers choose
- Click items to show full details
- Large images help customers decide
- Clear pricing in OMR

### 3. **Waiting Area Display**
- Show in waiting areas or queue lines
- Keeps customers engaged
- Showcases menu quality
- Builds anticipation

### 4. **Digital Menu Board**
- Replace traditional menu boards
- Easy to update (just change menu items)
- More engaging than static boards
- Professional appearance

---

## ⚙️ Customization Options

### Changing Slideshow Speed
Edit `src/components/CustomerDisplay.tsx`:
```typescript
const interval = setInterval(() => {
  setSlideshowIndex((prev) => (prev + 1) % gutechItems.length);
}, 4000); // Change 4000 to desired milliseconds (e.g., 3000 = 3 seconds)
```

### Changing Grid Layout
Edit the grid columns:
```typescript
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
```
- `grid-cols-2`: 2 columns on mobile
- `md:grid-cols-3`: 3 columns on medium screens
- `lg:grid-cols-4`: 4 columns on large screens

### Changing Colors
Each menu item has its own color gradient defined in `src/data/menu.ts`:
```typescript
color: 'from-red-400 to-red-600'
```

---

## 🔧 Technical Details

### Component Structure
- **CustomerDisplay.tsx**: Main display component
- **State Management**: 
  - `currentView`: 'grid' or 'slideshow'
  - `selectedItem`: Currently expanded item ID
  - `slideshowIndex`: Current slideshow position
  - `isAutoPlay`: Auto-play toggle state

### Animations
- **fade-in**: Smooth opacity transition
- **slide-up**: Items slide up from bottom
- **zoom-in**: Images zoom in smoothly
- **animation-delay**: Staggered animations

### Responsive Design
- Works on tablets, laptops, and desktops
- Grid adapts to screen size
- Images scale appropriately
- Touch-friendly for tablets

---

## 💡 Tips for Best Experience

### For Customer-Facing Display:
1. **Use a tablet or large monitor**
   - Minimum 10" screen recommended
   - Fullscreen mode for best impact
   - Mount at eye level for customers

2. **Enable auto-play slideshow**
   - Keeps display dynamic
   - Shows all items over time
   - Engages waiting customers

3. **Position strategically**
   - Face customers directly
   - Good lighting for visibility
   - Avoid glare on screen

### For Staff Assistance:
1. **Use grid view**
   - See all items at once
   - Quick access to any item
   - Click to show details

2. **Keep device handy**
   - Tablet or phone
   - Easy to show customers
   - Portable and flexible

---

## 🎨 Visual Design

### Color Scheme
- **Background**: Dark gradient (gray-900 to red-950)
- **Accent**: Orange and red (Flames brand colors)
- **Text**: White for readability
- **Cards**: Gradient backgrounds matching item themes

### Typography
- **Headers**: Bold, large text (text-5xl for slideshow)
- **Descriptions**: Medium text (text-xl)
- **Prices**: Extra bold, orange color (text-orange-400)
- **Font**: System fonts for fast loading

### Images
- **Size**: 512x512px (high quality)
- **Style**: Professional food photography
- **Background**: Dark, consistent style
- **Loading**: Smooth transitions

---

## 🚀 Performance

### Optimizations
- Images are pre-loaded
- Smooth 60fps animations
- Efficient state management
- Minimal re-renders

### Browser Support
- Works on all modern browsers
- Chrome, Firefox, Safari, Edge
- Mobile and tablet browsers
- Touch and mouse support

---

## 📱 Device Recommendations

### Best For:
- **iPad / Android Tablets**: Perfect size for customer display
- **Laptop Screens**: Good for staff assistance
- **External Monitors**: Best for dedicated display
- **All-in-One PCs**: Great for counter display

### Minimum Requirements:
- Screen size: 10" or larger
- Resolution: 1280x720 or higher
- Modern browser (Chrome 90+, Safari 14+, etc.)
- Internet connection (for initial load)

---

## 🔒 Security & Privacy

### Data Handling
- No customer data collected
- No personal information stored
- Menu data from localStorage
- Works offline after initial load

### Privacy
- No tracking or analytics
- No external API calls
- No cookies or local storage of user data
- Completely client-side application

---

## 📞 Support

### Troubleshooting

**Display not opening:**
- Check browser console for errors
- Ensure all files are loaded
- Try refreshing the page

**Images not showing:**
- Check internet connection
- Images are hosted externally
- Fallback to emoji if image fails

**Animations not smooth:**
- Check device performance
- Close other browser tabs
- Try a different browser

### Getting Help
- Check browser console (F12) for errors
- Verify all dependencies are installed
- Ensure build completed successfully
- Contact support if issues persist

---

## 🎉 Summary

The Customer Display Mode provides:
- ✅ Beautiful fullscreen menu display
- ✅ Grid view with expandable items
- ✅ Auto-play slideshow mode
- ✅ Professional food photography
- ✅ Smooth animations and transitions
- ✅ Responsive design for all devices
- ✅ Easy to use for staff and customers
- ✅ Perfect for customer-facing displays

**Perfect for:**
- Customer-facing tablets
- Digital menu boards
- Waiting area displays
- Staff assistance tools
- Order guidance

---

**Flames Burgers & More - EPOS System**  
*Customer Display Mode - GUTech Event Menu*  
*Barka, Oman | Tel: 92809445 | @flames.om*
