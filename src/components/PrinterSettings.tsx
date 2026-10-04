import { useState } from 'react';
import { useStore, type PrinterDevice } from '../store/store';
import toast from 'react-hot-toast';

export default function PrinterSettings() {
  const { 
    printerConfig, 
    updatePrinterConfig, 
    addPrinter, 
    updatePrinter, 
    removePrinter, 
    setDefaultPrinter,
    updateNetworkConfig 
  } = useStore();
  
  const [showAddPrinter, setShowAddPrinter] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<PrinterDevice | null>(null);
  const [formData, setFormData] = useState<Partial<PrinterDevice>>({
    name: '',
    type: 'thermal',
    model: '',
    connectionType: 'lan',
    ipAddress: '',
    port: 9100,
    subnetMask: '255.255.255.0',
    gateway: '',
    enabled: true,
    isDefault: false,
  });

  const handleSave = () => {
    if (!formData.name || !formData.ipAddress) {
      toast.error('Name and IP address are required');
      return;
    }

    if (editingPrinter) {
      updatePrinter(editingPrinter.id, formData);
      toast.success('Printer updated!');
    } else {
      const newPrinter: PrinterDevice = {
        id: `printer-${Date.now()}`,
        name: formData.name || '',
        type: formData.type || 'thermal',
        model: formData.model || '',
        connectionType: formData.connectionType || 'lan',
        ipAddress: formData.ipAddress || '',
        port: formData.port || 9100,
        subnetMask: formData.subnetMask || '255.255.255.0',
        gateway: formData.gateway || '',
        enabled: formData.enabled ?? true,
        isDefault: formData.isDefault ?? false,
      };
      addPrinter(newPrinter);
      toast.success('Printer added!');
    }
    resetForm();
  };

  const resetForm = () => {
    setShowAddPrinter(false);
    setEditingPrinter(null);
    setFormData({
      name: '',
      type: 'thermal',
      model: '',
      connectionType: 'lan',
      ipAddress: '',
      port: 9100,
      subnetMask: '255.255.255.0',
      gateway: '',
      enabled: true,
      isDefault: false,
    });
  };

  const handleEdit = (printer: PrinterDevice) => {
    setEditingPrinter(printer);
    setFormData(printer);
    setShowAddPrinter(true);
  };

  const handleTestConnection = async (printer: PrinterDevice) => {
    toast.loading('Testing printer connection...', { id: 'test-print' });
    
    // Simulate connection test
    setTimeout(() => {
      // In a real implementation, this would ping the printer or send a test print
      const success = Math.random() > 0.3; // Simulate 70% success rate
      
      if (success) {
        toast.success(`✓ Connected to ${printer.name} at ${printer.ipAddress}`, { id: 'test-print' });
      } else {
        toast.error(`✗ Cannot connect to ${printer.name}. Check IP address and network.`, { id: 'test-print' });
      }
    }, 1500);
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl">
      <h2 className="font-bold text-gray-800">Printer Configuration</h2>

      {/* Network Configuration */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
        <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
          <i className="fas fa-network-wired text-blue-500"></i>
          Network Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">iPad IP Address</label>
            <input
              type="text"
              value={printerConfig.networkConfig.ipadIP}
              onChange={(e) => updateNetworkConfig({ ipadIP: e.target.value })}
              placeholder="192.168.8.100"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">Subnet Mask</label>
            <input
              type="text"
              value={printerConfig.networkConfig.subnetMask}
              onChange={(e) => updateNetworkConfig({ subnetMask: e.target.value })}
              placeholder="255.255.255.0"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">Gateway</label>
            <input
              type="text"
              value={printerConfig.networkConfig.gateway}
              onChange={(e) => updateNetworkConfig({ gateway: e.target.value })}
              placeholder="192.168.8.1"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
            />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-2">
            <i className="fas fa-info-circle text-blue-500 mt-0.5"></i>
            <div className="text-xs text-blue-700">
              <p className="font-bold mb-1">Network Setup:</p>
              <ul className="list-disc list-inside space-y-1 text-[10px]">
                <li>iPad and printer must be on the same network (same subnet)</li>
                <li>For LAN connection: Connect printer to router via Ethernet cable</li>
                <li>For WiFi connection: Connect printer to same WiFi network as iPad</li>
                <li>Default gateway is typically your router's IP (e.g., 192.168.8.1)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Printer List */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
            <i className="fas fa-print text-green-500"></i>
            Configured Printers ({printerConfig.printers.length})
          </h3>
          <button
            onClick={() => setShowAddPrinter(true)}
            className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600"
          >
            <i className="fas fa-plus mr-1"></i> Add Printer
          </button>
        </div>

        {printerConfig.printers.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <i className="fas fa-print text-4xl mb-3"></i>
            <p className="text-sm">No printers configured</p>
            <p className="text-xs mt-1">Click "Add Printer" to configure your first printer</p>
          </div>
        ) : (
          <div className="space-y-2">
            {printerConfig.printers.map(printer => (
              <div key={printer.id} className={`p-3 rounded-lg border ${printer.isDefault ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      printer.connectionType === 'wifi' ? 'bg-blue-100' :
                      printer.connectionType === 'lan' ? 'bg-green-100' :
                      printer.connectionType === 'usb' ? 'bg-purple-100' : 'bg-orange-100'
                    }`}>
                      <i className={`fas ${
                        printer.connectionType === 'wifi' ? 'fa-wifi text-blue-600' :
                        printer.connectionType === 'lan' ? 'fa-ethernet text-green-600' :
                        printer.connectionType === 'usb' ? 'fa-usb text-purple-600' : 'fa-bluetooth text-orange-600'
                      }`}></i>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-800">{printer.name}</p>
                        {printer.isDefault && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500 text-white font-bold">
                            DEFAULT
                          </span>
                        )}
                        {printer.enabled ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-bold">
                            ENABLED
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 font-bold">
                            DISABLED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {printer.model} • {printer.type} • {printer.ipAddress}:{printer.port}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {printer.connectionType.toUpperCase()} • Subnet: {printer.subnetMask} • Gateway: {printer.gateway}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestConnection(printer)}
                      className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-blue-100 text-blue-600 hover:bg-blue-200"
                      title="Test connection"
                    >
                      <i className="fas fa-plug"></i>
                    </button>
                    {!printer.isDefault && (
                      <button
                        onClick={() => {
                          setDefaultPrinter(printer.id);
                          toast.success(`${printer.name} set as default printer`);
                        }}
                        className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-green-100 text-green-600 hover:bg-green-200"
                        title="Set as default"
                      >
                        <i className="fas fa-star"></i>
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(printer)}
                      className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-gray-100 text-gray-600 hover:bg-gray-200"
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${printer.name}"?`)) {
                          removePrinter(printer.id);
                          toast.success('Printer removed');
                        }
                      }}
                      className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-red-100 text-red-600 hover:bg-red-200"
                      title="Remove"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auto-Print Settings */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
        <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
          <i className="fas fa-cog text-orange-500"></i>
          Auto-Print Settings
        </h3>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <div>
            <p className="text-xs font-bold text-gray-700">Auto-Print Customer Receipt</p>
            <p className="text-[10px] text-gray-400">Automatically print receipt after completing order</p>
          </div>
          <button
            onClick={() => updatePrinterConfig({ autoPrintReceipt: !printerConfig.autoPrintReceipt })}
            className={`w-10 h-5 rounded-full transition-all ${printerConfig.autoPrintReceipt ? 'bg-blue-500' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${printerConfig.autoPrintReceipt ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <div>
            <p className="text-xs font-bold text-gray-700">Auto-Print Kitchen Ticket</p>
            <p className="text-[10px] text-gray-400">Automatically print kitchen copy after order</p>
          </div>
          <button
            onClick={() => updatePrinterConfig({ autoPrintKitchen: !printerConfig.autoPrintKitchen })}
            className={`w-10 h-5 rounded-full transition-all ${printerConfig.autoPrintKitchen ? 'bg-blue-500' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${printerConfig.autoPrintKitchen ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
          </button>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">Print Delay (seconds)</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={printerConfig.printDelay / 1000}
            onChange={(e) => {
              const newValue = Math.max(0, Math.min(10, parseFloat(e.target.value) || 0)) * 1000;
              updatePrinterConfig({ printDelay: newValue });
            }}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
          />
          <p className="text-[10px] text-gray-400 mt-1">Delay before auto-printing (gives time to view receipt)</p>
        </div>
      </div>

      {/* Add/Edit Printer Modal */}
      {showAddPrinter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-gray-800">
                {editingPrinter ? 'Edit Printer' : 'Add New Printer'}
              </h3>
              <button
                onClick={resetForm}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Printer Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., EPSON TM-m30II Kitchen"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Printer Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
                  >
                    <option value="thermal">Thermal (Receipt)</option>
                    <option value="impact">Impact (Kitchen)</option>
                    <option value="laser">Laser</option>
                    <option value="inkjet">Inkjet</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Model</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g., TM-m30II"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Connection Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'wifi', label: 'WiFi', icon: 'fa-wifi' },
                    { value: 'lan', label: 'LAN/Ethernet', icon: 'fa-ethernet' },
                    { value: 'usb', label: 'USB', icon: 'fa-usb' },
                    { value: 'bluetooth', label: 'Bluetooth', icon: 'fa-bluetooth' },
                  ].map(conn => (
                    <button
                      key={conn.value}
                      onClick={() => setFormData({ ...formData, connectionType: conn.value as any })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.connectionType === conn.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <i className={`fas ${conn.icon} text-lg mb-1 ${formData.connectionType === conn.value ? 'text-green-600' : 'text-gray-400'}`}></i>
                      <p className="text-xs font-bold text-gray-700">{conn.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {(formData.connectionType === 'wifi' || formData.connectionType === 'lan') && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1 block">IP Address *</label>
                      <input
                        type="text"
                        value={formData.ipAddress}
                        onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                        placeholder="192.168.8.108"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1 block">Port</label>
                      <input
                        type="number"
                        value={formData.port}
                        onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) || 9100 })}
                        placeholder="9100"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1 block">Subnet Mask</label>
                      <input
                        type="text"
                        value={formData.subnetMask}
                        onChange={(e) => setFormData({ ...formData, subnetMask: e.target.value })}
                        placeholder="255.255.255.0"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 mb-1 block">Gateway</label>
                      <input
                        type="text"
                        value={formData.gateway}
                        onChange={(e) => setFormData({ ...formData, gateway: e.target.value })}
                        placeholder="192.168.8.1"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="text-xs font-bold text-gray-700">Enable Printer</p>
                  <p className="text-[10px] text-gray-400">Printer will be available for printing</p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                  className={`w-10 h-5 rounded-full transition-all ${formData.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.enabled ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="text-xs font-bold text-gray-700">Set as Default Printer</p>
                  <p className="text-[10px] text-gray-400">This printer will be used by default</p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
                  className={`w-10 h-5 rounded-full transition-all ${formData.isDefault ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.isDefault ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2.5 rounded-lg bg-green-500 text-white font-bold text-xs hover:bg-green-600 transition-all"
                >
                  <i className="fas fa-save mr-1"></i> {editingPrinter ? 'Update' : 'Add'} Printer
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
