# 🖨️ Web Print Setup Guide - Flames EPOS

## ✅ Print Functionality Enhanced

The web print feature has been improved to provide reliable printing directly from the browser to your physical printer.

---

## 🎯 What's New

### **Enhanced Print Features**
- ✅ **Reliable Print Dialog** - Opens browser's native print dialog
- ✅ **Test Print Button** - Verify printer setup before use
- ✅ **Better Error Handling** - Clear feedback when print fails
- ✅ **Popup Detection** - Alerts when popups are blocked
- ✅ **Success Notifications** - Toast messages confirm print status
- ✅ **Auto-Print Feedback** - Visual confirmation when auto-printing

---

## 🚀 How to Use Web Print

### **Method 1: Manual Print (After Order)**

1. **Complete an order** in the POS screen
2. **Receipt modal appears** automatically
3. **Click print button**:
   - 📄 "Customer Receipt" - Prints customer copy
   - 🍴 "Kitchen Copy" - Prints kitchen ticket
   - 📧 "Email Receipt" - Queues for email
   - 🖨️ "Print Both" - Prints both receipts

4. **Browser print dialog opens**
   - Select your printer
   - Adjust settings if needed
   - Click "Print"

5. **Success notification appears**
   - ✅ "Customer receipt sent to printer!"
   - Or ❌ "Print failed. Please allow popups..."

---

### **Method 2: Auto-Print (Automatic)**

1. **Enable auto-print** in Admin → Settings → Printer Settings
   - Toggle "Auto-Print Customer Receipt" ON
   - Set print delay (default: 1.5 seconds)
   - Optionally enable "Auto-Print Kitchen Ticket"

2. **Complete an order**
   - Receipt modal appears
   - After delay, print dialog opens automatically
   - Toast notification: "Auto-printing customer receipt..."

3. **Printer prints automatically**
   - No manual intervention needed
   - Fast and efficient workflow

---

### **Method 3: Test Print (Verify Setup)**

1. **Go to Admin → Settings**
2. **Scroll to "Printer Settings"**
3. **Click "Test Print" button** (green button)
4. **Browser print dialog opens**
   - Select your printer
   - Click "Print"
5. **Verify test receipt prints correctly**
   - ✅ "Test print sent! Check your printer."

---

## ⚙️ Printer Configuration

### **Browser Settings (Required)**

#### **1. Allow Popups**
The print function opens a new window. You must allow popups:

**Chrome:**
1. Click the popup blocker icon in address bar (when it appears)
2. Select "Always allow popups from this site"
3. Refresh the page

**Firefox:**
1. Click the popup blocker icon in address bar
2. Select "Allow popups for this site"
3. Refresh the page

**Safari:**
1. Safari → Preferences → Websites → Pop-up Windows
2. Set to "Allow" for the EPOS site

**Edge:**
1. Click the popup blocker icon in address bar
2. Select "Always allow popups from this site"

#### **2. Set Default Printer (Optional)**
To avoid selecting printer each time:

**Windows:**
1. Settings → Devices → Printers & scanners
2. Select your thermal printer
3. Click "Manage" → "Set as default printer"

**Mac:**
1. System Preferences → Printers & Scanners
2. Select your thermal printer
3. Click "Default printer" → Select your printer

**Chrome Browser:**
1. Print dialog → Destination → "Change..."
2. Select your printer
3. Check "Remember this setting"

---

## 🖨️ Recommended Printers

### **Thermal Receipt Printers (80mm)**
- **Epson TM-T88V** - Industry standard
- **Star TSP143** - Reliable and fast
- **Bixolon SRP-350** - Good value
- **POS-58 USB** - Budget option

### **Settings for Thermal Printers**
- **Paper size**: 80mm (3 inches)
- **Print quality**: Standard
- **Orientation**: Portrait
- **Margins**: Minimal (5mm)
- **Color**: Black only (for thermal)

---

## 📋 Print Options Explained

### **Customer Receipt**
- Full receipt with all details
- Items, prices, totals
- Payment information
- Change calculation (for cash)
- Branch info and branding
- Instagram link (@flames.om)

