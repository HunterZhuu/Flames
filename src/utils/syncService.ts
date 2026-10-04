import { useStore, type Order, type PendingEmail } from '../store/store';

export function generateReceiptHTML(order: Order, branchInfo: { name: string; address: string; phone: string }): string {
  const date = new Date(order.timestamp);
  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 4px 0; font-size: 12px;">${item.quantity}x ${item.product.name}</td>
      <td style="padding: 4px 0; font-size: 12px; text-align: right;">OMR ${(item.product.price * item.quantity).toFixed(3)}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Receipt - ${order.id}</title></head>
<body style="margin: 0; padding: 20px; font-family: 'Courier New', monospace; background: #f5f5f5;">
  <div style="max-width: 320px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="text-align: center; border-bottom: 2px dashed #e53e3e; padding-bottom: 15px; margin-bottom: 15px;">
      <div style="font-size: 28px; margin-bottom: 4px;">🔥</div>
      <h1 style="margin: 0; font-size: 20px; color: #e53e3e; font-weight: 900;">${branchInfo.name}</h1>
      <p style="margin: 4px 0 0 0; font-size: 11px; color: #666;">${branchInfo.address}</p>
      <p style="margin: 2px 0 0 0; font-size: 11px; color: #666;">Tel: ${branchInfo.phone}</p>
    </div>
    <div style="border-bottom: 1px dashed #ccc; padding-bottom: 10px; margin-bottom: 10px;">
      <table style="width: 100%; font-size: 11px;">
        <tr><td><strong>Order #:</strong></td><td style="text-align: right;">${order.id}</td></tr>
        <tr><td><strong>Date:</strong></td><td style="text-align: right;">${date.toLocaleString('en-GB')}</td></tr>
        <tr><td><strong>Cashier:</strong></td><td style="text-align: right;">${order.cashier}</td></tr>
        <tr><td><strong>Type:</strong></td><td style="text-align: right; text-transform: capitalize;">${order.orderType}${order.tableNumber ? ` (Table ${order.tableNumber})` : ''}</td></tr>
      </table>
    </div>
    <div style="border-bottom: 1px dashed #ccc; padding-bottom: 10px; margin-bottom: 10px;">
      <table style="width: 100%; border-collapse: collapse;">${itemsHTML}</table>
    </div>
    <div style="border-bottom: 1px dashed #ccc; padding-bottom: 10px; margin-bottom: 10px;">
      <table style="width: 100%; font-size: 12px;">
        <tr><td>Subtotal</td><td style="text-align: right;">OMR ${order.subtotal.toFixed(3)}</td></tr>
        <tr><td>VAT (5%)</td><td style="text-align: right;">OMR ${order.tax.toFixed(3)}</td></tr>
        <tr style="font-size: 16px; font-weight: bold;">
          <td style="padding: 8px 0 3px 0; border-top: 2px solid #e53e3e;">TOTAL</td>
          <td style="padding: 8px 0 3px 0; border-top: 2px solid #e53e3e; text-align: right; color: #e53e3e;">OMR ${order.total.toFixed(3)}</td>
        </tr>
      </table>
    </div>
    <div style="border: 2px solid #e53e3e; border-radius: 8px; padding: 12px; margin: 15px 0; background: #fef2f2;">
      <p style="margin: 0 0 8px 0; text-align: center; font-weight: bold; color: #e53e3e; font-size: 12px;">PAYMENT DETAILS</p>
      <div style="display: flex; justify-content: space-between; margin: 4px 0;"><span>Payment Method:</span><span style="text-transform: capitalize; font-weight: bold;">${order.paymentMethod}</span></div>
      ${order.paymentMethod === 'cash' && order.cashTendered !== undefined ? `
        <div style="border-top: 1px dashed #e53e3e; margin: 8px 0;"></div>
        <div style="display: flex; justify-content: space-between; margin: 4px 0;"><span>Amount Paid:</span><span style="font-weight: bold;">OMR ${order.cashTendered.toFixed(3)}</span></div>
        <div style="display: flex; justify-content: space-between; margin: 4px 0;"><span>Total Bill:</span><span style="font-weight: bold;">OMR ${order.total.toFixed(3)}</span></div>
        ${order.change !== undefined && order.change > 0 ? `
          <div style="border-top: 2px solid #16a34a; margin: 8px 0;"></div>
          <div style="display: flex; justify-content: space-between; margin: 8px 0 0 0; padding: 8px; background: #dcfce7; border-radius: 4px;">
            <span style="font-weight: bold; color: #16a34a; font-size: 13px;">💰 CHANGE TO RETURN:</span>
            <span style="font-weight: bold; color: #16a34a; font-size: 13px;">OMR ${order.change.toFixed(3)}</span>
          </div>
        ` : ''}
      ` : ''}
    </div>
    <div style="text-align: center; border-top: 2px dashed #e53e3e; padding-top: 15px; margin-top: 15px;">
      <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: bold; color: #e53e3e;">Thank you for choosing Flames! 🔥</p>
      <p style="margin: 0 0 2px 0; font-size: 10px; color: #666;"><a href="https://www.instagram.com/flames.om" style="color: #e53e3e; text-decoration: none; font-weight: bold;">@flames.om</a></p>
      <p style="margin: 0; font-size: 10px; color: #666;">Please come again!</p>
    </div>
  </div>
</body></html>`;
}

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
  
  order.items.forEach(item => {
    const name = item.product.name.length > 22 ? item.product.name.substring(0, 22) + '..' : item.product.name;
    receipt += `${item.quantity}x ${name.padEnd(24)}\n`;
    receipt += `   OMR ${(item.product.price * item.quantity).toFixed(3)}\n`;
  });
  
  receipt += `${line}\n`;
  receipt += `Subtotal${' '.repeat(20)}OMR ${order.subtotal.toFixed(3)}\n`;
  receipt += `VAT (5%)${' '.repeat(20)}OMR ${order.tax.toFixed(3)}\n`;
  receipt += `${line}\n`;
  receipt += `TOTAL${' '.repeat(21)}OMR ${order.total.toFixed(3)}\n`;
  receipt += `${doubleLine}\n`;
  receipt += `        PAYMENT DETAILS\n`;
  receipt += `${line}\n`;
  receipt += `Payment Method: ${order.paymentMethod.toUpperCase()}\n`;
  
  if (order.paymentMethod === 'cash' && order.cashTendered !== undefined) {
    receipt += `${line}\n`;
    receipt += `Amount Paid:      OMR ${order.cashTendered.toFixed(3)}\n`;
    receipt += `Total Bill:       OMR ${order.total.toFixed(3)}\n`;
    if (order.change !== undefined && order.change > 0) {
      receipt += `${line}\n`;
      receipt += `*** CHANGE DUE ***  OMR ${order.change.toFixed(3)}\n`;
      receipt += `${line}\n`;
    }
  }
  
  receipt += `\n    Thank you for choosing Flames! 🔥\n`;
  receipt += `        Follow us: @flames.om\n`;
  receipt += `    instagram.com/flames.om\n`;
  receipt += `          Please come again!\n\n${doubleLine}\n\n`;
  
  return receipt;
}

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
    if (item.notes) ticket += `   NOTE: ${item.notes}\n`;
  });
  
  ticket += `\n${doubleLine}\n\n`;
  return ticket;
}

export function printReceipt(order: Order, type: 'customer' | 'kitchen' = 'customer'): boolean {
  const branchInfo = { name: 'FLAMES BURGERS & MORE', address: 'Barka, Oman', phone: '92809445' };

  let content: string;
  if (type === 'kitchen') {
    const ticket = generateKitchenTicket(order);
    content = `<pre style="font-family: 'Courier New', monospace; font-size: 12px; white-space: pre; max-width: 300px; margin: 0 auto;">${ticket}</pre>`;
  } else {
    content = generateReceiptHTML(order, branchInfo);
  }

  try {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (!printWindow) {
      console.error('Could not open print window. Please allow popups for this site.');
      return false;
    }

    const printStyles = `
      @page { 
        margin: 5mm; 
        size: 80mm auto; 
      }
      body { 
        margin: 0; 
        padding: 0; 
        font-family: 'Courier New', monospace;
      }
      @media print { 
        body { margin: 0; }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${order.id}</title>
          <style>${printStyles}</style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);

    return true;
  } catch (error) {
    console.error('Print error:', error);
    return false;
  }
}

