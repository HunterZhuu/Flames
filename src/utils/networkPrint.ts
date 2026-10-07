import { useStore, type Order } from '../store/store';

// ESC/POS Commands for EPSON TM-m30II
const ESC = '\x1B';
const GS = '\x1D';
const CUT = GS + 'V' + '\x00';
const INIT = ESC + '@';
const BOLD_ON = ESC + 'E' + '\x01';
const BOLD_OFF = ESC + 'E' + '\x00';
const ALIGN_CENTER = ESC + 'a' + '\x01';
const ALIGN_LEFT = ESC + 'a' + '\x00';
const ALIGN_RIGHT = ESC + 'a' + '\x02';
const DOUBLE_HEIGHT = ESC + '!' + '\x10';
const NORMAL_SIZE = ESC + '!' + '\x00';
const LINE_FEED = '\n';

// Build ESC/POS receipt data
function buildReceiptData(order: Order, branchInfo: { name: string; address: string; phone: string }): string {
  const { taxConfig } = useStore.getState();
  const date = new Date(order.timestamp);
  let data = INIT;

  // Header
  data += ALIGN_CENTER;
  data += BOLD_ON + DOUBLE_HEIGHT;
  data += '🔥 FLAMES' + LINE_FEED;
  data += NORMAL_SIZE;
  data += 'BURGERS & MORE' + LINE_FEED;
  data += BOLD_OFF;
  data += branchInfo.address + LINE_FEED;
  data += 'Tel: ' + branchInfo.phone + LINE_FEED;
  data += '================================' + LINE_FEED;

  // Order info
  data += ALIGN_LEFT;
  data += 'Order: ' + order.id + LINE_FEED;
  data += 'Date: ' + date.toLocaleString('en-GB') + LINE_FEED;
  data += 'Cashier: ' + order.cashier + LINE_FEED;
  data += 'Type: ' + order.orderType.toUpperCase();
  if (order.tableNumber) data += ' (Table ' + order.tableNumber + ')';
  data += LINE_FEED;
  data += '--------------------------------' + LINE_FEED;

  // Items
  order.items.forEach(item => {
    const name = item.product.name.length > 22 
      ? item.product.name.substring(0, 22) + '..' 
      : item.product.name;
    data += item.quantity + 'x ' + name.padEnd(24) + LINE_FEED;
    data += ALIGN_RIGHT;
    data += 'OMR ' + (item.product.price * item.quantity).toFixed(3) + LINE_FEED;
    data += ALIGN_LEFT;
  });

  data += '--------------------------------' + LINE_FEED;

  // Totals
  data += 'Subtotal'.padEnd(24) + 'OMR ' + order.subtotal.toFixed(3) + LINE_FEED;
  if (taxConfig.enabled && order.tax > 0) {
    data += (taxConfig.name + ' (' + taxConfig.rate + '%)').padEnd(24) + 'OMR ' + order.tax.toFixed(3) + LINE_FEED;
  }
  data += '--------------------------------' + LINE_FEED;
  data += BOLD_ON;
  data += 'TOTAL'.padEnd(23) + 'OMR ' + order.total.toFixed(3) + LINE_FEED;
  data += BOLD_OFF;
  data += '================================' + LINE_FEED;

  // Payment details
  data += ALIGN_CENTER;
  data += BOLD_ON;
  data += 'PAYMENT DETAILS' + LINE_FEED;
  data += BOLD_OFF;
  data += '--------------------------------' + LINE_FEED;
  data += ALIGN_LEFT;
  data += 'Method: ' + order.paymentMethod.toUpperCase() + LINE_FEED;

  if (order.paymentMethod === 'cash' && order.cashTendered !== undefined) {
    data += '--------------------------------' + LINE_FEED;
    data += 'Amount Paid:    OMR ' + order.cashTendered.toFixed(3) + LINE_FEED;
    data += 'Total Bill:     OMR ' + order.total.toFixed(3) + LINE_FEED;
    if (order.change !== undefined && order.change > 0) {
      data += '--------------------------------' + LINE_FEED;
      data += BOLD_ON;
      data += '*** CHANGE DUE ***  OMR ' + order.change.toFixed(3) + LINE_FEED;
      data += BOLD_OFF;
      data += '--------------------------------' + LINE_FEED;
    }
  }

  data += LINE_FEED;
  data += ALIGN_CENTER;
  data += 'Thank you for choosing Flames! 🔥' + LINE_FEED;
  data += 'Follow us: @flames.om' + LINE_FEED;
  data += 'instagram.com/flames.om' + LINE_FEED;
  data += 'Please come again!' + LINE_FEED;
  data += LINE_FEED;
  data += LINE_FEED;
  data += CUT;

  return data;
}

// Build kitchen ticket data
function buildKitchenTicketData(order: Order): string {
  const date = new Date(order.timestamp);
  let data = INIT;

  data += ALIGN_CENTER;
  data += BOLD_ON + DOUBLE_HEIGHT;
  data += '🔥 KITCHEN ORDER' + LINE_FEED;
  data += NORMAL_SIZE + BOLD_OFF;
  data += '================================' + LINE_FEED;
  data += ALIGN_LEFT;
  data += 'Order: ' + order.id + LINE_FEED;
  data += 'Time: ' + date.toLocaleTimeString('en-GB') + LINE_FEED;
  data += 'Type: ' + order.orderType.toUpperCase();
  if (order.tableNumber) data += ' | Table ' + order.tableNumber;
  data += LINE_FEED;
  data += '--------------------------------' + LINE_FEED;

  order.items.forEach(item => {
    data += LINE_FEED;
    data += BOLD_ON;
    data += '[' + item.quantity + 'x] ' + item.product.name.toUpperCase() + LINE_FEED;
    data += BOLD_OFF;
    if (item.notes) {
      data += '   NOTE: ' + item.notes + LINE_FEED;
    }
  });

  data += LINE_FEED;
  data += '================================' + LINE_FEED;
  data += LINE_FEED;
  data += LINE_FEED;
  data += CUT;

  return data;
}

