import { useStore, Order, PendingEmail } from '../store/store';

// ============================================================
// SYNC SERVICE - Handles offline queue & email sync
// Works fully offline. When back online, syncs queued orders to email.
// ============================================================

// Generate HTML receipt for email
export function generateReceiptHTML(order: Order, branchInfo: { name: string; address: string; phone: string }): string {
  const date = new Date(order.timestamp);
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 4px 0; font-size: 12px;">${item.quantity}x ${item.product.name}</td>
      <td style="padding: 4px 0; font-size: 12px; text-align: right;">OMR ${(item.product.price * item.quantity).toFixed(3)}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt - ${order.id}</title>
</head>
<body style="margin: 0; padding: 20px; font-family: 'Courier New', monospace; background: #f5f5f5;">
  <div style="max-width: 320px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="text-align: center; border-bottom: 2px dashed #e53e3e; padding-bottom: 15px; margin-bottom: 15px;">
      <div style="font-size: 28px; margin-bottom: 4px;">🔥</div>
      <h1 style="margin: 0; font-size: 20px; color: #e53e3e; font-weight: 900; letter-spacing: -0.5px;">${branchInfo.name}</h1>
      <p style="margin: 4px 0 0 0; font-size: 11px; color: #666;">${branchInfo.address}</p>
      <p style="margin: 2px 0 0 0; font-size: 11px; color: #666;">Tel: ${branchInfo.phone}</p>
    </div>

    <!-- Order Info -->
    <div style="border-bottom: 1px dashed #ccc; padding-bottom: 10px; margin-bottom: 10px;">
      <table style="width: 100%; font-size: 11px;">
        <tr>
          <td style="padding: 2px 0;"><strong>Order #:</strong></td>
          <td style="padding: 2px 0; text-align: right;">${order.id}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;"><strong>Date:</strong></td>
          <td style="padding: 2px 0; text-align: right;">${date.toLocaleString('en-GB')}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;"><strong>Cashier:</strong></td>
          <td style="padding: 2px 0; text-align: right;">${order.cashier}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;"><strong>Type:</strong></td>
          <td style="padding: 2px 0; text-align: right; text-transform: capitalize;">${order.orderType}${order.tableNumber ? ` (Table ${order.tableNumber})` : ''}</td>
        </tr>
      </table>
    </div>

    <!-- Items -->
    <div style="border-bottom: 1px dashed #ccc; padding-bottom: 10px; margin-bottom: 10px;">
      <table style="width: 100%; border-collapse: collapse;">
        ${itemsHTML}
      </table>
    </div>

    <!-- Totals -->
    <div style="border-bottom: 1px dashed #ccc; padding-bottom: 10px; margin-bottom: 10px;">
      <table style="width: 100%; font-size: 12px;">
        <tr>
          <td style="padding: 3px 0;">Subtotal</td>
          <td style="padding: 3px 0; text-align: right;">OMR ${order.subtotal.toFixed(3)}</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;">VAT (5%)</td>
          <td style="padding: 3px 0; text-align: right;">OMR ${order.tax.toFixed(3)}</td>
        </tr>
        <tr style="font-size: 16px; font-weight: bold;">
          <td style="padding: 8px 0 3px 0; border-top: 2px solid #e53e3e;">TOTAL</td>
          <td style="padding: 8px 0 3px 0; border-top: 2px solid #e53e3e; text-align: right; color: #e53e3e;">OMR ${order.total.toFixed(3)}</td>
        </tr>
      </table>
    </div>

    <!-- Payment -->
    <div style="font-size: 11px; text-align: center; margin-bottom: 10px;">
      <p style="margin: 2px 0;"><strong>Payment:</strong> <span style="text-transform: capitalize;">${order.paymentMethod}</span></p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; border-top: 2px dashed #e53e3e; padding-top: 15px; margin-top: 15px;">
      <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: bold; color: #e53e3e;">Thank you for choosing Flames! 🔥</p>
      <p style="margin: 0 0 2px 0; font-size: 10px; color: #666;">Instagram: @flames.om</p>
      <p style="margin: 0; font-size: 10px; color: #666;">Please come again!</p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

// Generate plain text receipt for thermal printers (80mm)
export function generateThermalReceipt(order: Order, branchInfo: { name: string; address: string; phone: string }): string {
  const date = new Date(order.timestamp);
  const line = '--------------------------------';
  const doubleLine = '================================';
  
  let receipt = '';
  receipt += `${doubleLine}\n`;
  receipt += `        🔥 ${branchInfo.name}\n`;
  receipt += `        ${branchInfo.address}\n`;
  receipt += `        Tel: ${branchInfo.phone}\n`;
  receipt += `${doubleLine}\n`;
  receipt += `Order: ${order.id}\n`;
  receipt += `Date: ${date.toLocaleString('en-GB')}\n`;
  receipt += `Cashier: ${order.cashier}\n`;
  receipt += `Type: ${order.orderType.toUpperCase()}${order.tableNumber ? ` (Table ${order.tableNumber})` : ''}\n`;
  receipt += `${line}\n`;
  
  // Items
  order.items.forEach(item => {
    const name = item.product.name.length > 22 
      ? item.product.name.substring(0, 22) + '..' 
      : item.product.name;
    const price = (item.product.price * item.quantity).toFixed(3);
    receipt += `${item.quantity}x ${name.padEnd(24)}\n`;
    receipt += `   ${'OMR ' + price}\n`;
  });
  
  receipt += `${line}\n`;
  receipt += `Subtotal${' '.repeat(20)}OMR ${order.subtotal.toFixed(3)}\n`;
  receipt += `VAT (5%)${' '.repeat(20)}OMR ${order.tax.toFixed(3)}\n`;
  receipt += `${line}\n`;
  receipt += `TOTAL${' '.repeat(21)}OMR ${order.total.toFixed(3)}\n`;
  receipt += `${doubleLine}\n`;
  receipt += `Payment: ${order.paymentMethod.toUpperCase()}\n`;
  receipt += `${line}\n`;
  receipt += `\n`;
  receipt += `    Thank you for choosing Flames! 🔥\n`;
  receipt += `        Instagram: @flames.om\n`;
  receipt += `          Please come again!\n`;
  receipt += `\n`;
  receipt += `${doubleLine}\n`;
  receipt += `\n\n`;
  
  return receipt;
}

// Generate kitchen ticket (no prices, for kitchen display)
export function generateKitchenTicket(order: Order): string {
  const date = new Date(order.timestamp);
  const line = '--------------------------------';
  const doubleLine = '================================';
  
  let ticket = '';
  ticket += `${doubleLine}\n`;
  ticket += `        🔥 KITCHEN ORDER 🔥\n`;
  ticket += `${doubleLine}\n`;
  ticket += `Order: ${order.id}\n`;
  ticket += `Time: ${date.toLocaleTimeString('en-GB')}\n`;
  ticket += `Type: ${order.orderType.toUpperCase()}${order.tableNumber ? ` | Table ${order.tableNumber}` : ''}\n`;
  ticket += `${line}\n`;
  
  order.items.forEach(item => {
    ticket += `\n[${item.quantity}x] ${item.product.name.toUpperCase()}\n`;
    if (item.notes) {
      ticket += `   NOTE: ${item.notes}\n`;
    }
  });
  
  ticket += `\n${doubleLine}\n`;
  ticket += `\n\n`;
  
  return ticket;
}

// Print receipt using browser print
export function printReceipt(order: Order, type: 'customer' | 'kitchen' = 'customer') {
  const branchInfo = {
    name: 'FLAMES BURGERS & MORE',
    address: 'Barka, Oman',
    phone: '92809445',
  };

  let content: string;
  if (type === 'kitchen') {
    const ticket = generateKitchenTicket(order);
    content = `<pre style="font-family: 'Courier New', monospace; font-size: 12px; white-space: pre; max-width: 300px; margin: 0 auto;">${ticket}</pre>`;
  } else {
    content = generateReceiptHTML(order, branchInfo);
  }

  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${order.id}</title>
          <style>
            @page { margin: 5mm; size: 80mm auto; }
            body { margin: 0; padding: 0; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    // Small delay to ensure content loads
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  }
}

// Queue an email to be sent (works offline)
export function queueEmailForOrder(order: Order): PendingEmail {
  const state = useStore.getState();
  const emailConfig = state.emailConfig;
  
  const pending: PendingEmail = {
    id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    orderId: order.id,
    recipientEmail: emailConfig.recipientEmail,
    orderData: order,
    createdAt: Date.now(),
    attempts: 0,
    status: 'pending',
  };

  useStore.getState().addPendingEmail(pending);
  return pending;
}

// Attempt to send a single email
// In production, this would call EmailJS or your backend API
export async function sendEmail(pending: PendingEmail): Promise<boolean> {
  const state = useStore.getState();
  
  // Mark as sending
  useStore.getState().updatePendingEmail(pending.id, { status: 'sending', lastAttempt: Date.now(), attempts: pending.attempts + 1 });

  try {
    // Check if we have email config
    if (!state.emailConfig.enabled || !state.emailConfig.recipientEmail) {
      throw new Error('Email not configured');
    }

    // Check internet connection
    if (!navigator.onLine) {
      throw new Error('Offline');
    }

    // Simulate API call (replace with real EmailJS/backend integration)
    // Example with EmailJS:
    // await emailjs.send(serviceId, templateId, { ... });
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mark as sent
    useStore.getState().updatePendingEmail(pending.id, { status: 'sent' });
    return true;
  } catch (error) {
    // Mark as failed, will retry later
    useStore.getState().updatePendingEmail(pending.id, { 
      status: 'failed', 
      lastAttempt: Date.now(),
      attempts: pending.attempts + 1 
    });
    return false;
  }
}

// Process all pending emails in the queue
export async function syncPendingEmails(): Promise<{ sent: number; failed: number }> {
  const state = useStore.getState();
  const pending = state.pendingEmails.filter(e => e.status === 'pending' || e.status === 'failed');
  
  let sent = 0;
  let failed = 0;

  for (const email of pending) {
    // Don't retry too frequently (min 30 seconds between attempts)
    if (email.lastAttempt && Date.now() - email.lastAttempt < 30000) {
      continue;
    }
    
    const success = await sendEmail(email);
    if (success) sent++;
    else failed++;
  }

  return { sent, failed };
}