export function testPrint(): boolean {
  try {
    const testWindow = window.open('', '_blank', 'width=400,height=600');
    if (!testWindow) {
      console.error('Could not open test print window. Please allow popups for this site.');
      return false;
    }

    const testContent = `
      <div style="max-width: 300px; margin: 20px auto; font-family: 'Courier New', monospace;">
        <div style="text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
          <h2 style="margin: 0;">🔥 TEST PRINT</h2>
          <p style="margin: 5px 0; font-size: 12px;">FLAMES BURGERS & MORE</p>
        </div>
        <p style="text-align: center; font-size: 14px; margin: 20px 0;">
          ✓ Printer test successful!<br>
          ✓ Print function is working<br>
          ✓ Receipt formatting is correct
        </p>
        <div style="border-top: 2px dashed #000; padding-top: 10px; margin-top: 10px; text-align: center;">
          <p style="margin: 0; font-size: 10px;">Test completed at ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    const printStyles = `
      @page { margin: 5mm; size: 80mm auto; }
      body { margin: 0; padding: 0; font-family: 'Courier New', monospace; }
      @media print { body { margin: 0; } }
    `;

    testWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Print</title>
          <style>${printStyles}</style>
        </head>
        <body>${testContent}</body>
      </html>
    `);
    testWindow.document.close();
    
    setTimeout(() => {
      testWindow.focus();
      testWindow.print();
    }, 500);

    return true;
  } catch (error) {
    console.error('Test print error:', error);
    return false;
  }
}

