# 🖨️ Printer Configuration Guide - Flames EPOS

## ✅ Advanced Printer Setup Complete

Comprehensive printer configuration has been added to support your EPSON M362A and other POS printers with full network configuration for both WiFi and LAN connections.

---

## 🎯 What's New

### **1. Multi-Printer Support**
- ✅ Add multiple printers (iPad, kitchen, bar, etc.)
- ✅ Set default printer
- ✅ Enable/disable individual printers
- ✅ Test connection for each printer

### **2. Network Configuration**
- ✅ iPad IP address configuration
- ✅ Subnet mask settings
- ✅ Gateway configuration
- ✅ Support for both WiFi and LAN

### **3. Printer Types Supported**
- ✅ Thermal printers (receipt printers)
- ✅ Impact printers (kitchen printers)
- ✅ Laser printers
- ✅ Inkjet printers

### **4. Connection Types**
- ✅ WiFi (wireless)
- ✅ LAN/Ethernet (wired)
- ✅ USB (direct connection)
- ✅ Bluetooth (wireless)

### **5. Network Settings Per Printer**
- ✅ IP address
- ✅ Port number (default: 9100)
- ✅ Subnet mask
- ✅ Gateway

---

## 🚀 How to Use

### **Access Printer Settings**
1. Login as Admin (PIN: 1234)
2. Go to **Admin Panel**
3. Click **"Printers"** tab (🖨️ icon)

---

## 📋 Configuration Steps

### **Step 1: Configure Network Settings**

At the top of the Printers page, configure your network:

```
iPad IP Address: 192.168.8.100
Subnet Mask: 255.255.255.0
Gateway: 192.168.8.1
```

**Important:**
- iPad and printer must be on the same network (same subnet)
- Gateway is typically your router's IP address
- Subnet mask is usually 255.255.255.0 for home/office networks

---

### **Step 2: Add Your EPSON M362A Printer**

1. Click **"Add Printer"** button (green button)
2. Fill in the details:

**Printer Details:**
```
Printer Name: EPSON TM-m30II (M362A)
Printer Type: Thermal
Model: TM-m30II
Connection Type: LAN (or WiFi if using wireless)
```

**Network Settings:**
```
IP Address: 192.168.8.108
Port: 9100 (default for EPSON)
Subnet Mask: 255.255.255.0
Gateway: 192.168.8.1
```

3. Check **"Enable Printer"**
4. Check **"Set as Default Printer"** (if this is your main printer)
5. Click **"Add Printer"**

---

### **Step 3: Test Connection**

1. Find your printer in the list
2. Click the **plug icon** (🔌) to test connection
3. Wait for result:
   - ✅ **"Connected to EPSON TM-m30II at 192.168.8.108"** - Success!
   - ❌ **"Cannot connect to EPSON TM-m30II"** - Check network settings

---

### **Step 4: Configure Auto-Print**

In the **"Auto-Print Settings"** section:

1. **Auto-Print Customer Receipt**: Toggle ON/OFF
   - Automatically prints receipt after order completion
   
2. **Auto-Print Kitchen Ticket**: Toggle ON/OFF
   - Automatically prints kitchen copy after order
   
3. **Print Delay**: Set delay in seconds (default: 1.5s)
   - Gives time to view receipt before printing

---

## 🔧 Network Setup Guide

### **For LAN Connection (Ethernet)**

**Physical Setup:**
1. Connect EPSON printer to router using Ethernet cable
2. Connect iPad to same router (WiFi or Ethernet)
3. Both devices will be on the same network

**Printer Configuration:**
1. Turn on printer
2. Press and hold **Feed** button while turning on printer
3. Printer prints network configuration
4. Note the IP address (or set static IP)

**Set Static IP on Printer:**
1. Access printer web interface (type printer IP in browser)
2. Go to Network Settings
3. Set static IP:
   ```
   IP Address: 192.168.8.108
   Subnet Mask: 255.255.255.0
   Gateway: 192.168.8.1
   ```
4. Save and restart printer

---

