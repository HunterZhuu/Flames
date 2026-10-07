/**
 * WebSocket to TCP Proxy Server for Epson POS Printer
 * 
 * This server acts as a bridge between the iPad web app and the Epson printer.
 * It receives WebSocket connections from the iPad and forwards data as raw TCP
 * to the printer on port 9100.
 * 
 * Setup:
 * 1. Install Node.js on your computer/server
 * 2. Run: npm install
 * 3. Run: npm start
 * 4. Keep it running while using the iPad app
 */

const WebSocket = require('ws');
const net = require('net');

// Configuration
const PROXY_PORT = 9100;  // WebSocket proxy port
const PRINTER_IP = '192.168.8.108';  // Your Epson printer IP
const PRINTER_PORT = 9100;  // Standard Epson printer port

console.log('🖨️  Epson Print Proxy Server');
console.log('================================');
console.log(`Proxy Port: ${PROXY_PORT}`);
console.log(`Printer: ${PRINTER_IP}:${PRINTER_PORT}`);
console.log('================================\n');

// Create WebSocket server
const wss = new WebSocket.Server({ port: PROXY_PORT });

wss.on('connection', (ws) => {
  console.log('✓ iPad connected via WebSocket');
  
  // Create TCP connection to printer
  const printerSocket = new net.Socket();
  
  printerSocket.connect(PRINTER_PORT, PRINTER_IP, () => {
    console.log(`✓ Connected to Epson printer at ${PRINTER_IP}:${PRINTER_PORT}`);
    ws.send(JSON.stringify({ success: true, message: 'Connected to printer' }));
  });
  
  printerSocket.on('error', (error) => {
    console.error('✗ Printer connection error:', error.message);
    ws.send(JSON.stringify({ success: false, error: 'Cannot connect to printer' }));
  });
  
  // Forward data from WebSocket to TCP printer
  ws.on('message', (data) => {
    console.log(`📤 Sending ${data.length} bytes to printer...`);
    
    // Convert to Buffer if needed
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    
    printerSocket.write(buffer, (error) => {
      if (error) {
        console.error('✗ Failed to send to printer:', error);
        ws.send(JSON.stringify({ success: false, error: 'Print failed' }));
      } else {
        console.log('✓ Data sent to printer successfully');
        ws.send(JSON.stringify({ success: true, message: 'Printed' }));
      }
    });
  });
  
  // Handle WebSocket close
  ws.on('close', () => {
    console.log('✓ iPad disconnected');
    printerSocket.end();
  });
  
  // Handle printer socket close
  printerSocket.on('close', () => {
    console.log('✓ Printer connection closed');
  });
  
  printerSocket.on('error', (error) => {
    console.error('✗ Printer socket error:', error.message);
  });
});

wss.on('error', (error) => {
  console.error('✗ WebSocket server error:', error.message);
});

console.log(`\n✓ Proxy server listening on port ${PROXY_PORT}`);
console.log('✓ Waiting for iPad connections...\n');

// Handle server shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down proxy server...');
  wss.close();
  process.exit(0);
});