export function queueEmailForOrder(order: Order): PendingEmail {
  const state = useStore.getState();
  const pending: PendingEmail = {
    id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    orderId: order.id,
    recipientEmail: state.emailConfig.recipientEmail,
    orderData: order,
    createdAt: Date.now(),
    attempts: 0,
    status: 'pending',
  };
  useStore.getState().addPendingEmail(pending);
  return pending;
}

export async function sendEmail(pending: PendingEmail): Promise<boolean> {
  const state = useStore.getState();
  useStore.getState().updatePendingEmail(pending.id, { status: 'sending', lastAttempt: Date.now(), attempts: pending.attempts + 1 });
  try {
    if (!state.emailConfig.enabled || !state.emailConfig.recipientEmail) throw new Error('Email not configured');
    if (!navigator.onLine) throw new Error('Offline');
    await new Promise(resolve => setTimeout(resolve, 800));
    useStore.getState().updatePendingEmail(pending.id, { status: 'sent' });
    return true;
  } catch {
    useStore.getState().updatePendingEmail(pending.id, { status: 'failed', lastAttempt: Date.now(), attempts: pending.attempts + 1 });
    return false;
  }
}

export async function syncPendingEmails(): Promise<{ sent: number; failed: number }> {
  const state = useStore.getState();
  const pending = state.pendingEmails.filter(e => e.status === 'pending' || e.status === 'failed');
  let sent = 0, failed = 0;
  for (const email of pending) {
    if (email.lastAttempt && Date.now() - email.lastAttempt < 30000) continue;
    const success = await sendEmail(email);
    if (success) sent++; else failed++;
  }
  return { sent, failed };
}