### **For WiFi Connection**

**Physical Setup:**
1. Turn on printer
2. Connect printer to WiFi network (same as iPad)
3. Both devices on same WiFi network

**Printer WiFi Setup:**
1. Press **Home** button on printer
2. Go to **WiFi Setup**
3. Select your WiFi network
4. Enter WiFi password
5. Printer connects and gets IP address
6. Note the IP address from printer display or print network config

**Set Static IP (Recommended):**
1. Access printer web interface
2. Go to Network → WiFi → TCP/IP
3. Set static IP:
   ```
   IP Address: 192.168.8.108
   Subnet Mask: 255.255.255.0
   Gateway: 192.168.8.1
   ```
4. Save settings

---

### **For iPad Configuration**

**Check iPad IP:**
1. Go to **Settings** → **WiFi**
2. Tap the connected WiFi network
3. Note the **IP Address** (e.g., 192.168.8.100)

**Set Static IP (Recommended):**
1. Go to **Settings** → **WiFi**
2. Tap the connected WiFi network
3. Tap **Configure IP** → **Manual**
4. Enter:
   ```
   IP Address: 192.168.8.100
   Subnet Mask: 255.255.255.0
   Router: 192.168.8.1
   ```
5. Tap **Save**

---

## 🖨️ Adding Multiple Printers

### **Example: Kitchen Printer**

1. Click **"Add Printer"**
2. Fill in details:
   ```
   Name: Kitchen Impact Printer
   Type: Impact
   Model: TM-U220
   Connection: LAN
   IP: 192.168.8.109
   Port: 9100
   ```
3. Enable but don't set as default
4. Save

### **Example: Bar Printer**

1. Click **"Add Printer"**
2. Fill in details:
   ```
   Name: Bar Receipt Printer
   Type: Thermal
   Model: TM-T88V
   Connection: WiFi
   IP: 192.168.8.110
   Port: 9100
   ```
3. Enable but don't set as default
4. Save

---

## 🎛️ Printer Management

### **Set Default Printer**
1. Find the printer you want as default
2. Click the **star icon** (⭐)
3. Printer is now marked as default
4. All prints will use this printer by default

### **Enable/Disable Printer**
1. Edit the printer
2. Toggle **"Enable Printer"** ON/OFF
3. Save changes
4. Disabled printers won't appear in print options

### **Edit Printer Settings**
1. Click the **edit icon** (✏️) on the printer
2. Modify any settings
3. Click **"Update Printer"**

### **Remove Printer**
1. Click the **trash icon** (🗑️) on the printer
2. Confirm removal
3. Printer is deleted from configuration

---

## 🧪 Testing Printers

### **Test Connection**
1. Click the **plug icon** (🔌) on any printer
2. System attempts to connect
3. Result appears as toast notification:
   - ✅ Green: "Connected to [Printer Name]"
   - ❌ Red: "Cannot connect to [Printer Name]"

### **Test Print**
1. Go to **Settings** tab
2. Scroll to **Printer Settings**
3. Click **"Test Print"** button
4. Print dialog opens
5. Select your printer
6. Click "Print"
7. Verify test receipt prints correctly

---

## 📊 Printer Status Indicators

### **Visual Indicators**

**Connection Type Icons:**
- 📶 WiFi (blue)
- 🔌 LAN/Ethernet (green)
- 🔌 USB (purple)
- 📱 Bluetooth (orange)

**Status Badges:**
- 🟢 **DEFAULT** - Green badge (default printer)
- 🔵 **ENABLED** - Blue badge (printer is active)
- ⚫ **DISABLED** - Gray badge (printer is inactive)

**Card Colors:**
- 🟢 Green border - Default printer
- ⚪ Gray border - Regular printer

---

## 🔍 Troubleshooting

### **Issue: Cannot Connect to Printer**

**Check 1: Network Connectivity**
- ✅ iPad and printer on same network?
- ✅ Same subnet (255.255.255.0)?
- ✅ Correct gateway (192.168.8.1)?