### **Kitchen Copy**
- Simplified format
- No prices (kitchen doesn't need them)
- Item names and quantities
- Order type and table number
- Easy to read for kitchen staff

### **Email Receipt**
- Queued for email delivery
- Sent when internet is available
- Professional HTML format
- Includes all receipt details
- Works offline (queued)

### **Print Both**
- Prints customer receipt first
- Then prints kitchen ticket (500ms delay)
- Saves time by printing both at once
- Best for busy periods

---

## 🔧 Troubleshooting

### **Issue: Print dialog doesn't open**

**Solution 1: Allow Popups**
- Check browser address bar for popup blocker icon
- Click it and allow popups for this site
- Refresh the page and try again

**Solution 2: Check Browser Console**
- Press F12 to open DevTools
- Go to "Console" tab
- Look for error messages
- Common error: "Blocked popup window"

**Solution 3: Try Different Browser**
- Chrome (recommended)
- Firefox
- Edge
- Safari

---

### **Issue: Print sends but nothing prints**

**Solution 1: Check Printer Connection**
- Verify printer is turned on
- Check paper is loaded
- Ensure printer is connected (USB/WiFi)
- Print a test page from printer properties

**Solution 2: Select Correct Printer**
- In print dialog, check "Destination"
- Select your thermal printer
- Don't select "Save as PDF"

**Solution 3: Check Printer Queue**
- Windows: Settings → Devices → Printers → Open queue
- Mac: System Preferences → Printers → Open Print Queue
- Clear any stuck jobs
- Restart printer if needed

---

### **Issue: Receipt prints but formatting is wrong**

**Solution 1: Check Paper Size**
- Print dialog → "More settings"
- Set paper size to 80mm (or 3 inches)
- Try printing again

**Solution 2: Adjust Margins**
- Print dialog → "More settings"
- Set margins to "Minimum" or "None"
- Thermal printers need minimal margins

**Solution 3: Update Printer Driver**
- Download latest driver from manufacturer
- Install and restart computer
- Try printing again

---

### **Issue: Auto-print not working**

**Solution 1: Check Settings**
- Admin → Settings → Printer Settings
- Ensure "Auto-Print Customer Receipt" is ON
- Check print delay is set (not 0)

**Solution 2: Check Browser Permissions**
- Allow popups for this site
- Some browsers block auto-print
- Try manual print first to verify

**Solution 3: Clear Browser Cache**
- Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
- Clear cached images and files
- Refresh the page

---

## 💡 Best Practices

### **For Fast Service**
1. **Enable auto-print** with 1-2 second delay
2. **Set default printer** in browser
3. **Use "Print Both"** for efficiency
4. **Keep printer stocked** with paper

### **For Accuracy**
1. **Test print daily** to verify setup
2. **Check print quality** regularly
3. **Monitor paper levels**
4. **Clear print queue** if jobs get stuck

### **For Reliability**
1. **Use thermal printer** (faster, no ink)
2. **Keep printer drivers updated**
3. **Allow popups** in browser
4. **Test before busy periods**

---

## 🎯 Print Workflow Examples

### **Scenario 1: Fast Food Service**
```
1. Customer orders
2. Staff processes payment
3. Auto-print triggers (1.5s delay)
4. Customer receipt prints
5. Kitchen ticket prints (0.5s later)
6. Hand receipt to customer
7. Kitchen starts preparing
```
**Time saved**: 3-5 seconds per order

### **Scenario 2: Dine-in Service**
```
1. Customer orders at table
2. Staff processes payment
3. Manual print: "Print Both"
4. Customer receipt prints
5. Kitchen ticket prints
6. Give receipt to customer
7. Send ticket to kitchen
```
**Benefit**: Both copies ready instantly

### **Scenario 3: Takeaway Service**
```
1. Customer orders
2. Staff processes payment
3. Auto-print enabled
4. Receipt prints automatically
5. Hand receipt to customer
6. Customer leaves
```
**Benefit**: Fast, no extra clicks

---

## 📊 Print Statistics

### **Print Speed**
- **Thermal printer**: 2-3 seconds per receipt
- **Inkjet printer**: 5-10 seconds per receipt
- **Laser printer**: 3-5 seconds per receipt

### **Paper Usage**
- **Customer receipt**: ~15cm (6 inches)
- **Kitchen ticket**: ~10cm (4 inches)
- **Both together**: ~25cm (10 inches)

### **Daily Usage (100 orders)**
- **Customer receipts**: 15 meters (50 feet)
- **Kitchen tickets**: 10 meters (33 feet)
- **Total**: 25 meters (82 feet)

---

## 🔒 Security & Privacy

### **Print Data**
- ✅ Receipts contain only order information
- ✅ No sensitive customer data
- ✅ No credit card numbers
- ✅ No personal information

### **Browser Security**
- ✅ Print dialog is browser-controlled
- ✅ No data sent to external servers
- ✅ Local printing only
- ✅ Secure print queue

---

## 📞 Support

### **Common Questions**

**Q: Can I use any printer?**
A: Yes, but thermal receipt printers (80mm) are recommended for best results.

**Q: Do I need to install printer software?**
A: No, the browser uses your system's default printer drivers.

**Q: Can I print wirelessly?**
A: Yes, if your printer supports WiFi/Bluetooth and is set up in your system.

**Q: What if I don't have a printer?**
A: You can use "Save as PDF" in the print dialog, or use email receipts instead.

**Q: Can I customize the receipt format?**
A: Yes, contact support to modify the receipt template.

---

## 🎉 Summary

The web print feature provides:
- ✅ **Reliable printing** from browser to physical printer
- ✅ **Test print button** to verify setup
- ✅ **Auto-print option** for fast workflow
- ✅ **Manual print options** for flexibility
- ✅ **Clear feedback** with toast notifications
- ✅ **Error handling** with helpful messages
- ✅ **Popup detection** with user guidance

**Perfect for:**
- Fast food service
- Dine-in restaurants
- Takeaway orders
- High-volume periods
- Professional receipt printing

---

**Flames Burgers & More - EPOS System**  
*Web Print Setup Guide*  
*Barka, Oman | Tel: 92809445 | @flames.om*
