import type { Order } from '../store/store';

/**
 * iPad Direct Network Printing to Epson POS Printer
 * Bypasses iOS AirPrint dialog completely
 * 
 * Requirements:
 * - WebSocket proxy server running on local network
 * - Epson printer connected via LAN/WiFi on port 9100
 * - iPad and printer on same network
 */

export class EpsonDirectPrint {
  private printerIP: string;
  private proxyPort: number;
  private ws: WebSocket | null = null;
  
  // ESC/POS Commands
  private ESC = '\x1B';
  private GS = '\x1D';
  private INIT = this.ESC + '@';
  private BOLD_ON = this.ESC + 'E' + '\x01';
  private BOLD_OFF = this.ESC + 'E' + '\x00';
  private ALIGN_CENTER = this.ESC + 'a' + '\x01';
  private ALIGN_LEFT = this.ESC + 'a' + '\x00';
  private ALIGN_RIGHT = this.ESC + 'a' + '\x02';
  private DOUBLE_HEIGHT = this.ESC + '!' + '\x10';
  private NORMAL_SIZE = this.ESC + '!' + '\x00';
  private CUT_PAPER = this.GS + 'V' + '\x01'; // Full cut
  private LINE_FEED = '\n';

  constructor(printerIP = '192.168.8.108', proxyPort = 9100) {
    this.printerIP = printerIP;
    this.proxyPort = proxyPort;
  }