**Check 2: IP Address**
- ✅ Printer IP correct (192.168.8.108)?
- ✅ IP not conflicting with other devices?
- ✅ Printer has static IP (not DHCP)?

**Check 3: Firewall**
- ✅ Router firewall allows printer communication?
- ✅ Port 9100 not blocked?
- ✅ No network isolation enabled?

**Check 4: Printer Status**
- ✅ Printer turned on?
- ✅ Paper loaded?
- ✅ No error lights?
- ✅ Connected to network?

---

### **Issue: Print Works But Formatting Wrong**

**Solution 1: Check Paper Size**
- Print dialog → "More settings"
- Set paper size to 80mm (3 inches)
- Try printing again

**Solution 2: Check Printer Driver**
- Update printer driver
- Install EPSON TM printer driver
- Restart computer

**Solution 3: Check Port**
- Verify port is 9100 (standard for EPSON)
- Some printers use different ports
- Check printer manual

---

### **Issue: Auto-Print Not Working**

**Check 1: Settings**
- ✅ Auto-print enabled in settings?
- ✅ Print delay set (not 0)?
- ✅ Default printer selected?

**Check 2: Browser Permissions**
- ✅ Popups allowed for this site?
- ✅ Print permission granted?

**Check 3: Printer Connection**
- ✅ Test connection successful?
- ✅ Printer enabled?
- ✅ Printer online?

---

## 💡 Best Practices

### **Network Setup**
1. **Use static IPs** for printers (not DHCP)
2. **Same subnet** for all devices
3. **Document IP addresses** for future reference
4. **Test connection** after setup

### **Printer Management**
1. **Name printers clearly** (e.g., "Kitchen", "Bar", "Counter")
2. **Set default printer** for main receipts
3. **Test regularly** to ensure connectivity
4. **Keep printer drivers updated**

### **Daily Operations**
1. **Check printer status** at start of day
2. **Verify paper levels**
3. **Test print** if issues suspected
4. **Monitor print queue** for stuck jobs

---

## 📋 Configuration Summary

### **Your Current Setup:**

**Network:**
```
iPad IP: 192.168.8.100
Subnet: 255.255.255.0
Gateway: 192.168.8.1
```

**EPSON M362A Printer:**
```
Name: EPSON TM-m30II (M362A)
Type: Thermal
Model: TM-m30II
Connection: LAN
IP: 192.168.8.108
Port: 9100
Subnet: 255.255.255.0
Gateway: 192.168.8.1
Status: Default, Enabled
```

---

## 🎯 Quick Reference

### **Access Printer Settings:**
Admin Panel → Printers tab

### **Add New Printer:**
Printers → Add Printer button

### **Test Connection:**
Click plug icon (🔌) on printer

### **Set Default:**
Click star icon (⭐) on printer

### **Edit Printer:**
Click edit icon (✏️) on printer

### **Remove Printer:**
Click trash icon (🗑️) on printer

---

## 📞 Support

### **EPSON Printer Support:**
- EPSON Website: https://epson.com
- TM-m30II Manual: Check printer documentation
- Driver Download: EPSON support website

### **Network Issues:**
- Check router settings
- Verify IP configuration
- Test with ping command: `ping 192.168.8.108`
- Contact IT support if needed

---

## 🎉 Summary

The printer configuration system provides:
- ✅ **Multi-printer support** - Add unlimited printers
- ✅ **Network configuration** - Full IP/subnet/gateway control
- ✅ **Connection testing** - Verify printer connectivity
- ✅ **Default printer** - Set main printer for auto-print
- ✅ **Multiple connection types** - WiFi, LAN, USB, Bluetooth
- ✅ **Printer types** - Thermal, impact, laser, inkjet
- ✅ **Visual indicators** - Clear status badges and icons
- ✅ **Easy management** - Add, edit, remove, enable/disable

**Your EPSON M362A is pre-configured and ready to use!**

---

**Flames Burgers & More - EPOS System**  
*Printer Configuration Guide*  
*Barka, Oman | Tel: 92809445 | @flames.om*
