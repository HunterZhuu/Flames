# 💰 Tax Configuration Guide - Flames EPOS

## ✅ VAT Now Optional!

The 5% VAT has been made **optional** and can be enabled/disabled from the admin panel. By default, VAT is **disabled**.

---

## 🎯 What Changed

### **Before:**
- VAT (5%) was always applied to all orders
- No way to disable it
- Always showed on receipts

### **After:**
- VAT is **disabled by default**
- Can be enabled/disabled from Admin → Settings
- Configurable tax rate (not just 5%)
- Customizable tax name (VAT, GST, Tax, etc.)
- Only shows on receipts when enabled

---

## 🚀 How to Configure

### **Access Tax Settings:**
1. Login as Admin (PIN: 1234)
2. Go to **Admin Panel**
3. Click **"Settings"** tab
4. Scroll to **"Tax Configuration"** section

### **Enable/Disable Tax:**
1. Find the **"Enable Tax (VAT)"** toggle
2. Click to enable (purple) or disable (gray)
3. When enabled, additional options appear:
   - **Tax Name**: Enter custom name (e.g., "VAT", "GST", "Tax")
   - **Tax Rate**: Enter percentage (e.g., 5 for 5%)
4. Click **"Save Settings"** at the top

---

## 📋 Configuration Options

### **Tax Name**
- Default: "VAT"
- Can be changed to: "GST", "Tax", "Sales Tax", etc.
- Appears on receipts and in POS

### **Tax Rate**
- Default: 5%
- Can be set to any value (0-100%)
- Common rates:
  - **5%** - Oman VAT
  - **15%** - Australia GST
  - **10%** - Some countries
  - **0%** - No tax (same as disabled)

### **Enable/Disable Toggle**
- **Enabled (Purple)**: Tax is calculated and shown
- **Disabled (Gray)**: No tax is added

---

## 💡 Usage Examples

### **Example 1: Oman VAT (5%)**
```
Tax Name: VAT
Tax Rate: 5
Status: Enabled
```
Result: 5% VAT added to all orders

### **Example 2: No Tax**
```
Status: Disabled
```
Result: No tax added, total = subtotal

### **Example 3: Custom Tax**
```
Tax Name: Service Charge
Tax Rate: 10
Status: Enabled
```
Result: 10% service charge added

---

## 📊 How It Works

### **When Tax is Disabled:**
```
Subtotal:  OMR 10.000
Total:     OMR 10.000
```

### **When Tax is Enabled (5%):**
```
Subtotal:  OMR 10.000
VAT (5%):  OMR  0.500
Total:     OMR 10.500
```

### **When Tax is Enabled (15%):**
```
Subtotal:   OMR 10.000
GST (15%):  OMR  1.500
Total:      OMR 11.500
```

---

## 🧾 Receipt Display

### **Tax Disabled:**
```
--------------------------------
Subtotal              OMR 10.000
--------------------------------
TOTAL                 OMR 10.000
================================
```

### **Tax Enabled:**
```
--------------------------------
Subtotal              OMR 10.000
VAT (5%)              OMR  0.500
--------------------------------
TOTAL                 OMR 10.500
================================
```

---

## 🎨 POS Screen Display

### **Cart Totals (Tax Disabled):**
```
Subtotal    OMR 10.000
Total       OMR 10.000
```

### **Cart Totals (Tax Enabled):**
```
Subtotal    OMR 10.000
VAT (5%)    OMR  0.500
Total       OMR 10.500
```

---

## 🔧 Technical Details

### **Store Structure:**
```typescript
interface TaxConfig {
  enabled: boolean;  // Is tax enabled?
  rate: number;      // Tax rate percentage
  name: string;      // Tax name (e.g., "VAT")
}
```

### **Default Configuration:**
```typescript
taxConfig: {
  enabled: false,  // Disabled by default
  rate: 5,         // 5% rate
  name: 'VAT',     // Named "VAT"
}
```

### **Calculation:**
```typescript
getCartTax: () => {
  const { taxConfig } = get();
  if (!taxConfig.enabled) return 0;
  return get().getCartSubtotal() * (taxConfig.rate / 100);
}
```

---

## 📍 Where Tax Appears

### **1. POS Screen:**
- Cart totals section
- Shows tax line only when enabled

### **2. Receipt Modal:**
- After order completion
- Shows tax breakdown only when enabled

### **3. Printed Receipts:**
- Customer receipts (network printing)
- Kitchen tickets (no tax shown)
- Email receipts

### **4. Order History:**
- Admin → Orders
- Shows tax amount in order details

---

## 🔄 Migration

### **For Existing Users:**
- Old data automatically migrates
- Tax is **disabled by default** for existing users
- No action required
- Can enable whenever ready

### **Migration Process:**
1. App detects old data (version < 3)
2. Adds `taxConfig` with defaults:
   - enabled: false
   - rate: 5
   - name: "VAT"
3. Saves to localStorage
4. Continues normally

---

## 💡 Best Practices

### **For Oman (VAT 5%):**
```
1. Enable Tax
2. Set name: "VAT"
3. Set rate: 5
4. Save settings
```

### **For No Tax:**
```
1. Disable Tax (toggle off)
2. Save settings
```

### **For Custom Tax:**
```
1. Enable Tax
2. Set custom name (e.g., "Service Charge")
3. Set custom rate (e.g., 10)
4. Save settings
```

---

## 🎯 Quick Reference

### **Enable VAT (5%):**
1. Admin → Settings → Tax Configuration
2. Toggle "Enable Tax (VAT)" ON
3. Name: VAT
4. Rate: 5
5. Save Settings

### **Disable Tax:**
1. Admin → Settings → Tax Configuration
2. Toggle "Enable Tax (VAT)" OFF
3. Save Settings

### **Change Tax Rate:**
1. Admin → Settings → Tax Configuration
2. Ensure tax is enabled
3. Change rate value
4. Save Settings

---

## 📊 Summary

### **Features:**
- ✅ Optional tax (enabled/disabled)
- ✅ Configurable tax rate
- ✅ Customizable tax name
- ✅ Shows on receipts only when enabled
- ✅ Automatic calculation
- ✅ Persists across sessions
- ✅ Migration for existing users

### **Default State:**
- **Tax**: Disabled
- **Rate**: 5%
- **Name**: VAT

### **Location:**
- **Admin Panel** → **Settings** → **Tax Configuration**

---

## 🎉 Ready to Use!

The tax system is now fully configurable:
- **Disabled by default** - No tax unless you enable it
- **Easy to enable** - Just toggle the switch
- **Flexible** - Change rate and name anytime
- **Automatic** - Calculates and displays correctly

**To enable VAT:**
1. Go to Admin → Settings
2. Scroll to "Tax Configuration"
3. Toggle "Enable Tax (VAT)" ON
4. Set rate to 5%
5. Save Settings

Done! VAT will now be added to all orders. 💰

---

**Flames Burgers & More - EPOS System**  
*Tax Configuration Guide*  
*Barka, Oman | Tel: 92809445 | @flames.om*