  /**
   * Connect to WebSocket proxy server
   */
  async connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `ws://${window.location.hostname}:${this.proxyPort}`;
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
          console.log('✓ Connected to print proxy server');
          resolve(true);
        };
        
        this.ws.onerror = (error) => {
          console.error('✗ WebSocket connection failed:', error);
          reject(new Error('Cannot connect to print server. Make sure proxy is running.'));
        };
        
        this.ws.onclose = () => {
          console.log('Print connection closed');
        };
        
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Send raw ESC/POS data to printer
   */
  async sendToPrinter(data: string): Promise<boolean> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      try {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(data);
        
        this.ws!.send(bytes);
        
        this.ws!.onmessage = (event) => {
          const response = JSON.parse(event.data);
          if (response.success) {
            console.log('✓ Receipt sent to printer');
            resolve(true);
          } else {
            reject(new Error(response.error || 'Print failed'));
          }
        };
        
        setTimeout(() => {
          reject(new Error('Print timeout'));
        }, 5000);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Build ESC/POS receipt data
   */
  buildReceipt(order: Order): string {
    let data = this.INIT;

    // Header
    data += this.ALIGN_CENTER;
    data += this.BOLD_ON + this.DOUBLE_HEIGHT;
    data += '🔥 FLAMES' + this.LINE_FEED;
    data += this.NORMAL_SIZE;
    data += 'BURGERS & MORE' + this.LINE_FEED;
    data += this.BOLD_OFF;
    data += 'Barka, Oman' + this.LINE_FEED;
    data += 'Tel: 92809445' + this.LINE_FEED;
    data += '================================' + this.LINE_FEED;

    // Order info
    data += this.ALIGN_LEFT;
    data += 'Order: ' + order.id + this.LINE_FEED;
    data += 'Date: ' + new Date(order.timestamp).toLocaleString('en-GB') + this.LINE_FEED;
    data += 'Cashier: ' + order.cashier + this.LINE_FEED;
    data += 'Type: ' + order.orderType.toUpperCase();
    if (order.tableNumber) data += ' (Table ' + order.tableNumber + ')';
    data += this.LINE_FEED;
    data += '--------------------------------' + this.LINE_FEED;

    // Items
    order.items.forEach(item => {
      const name = item.product.name.length > 22 
        ? item.product.name.substring(0, 22) + '..' 
        : item.product.name;
      data += item.quantity + 'x ' + name.padEnd(24) + this.LINE_FEED;
      data += this.ALIGN_RIGHT;
      data += 'OMR ' + (item.product.price * item.quantity).toFixed(3) + this.LINE_FEED;
      data += this.ALIGN_LEFT;
    });

    data += '--------------------------------' + this.LINE_FEED;

    // Totals
    data += 'Subtotal'.padEnd(24) + 'OMR ' + order.subtotal.toFixed(3) + this.LINE_FEED;
    
    if (order.tax > 0) {
      data += 'VAT (5%)'.padEnd(24) + 'OMR ' + order.tax.toFixed(3) + this.LINE_FEED;
    }
    
    data += '--------------------------------' + this.LINE_FEED;
    data += this.BOLD_ON;
    data += 'TOTAL'.padEnd(23) + 'OMR ' + order.total.toFixed(3) + this.LINE_FEED;
    data += this.BOLD_OFF;
    data += '================================' + this.LINE_FEED;

    // Payment details
    data += this.ALIGN_CENTER;
    data += this.BOLD_ON;
    data += 'PAYMENT DETAILS' + this.LINE_FEED;
    data += this.BOLD_OFF;
    data += '--------------------------------' + this.LINE_FEED;
    data += this.ALIGN_LEFT;
    data += 'Method: ' + order.paymentMethod.toUpperCase() + this.LINE_FEED;

    if (order.paymentMethod === 'cash' && order.cashTendered !== undefined) {
      data += '--------------------------------' + this.LINE_FEED;
      data += 'Amount Paid:    OMR ' + order.cashTendered.toFixed(3) + this.LINE_FEED;
      data += 'Total Bill:     OMR ' + order.total.toFixed(3) + this.LINE_FEED;
      
      if (order.change !== undefined && order.change > 0) {
        data += '--------------------------------' + this.LINE_FEED;
        data += this.BOLD_ON;
        data += '*** CHANGE DUE ***  OMR ' + order.change.toFixed(3) + this.LINE_FEED;
        data += this.BOLD_OFF;
        data += '--------------------------------' + this.LINE_FEED;
      }
    }

    // Footer
    data += this.LINE_FEED;
    data += this.LINE_FEED;
    data += this.ALIGN_CENTER;
    data += 'Thank you for choosing Flames! 🔥' + this.LINE_FEED;
    data += 'Follow us: @flames.om' + this.LINE_FEED;
    data += 'instagram.com/flames.om' + this.LINE_FEED;
    data += 'Please come again!' + this.LINE_FEED;
    data += this.LINE_FEED;
    data += this.LINE_FEED;
    
    // CRITICAL: Paper cut command (forces immediate print and cut)
    data += this.CUT_PAPER;

    return data;
  }

  /**
   * Build kitchen ticket (no prices)
   */
  buildKitchenTicket(order: Order): string {
    let data = this.INIT;

    data += this.ALIGN_CENTER;
    data += this.BOLD_ON + this.DOUBLE_HEIGHT;
    data += '🔥 KITCHEN ORDER' + this.LINE_FEED;
    data += this.NORMAL_SIZE + this.BOLD_OFF;
    data += '================================' + this.LINE_FEED;
    data += this.ALIGN_LEFT;
    data += 'Order: ' + order.id + this.LINE_FEED;
    data += 'Time: ' + new Date(order.timestamp).toLocaleTimeString('en-GB') + this.LINE_FEED;
    data += 'Type: ' + order.orderType.toUpperCase();
    if (order.tableNumber) data += ' | Table ' + order.tableNumber;
    data += this.LINE_FEED;
    data += '--------------------------------' + this.LINE_FEED;

    order.items.forEach(item => {
      data += this.LINE_FEED;
      data += this.BOLD_ON;
      data += '[' + item.quantity + 'x] ' + item.product.name.toUpperCase() + this.LINE_FEED;
      data += this.BOLD_OFF;
      if (item.notes) {
        data += '   NOTE: ' + item.notes + this.LINE_FEED;
      }
    });

    data += this.LINE_FEED;
    data += '================================' + this.LINE_FEED;
    data += this.LINE_FEED;
    data += this.LINE_FEED;
    
    // Paper cut
    data += this.CUT_PAPER;

    return data;
  }

  /**
   * Print receipt directly (no dialog!)
   */
  async printReceipt(order: Order, type: 'customer' | 'kitchen' = 'customer'): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🖨️ Starting direct print...');
      
      await this.connect();
      
      const data = type === 'kitchen' 
        ? this.buildKitchenTicket(order)
        : this.buildReceipt(order);
      
      await this.sendToPrinter(data);
      
      console.log('✓ Print completed successfully');
      return { success: true, message: 'Receipt printed' };
      
    } catch (error) {
      console.error('✗ Print failed:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Test print
   */
  async testPrint(): Promise<{ success: boolean; message: string }> {
    const testOrder: Order = {
      id: 'TEST-' + Date.now(),
      items: [
        { quantity: 1, product: { id: 'test', name: 'Test Item', description: '', price: 1.000, category: 'test', emoji: '🧪', color: 'from-gray-400 to-gray-600', available: true } }
      ],
      subtotal: 1.000,
      tax: 0.050,
      total: 1.050,
      paymentMethod: 'cash',
      cashier: 'Test',
      timestamp: Date.now(),
      orderType: 'takeaway',
      status: 'completed'
    };

    return await this.printReceipt(testOrder, 'customer');
  }

  /**
   * Disconnect
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Singleton instance
export const epsonPrinter = new EpsonDirectPrint();

export default EpsonDirectPrint;