// Send ESC/POS data directly to network printer
async function sendToPrinter(printerIP: string, port: number, data: string): Promise<boolean> {
  try {
    const url = `http://${printerIP}:${port}`;
    
    // Convert string to Uint8Array for binary transmission
    const encoder = new TextEncoder();
    const bytes = encoder.encode(data);
    
    // Send via fetch with no-cors to avoid CORS issues
    // EPSON printers accept raw ESC/POS data via HTTP POST
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: bytes,
      mode: 'no-cors',
    });

    // no-cors mode returns opaque response, but data is still sent
    return true;
  } catch (error) {
    console.error('Printer connection error:', error);
    
    // Fallback: Try using EPSON ePOS-Print API format
    try {
      const url = `http://${printerIP}:80`;
      const encoder = new TextEncoder();
      const bytes = encoder.encode(data);
      
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: bytes,
        mode: 'no-cors',
      });
      return true;
    } catch (fallbackError) {
      console.error('Fallback printer error:', fallbackError);
      return false;
    }
  }
}

// Test printer connection
export async function testNetworkPrinter(): Promise<{ success: boolean; message: string }> {
  const { printerConfig } = useStore.getState();
  const defaultPrinter = printerConfig.printers.find(p => p.isDefault && p.enabled) 
    || printerConfig.printers.find(p => p.enabled);
  
  if (!defaultPrinter) {
    return { success: false, message: 'No printer configured' };
  }

  try {
    const testData = INIT + ALIGN_CENTER + 'TEST PRINT - FLAMES EPOS' + LINE_FEED + LINE_FEED + CUT;
    const success = await sendToPrinter(defaultPrinter.ipAddress, defaultPrinter.port, testData);
    
    if (success) {
      return { 
        success: true, 
        message: `✓ Sent test print to ${defaultPrinter.name} (${defaultPrinter.ipAddress})` 
      };
    } else {
      return { 
        success: false, 
        message: `✗ Failed to connect to ${defaultPrinter.name}` 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: `✗ Connection error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

// Auto-print receipt directly to network printer (no dialog!)
export async function autoPrintReceipt(order: Order, type: 'customer' | 'kitchen' = 'customer'): Promise<boolean> {
  const { printerConfig, emailConfig } = useStore.getState();
  const branchInfo = {
    name: emailConfig.branchName || 'FLAMES BURGERS & MORE',
    address: emailConfig.branchAddress || 'Barka, Oman',
    phone: emailConfig.branchPhone || '92809445',
  };

  // Find the default enabled printer
  const defaultPrinter = printerConfig.printers.find(p => p.isDefault && p.enabled) 
    || printerConfig.printers.find(p => p.enabled);
  
  if (!defaultPrinter) {
    console.error('No printer configured for auto-print');
    return false;
  }

  // Build the appropriate receipt data
  const data = type === 'kitchen' 
    ? buildKitchenTicketData(order)
    : buildReceiptData(order, branchInfo);

  // Send directly to printer (no dialog!)
  return await sendToPrinter(defaultPrinter.ipAddress, defaultPrinter.port, data);
}

// Legacy function for backward compatibility - now uses network printing
export function printReceipt(order: Order, type: 'customer' | 'kitchen' = 'customer'): boolean {
  // Try network printing first (auto-print, no dialog)
  autoPrintReceipt(order, type).then(success => {
    if (!success) {
      // Fallback to browser print if network printing fails
      console.warn('Network printing failed, falling back to browser print');
      fallbackBrowserPrint(order, type);
    }
  });
  
  return true; // Return true immediately (async operation)
}

// Fallback browser print (only used if network printing fails)
function fallbackBrowserPrint(order: Order, type: 'customer' | 'kitchen') {
  const branchInfo = { name: 'FLAMES BURGERS & MORE', address: 'Barka, Oman', phone: '92809445' };
  
  let content: string;
  if (type === 'kitchen') {
    content = `<pre style="font-family: 'Courier New', monospace; font-size: 12px; white-space: pre; max-width: 300px; margin: 0 auto;">${buildKitchenTicketData(order)}</pre>`;
  } else {
    content = `<div style="max-width: 320px; margin: 0 auto; font-family: 'Courier New', monospace;">
      <div style="text-align: center; border-bottom: 2px dashed #000; padding-bottom: 15px; margin-bottom: 15px;">
        <h1 style="margin: 0; font-size: 20px;">🔥 ${branchInfo.name}</h1>
        <p style="margin: 4px 0;">${branchInfo.address}</p>
        <p style="margin: 2px 0;">Tel: ${branchInfo.phone}</p>
      </div>
      <p>Order: ${order.id}</p>
      <p>Date: ${new Date(order.timestamp).toLocaleString('en-GB')}</p>
      <p>Cashier: ${order.cashier}</p>
      <hr/>
      ${order.items.map(item => `<p>${item.quantity}x ${item.product.name} - OMR ${(item.product.price * item.quantity).toFixed(3)}</p>`).join('')}
      <hr/>
      <p><strong>TOTAL: OMR ${order.total.toFixed(3)}</strong></p>
    </div>`;
  }

  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (printWindow) {
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Receipt - ${order.id}</title><style>@page { margin: 5mm; size: 80mm auto; } body { margin: 0; padding: 0; }</style></head><body>${content}</body></html>`);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  }
}

// Test print function for settings page
export function testPrint(): boolean {
  testNetworkPrinter().then(result => {
    if (result.success) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  });
  return true;
}
