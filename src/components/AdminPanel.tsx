import { useState } from 'react';
import { useStore, StaffMember, defaultPermissions, StaffPermissions } from '../store/store';
import { menuItems, getEffectiveMenu, categories, MenuItem } from '../data/menu';
import { syncPendingEmails, printReceipt, queueEmailForOrder } from '../utils/syncService';
import { compressImage } from '../utils/imageUtils';
import toast from 'react-hot-toast';

type AdminTab = 'dashboard' | 'staff' | 'orders' | 'menu' | 'settings';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const { currentUser } = useStore();

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'staff' as const, label: 'Staff', icon: 'fa-users', requires: 'canManageStaff' as keyof StaffPermissions },
    { id: 'orders' as const, label: 'Orders', icon: 'fa-receipt', requires: 'canViewAllOrders' as keyof StaffPermissions },
    { id: 'menu' as const, label: 'Menu', icon: 'fa-burger', requires: 'canEditMenu' as keyof StaffPermissions },
    { id: 'settings' as const, label: 'Settings', icon: 'fa-envelope', requires: 'canManageStaff' as keyof StaffPermissions },
  ].filter(tab => !tab.requires || (currentUser?.permissions[tab.requires]));

  return (
    <div className="h-full flex flex-col">
      {/* Admin Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 flex gap-1 overflow-x-auto shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <i className={`fas ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'staff' && <StaffManager />}
        {activeTab === 'orders' && <OrderHistory />}
        {activeTab === 'menu' && <MenuManager />}
        {activeTab === 'settings' && <SettingsPanel />}
      </div>
    </div>
  );
}

// Dashboard
function Dashboard() {
  const { orders } = useStore();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayOrders = orders.filter(o => o.timestamp >= today.getTime() && o.status === 'completed');
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.filter(o => o.status === 'completed');
  const totalRevenue = totalOrders.reduce((sum, o) => sum + o.total, 0);
  
  // Top selling items
  const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
  totalOrders.forEach(order => {
    order.items.forEach(item => {
      if (!itemCounts[item.product.id]) {
        itemCounts[item.product.id] = { name: item.product.name, count: 0, revenue: 0 };
      }
      itemCounts[item.product.id].count += item.quantity;
      itemCounts[item.product.id].revenue += item.product.price * item.quantity;
    });
  });
  const topItems = Object.values(itemCounts).sort((a, b) => b.count - a.count).slice(0, 5);

  // Payment breakdown
  const paymentBreakdown = totalOrders.reduce((acc, o) => {
    acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Order type breakdown
  const orderTypeBreakdown = totalOrders.reduce((acc, o) => {
    acc[o.orderType] = (acc[o.orderType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Today's Orders" value={todayOrders.length.toString()} icon="fa-shopping-bag" color="blue" />
        <StatCard title="Today's Revenue" value={`OMR ${todayRevenue.toFixed(3)}`} icon="fa-coins" color="green" />
        <StatCard title="Total Orders" value={totalOrders.length.toString()} icon="fa-receipt" color="purple" />
        <StatCard title="Total Revenue" value={`OMR ${totalRevenue.toFixed(3)}`} icon="fa-chart-line" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Selling Items */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h3 className="font-bold text-sm text-gray-800 mb-3">
            <i className="fas fa-fire text-orange-500 mr-1"></i> Top Selling Items
          </h3>
          {topItems.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">No sales data yet</p>
          ) : (
            <div className="space-y-2">
              {topItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-xs font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-800">{item.count} sold</p>
                    <p className="text-[10px] text-gray-400">OMR {item.revenue.toFixed(3)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment & Order Types */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h3 className="font-bold text-sm text-gray-800 mb-3">
              <i className="fas fa-credit-card text-blue-500 mr-1"></i> Payment Methods
            </h3>
            {Object.keys(paymentBreakdown).length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No data yet</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(paymentBreakdown).map(([method, count]) => (
                  <div key={method} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 capitalize">{method}</span>
                    <span className="text-xs font-bold text-gray-800">{count} orders</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h3 className="font-bold text-sm text-gray-800 mb-3">
              <i className="fas fa-utensils text-green-500 mr-1"></i> Order Types
            </h3>
            {Object.keys(orderTypeBreakdown).length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No data yet</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(orderTypeBreakdown).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 capitalize">{type === 'dine-in' ? 'Dine In' : type}</span>
                    <span className="text-xs font-bold text-gray-800">{count} orders</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <div className={`w-8 h-8 rounded-lg ${colors[color]} flex items-center justify-center mb-2`}>
        <i className={`fas ${icon} text-sm`}></i>
      </div>
      <p className="text-lg font-black text-gray-900">{value}</p>
      <p className="text-[10px] text-gray-400 font-medium">{title}</p>
    </div>
  );
}

// Staff Manager
function StaffManager() {
  const { staff, addStaff, updateStaff, removeStaff, currentUser } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    pin: '',
    role: 'cashier' as StaffMember['role'],
    active: true,
    permissions: { ...defaultPermissions.cashier },
  });

  const handleSave = () => {
    if (!formData.name || !formData.pin) {
      toast.error('Name and PIN are required');
      return;
    }
    if (formData.pin.length < 4) {
      toast.error('PIN must be at least 4 digits');
      return;
    }
    // Check for duplicate PIN
    const duplicate = staff.find(s => s.pin === formData.pin && s.id !== editingStaff?.id);
    if (duplicate) {
      toast.error('This PIN is already in use');
      return;
    }

    if (editingStaff) {
      updateStaff(editingStaff.id, formData);
      toast.success('Staff updated!');
    } else {
      addStaff(formData);
      toast.success('Staff added!');
    }
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingStaff(null);
    setFormData({ name: '', pin: '', role: 'cashier', active: true, permissions: { ...defaultPermissions.cashier } });
  };

  const handleEdit = (member: StaffMember) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      pin: member.pin,
      role: member.role,
      active: member.active,
      permissions: { ...member.permissions },
    });
    setShowForm(true);
  };

  const handleRoleChange = (role: StaffMember['role']) => {
    setFormData({ ...formData, role, permissions: { ...defaultPermissions[role] } });
  };

  const handlePermissionToggle = (key: keyof StaffPermissions) => {
    setFormData({
      ...formData,
      permissions: { ...formData.permissions, [key]: !formData.permissions[key] },
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-800">Staff Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-200 hover:shadow-lg"
        >
          <i className="fas fa-plus mr-1"></i> Add Staff
        </button>
      </div>

      {/* Staff List */}
      <div className="grid gap-2">
        {staff.map(member => (
          <div key={member.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                member.role === 'admin' ? 'bg-red-500' :
                member.role === 'manager' ? 'bg-purple-500' :
                member.role === 'cashier' ? 'bg-blue-500' : 'bg-gray-500'
              }`}>
                {member.name[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{member.name}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    member.role === 'admin' ? 'bg-red-100 text-red-600' :
                    member.role === 'manager' ? 'bg-purple-100 text-purple-600' :
                    member.role === 'cashier' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>{member.role}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    member.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>{member.active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleEdit(member)}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-500"
              >
                <i className="fas fa-pen text-xs"></i>
              </button>
              {member.id !== currentUser?.id && (
                <button
                  onClick={() => {
                    if (confirm('Remove this staff member?')) {
                      removeStaff(member.id);
                      toast.success('Staff removed');
                    }
                  }}
                  className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500"
                >
                  <i className="fas fa-trash text-xs"></i>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-bold text-gray-900">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h3>
              <button onClick={resetForm} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Staff name"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">PIN Code</label>
                  <input
                    type="text"
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    placeholder="4-6 digit PIN"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1.5 block">Role</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['admin', 'manager', 'cashier', 'kitchen'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      className={`py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                        formData.role === role
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-xs font-bold text-gray-700">Account Active</span>
                <button
                  onClick={() => setFormData({ ...formData, active: !formData.active })}
                  className={`w-10 h-5 rounded-full transition-all ${formData.active ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.active ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                </button>
              </div>

              {/* Permissions */}
              <div>
                <label className="text-xs font-bold text-gray-700 mb-2 block">Permissions</label>
                <div className="space-y-1.5">
                  {(Object.entries(formData.permissions) as [keyof StaffPermissions, boolean][]).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <span className="text-xs text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace('can', '').trim()}
                      </span>
                      <button
                        onClick={() => handlePermissionToggle(key)}
                        className={`w-9 h-5 rounded-full transition-all ${value ? 'bg-orange-500' : 'bg-gray-300'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm shadow-lg shadow-orange-200"
              >
                <i className="fas fa-save mr-2"></i>
                {editingStaff ? 'Update Staff' : 'Add Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Order History
function OrderHistory() {
  const { orders, refundOrder } = useStore();
  const [filter, setFilter] = useState<'all' | 'today' | 'completed' | 'refunded'>('all');

  const filteredOrders = orders.filter(order => {
    if (filter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return order.timestamp >= today.getTime();
    }
    if (filter === 'completed') return order.status === 'completed';
    if (filter === 'refunded') return order.status === 'refunded';
    return true;
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-bold text-gray-800">Order History</h2>
        <div className="flex gap-1">
          {(['all', 'today', 'completed', 'refunded'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === f ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <i className="fas fa-receipt text-4xl mb-3"></i>
          <p className="text-sm font-medium">No orders found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredOrders.map(order => (
            <div key={order.id} className={`bg-white rounded-xl p-4 border ${
              order.status === 'refunded' ? 'border-red-200 bg-red-50/50' : 'border-gray-100'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-gray-800">{order.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    order.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>{order.status}</span>
                </div>
                <span className="text-xs font-bold text-orange-600">OMR {order.total.toFixed(3)}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <div className="flex items-center gap-3">
                  <span><i className="fas fa-clock mr-1"></i>{new Date(order.timestamp).toLocaleString()}</span>
                  <span><i className="fas fa-user mr-1"></i>{order.cashier}</span>
                  <span className="capitalize"><i className="fas fa-tag mr-1"></i>{order.orderType}</span>
                  <span><i className="fas fa-credit-card mr-1"></i>{order.paymentMethod}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => printReceipt(order, 'customer')}
                    className="px-2 py-1 rounded-lg bg-blue-100 text-blue-600 text-[10px] font-bold hover:bg-blue-200"
                    title="Print receipt"
                  >
                    <i className="fas fa-print"></i>
                  </button>
                  <button
                    onClick={() => printReceipt(order, 'kitchen')}
                    className="px-2 py-1 rounded-lg bg-amber-100 text-amber-600 text-[10px] font-bold hover:bg-amber-200"
                    title="Print kitchen copy"
                  >
                    <i className="fas fa-utensils"></i>
                  </button>
                  <button
                    onClick={() => {
                      queueEmailForOrder(order);
                      toast.success('Receipt queued for email');
                    }}
                    className="px-2 py-1 rounded-lg bg-purple-100 text-purple-600 text-[10px] font-bold hover:bg-purple-200"
                    title="Email receipt"
                  >
                    <i className="fas fa-envelope"></i>
                  </button>
                  {order.status === 'completed' && (
                    <button
                      onClick={() => {
                        if (confirm('Refund this order?')) {
                          refundOrder(order.id);
                          toast.success('Order refunded');
                        }
                      }}
                      className="px-2 py-1 rounded-lg bg-red-100 text-red-600 text-[10px] font-bold hover:bg-red-200"
                    >
                      <i className="fas fa-undo mr-1"></i>Refund
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {order.items.map((item, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {item.quantity}x {item.product.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Menu Manager
function MenuManager() {
  const { menuOverrides, toggleMenuItem, customImages, setCustomImage, removeCustomImage, customMenuItems, removedMenuItems, addMenuItem, removeMenuItem, restoreMenuItem } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);

  const effectiveMenu = getEffectiveMenu(customMenuItems, removedMenuItems);
  const filteredItems = effectiveMenu.filter(item => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof effectiveMenu>);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-bold text-gray-800">Menu Management</h2>
          <p className="text-xs text-gray-400">Add, remove, or toggle item availability</p>
        </div>
        <button
          onClick={() => setShowAddItem(true)}
          className="px-4 py-2 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-all shadow-md"
        >
          <i className="fas fa-plus mr-1"></i> Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm flex-1 min-w-[200px]"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
        >
          <option value="all">All Categories</option>
          <option value="burgers">Burgers</option>
          <option value="sandwiches">Sandwiches</option>
          <option value="sliders">Sliders</option>
          <option value="appetizers">Appetizers</option>
          <option value="pasta">Pasta</option>
          <option value="mishkak">Mishkak</option>
          <option value="salads">Salads</option>
          <option value="fries">French Fries</option>
          <option value="gathering">Gathering Box</option>
          <option value="drinks">Drinks</option>
          <option value="extras">Extras</option>
        </select>
      </div>

      {/* Menu Items */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 capitalize">{category}</h3>
            <div className="grid gap-1.5">
              {items.map(item => {
                const isAvailable = menuOverrides[item.id] === undefined ? item.available : !menuOverrides[item.id];
                return (
                  <div key={item.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isAvailable ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}>
                    <div className="flex items-center gap-3">
                      {customImages[item.id] ? (
                        <img 
                          src={customImages[item.id]} 
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover cursor-pointer hover:opacity-80"
                          onClick={() => setEditingImage(item.id)}
                        />
                      ) : (
                        <div 
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-sm cursor-pointer hover:opacity-80`}
                          onClick={() => setEditingImage(item.id)}
                        >
                          {item.emoji}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-gray-800">{item.name}</p>
                        <p className="text-[10px] text-gray-400">OMR {item.price.toFixed(3)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingImage(item.id)}
                        className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                        title="Edit image"
                      >
                        <i className="fas fa-image"></i>
                      </button>
                      <button
                        onClick={() => toggleMenuItem(item.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          isAvailable
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        <i className={`fas ${isAvailable ? 'fa-eye' : 'fa-eye-slash'} mr-1`}></i>
                        {isAvailable ? 'Available' : 'Hidden'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${item.name}" from the menu?`)) {
                            removeMenuItem(item.id);
                            toast.success('Item removed from menu');
                          }
                        }}
                        className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                        title="Remove item"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Removed Items Section */}
      {removedMenuItems.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200">
          <h3 className="text-xs font-bold text-red-700 uppercase mb-3 flex items-center gap-2">
            <i className="fas fa-trash"></i>
            Removed Items ({removedMenuItems.length})
          </h3>
          <div className="grid gap-1.5">
            {removedMenuItems.map(itemId => {
              const item = menuItems.find(i => i.id === itemId);
              if (!item) return null;
              return (
                <div key={itemId} className="flex items-center justify-between p-2 rounded-lg bg-white border border-red-100 opacity-70">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded bg-gradient-to-br ${item.color} flex items-center justify-center text-xs`}>
                      {item.emoji}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700">{item.name}</p>
                      <p className="text-[10px] text-gray-400">OMR {item.price.toFixed(3)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      restoreMenuItem(itemId);
                      toast.success('Item restored to menu');
                    }}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-green-100 text-green-600 hover:bg-green-200 transition-all"
                  >
                    <i className="fas fa-undo mr-1"></i> Restore
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Image Editing Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-gray-800">Edit Item Image</h3>
              <button
                onClick={() => setEditingImage(null)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>

            {(() => {
              const item = effectiveMenu.find(i => i.id === editingImage);
              if (!item) return null;

              return (
                <>
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-700 mb-2">{item.name}</p>
                    <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                      {customImages[item.id] ? (
                        <img 
                          src={customImages[item.id]} 
                          alt={item.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      ) : (
                        <div className={`w-24 h-24 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-4xl`}>
                          {item.emoji}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block">
                      <div className="w-full py-3 rounded-lg bg-blue-500 text-white font-bold text-xs text-center cursor-pointer hover:bg-blue-600 transition-all">
                        <i className="fas fa-upload mr-2"></i>
                        {uploading ? 'Uploading...' : 'Upload New Image'}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          if (file.size > 5 * 1024 * 1024) {
                            toast.error('Image too large. Max 5MB');
                            return;
                          }

                          setUploading(true);
                          try {
                            const compressed = await compressImage(file, 400, 0.7);
                            setCustomImage(item.id, compressed);
                            toast.success('Image updated!');
                          } catch (err) {
                            toast.error('Failed to upload image');
                          } finally {
                            setUploading(false);
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>

                    {customImages[item.id] && (
                      <button
                        onClick={() => {
                          removeCustomImage(item.id);
                          toast.success('Image removed');
                        }}
                        className="w-full py-2.5 rounded-lg bg-red-100 text-red-600 font-bold text-xs hover:bg-red-200 transition-all"
                      >
                        <i className="fas fa-trash mr-2"></i>
                        Remove Custom Image
                      </button>
                    )}

                    <button
                      onClick={() => setEditingImage(null)}
                      className="w-full py-2.5 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && (
        <AddItemModal 
          onClose={() => setShowAddItem(false)}
          onAdd={(item) => {
            addMenuItem(item);
            toast.success('Item added to menu');
            setShowAddItem(false);
          }}
        />
      )}
    </div>
  );
}

// Add Item Modal Component
function AddItemModal({ onClose, onAdd }: { onClose: () => void; onAdd: (item: MenuItem) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'burgers',
    emoji: '🍔',
    color: 'from-orange-400 to-red-500',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.price) {
      toast.error('Name and price are required');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Invalid price');
      return;
    }

    const newItem: MenuItem = {
      id: `custom-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: price,
      category: formData.category,
      emoji: formData.emoji,
      color: formData.color,
      available: true,
    };

    onAdd(newItem);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-5 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-gray-800">Add New Menu Item</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200"
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Spicy Chicken Burger"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Item description..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">Price (OMR) *</label>
            <input
              type="number"
              step="0.001"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="e.g., 2.500"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
            >
              {categories.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1 block">Emoji</label>
              <input
                type="text"
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                placeholder="🍔"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm text-center text-2xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1 block">Color</label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
              >
                <option value="from-orange-400 to-red-500">Orange-Red</option>
                <option value="from-yellow-400 to-orange-500">Yellow-Orange</option>
                <option value="from-green-400 to-green-600">Green</option>
                <option value="from-blue-400 to-blue-600">Blue</option>
                <option value="from-purple-400 to-purple-600">Purple</option>
                <option value="from-pink-400 to-pink-600">Pink</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
            <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${formData.color} flex items-center justify-center text-3xl`}>
              {formData.emoji}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-lg bg-green-500 text-white font-bold text-xs hover:bg-green-600 transition-all"
            >
              <i className="fas fa-plus mr-1"></i> Add Item
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Panel (Email & Sync)
function SettingsPanel() {
  const { emailConfig, updateEmailConfig, pendingEmails, clearSentEmails, removePendingEmail, paymentMethods, addPaymentMethod, updatePaymentMethod, removePaymentMethod, togglePaymentMethod } = useStore();
  const [localConfig, setLocalConfig] = useState(emailConfig);
  const [syncing, setSyncing] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({ name: '', icon: 'fa-money-bill-wave', color: 'blue' });

  const handleSave = () => {
    updateEmailConfig(localConfig);
    toast.success('Settings saved!');
  };

  const pendingCount = pendingEmails.filter(e => e.status === 'pending' || e.status === 'failed').length;
  const sentCount = pendingEmails.filter(e => e.status === 'sent').length;

  const handleManualSync = async () => {
    if (!navigator.onLine) {
      toast.error('You are offline. Emails will sync automatically when connected.');
      return;
    }
    setSyncing(true);
    const result = await syncPendingEmails();
    setSyncing(false);
    if (result.sent > 0) {
      toast.success(`Synced ${result.sent} email(s)!`);
    } else {
      toast('No emails to sync');
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-3xl">
      <h2 className="font-bold text-gray-800">Email & Sync Settings</h2>

      {/* Email Configuration */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
        <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
          <i className="fas fa-envelope text-purple-500"></i>
          Email Receipts
        </h3>

        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <div>
            <p className="text-xs font-bold text-gray-700">Enable Email Sync</p>
            <p className="text-[10px] text-gray-400">Automatically email receipts to configured address</p>
          </div>
          <button
            onClick={() => setLocalConfig({ ...localConfig, enabled: !localConfig.enabled })}
            className={`w-10 h-5 rounded-full transition-all ${localConfig.enabled ? 'bg-purple-500' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${localConfig.enabled ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
          </button>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">Recipient Email</label>
          <input
            type="email"
            value={localConfig.recipientEmail}
            onChange={(e) => setLocalConfig({ ...localConfig, recipientEmail: e.target.value })}
            placeholder="orders@flames.om"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <div>
            <p className="text-xs font-bold text-gray-700">Auto-sync When Online</p>
            <p className="text-[10px] text-gray-400">Automatically send queued emails when internet returns</p>
          </div>
          <button
            onClick={() => setLocalConfig({ ...localConfig, autoSyncOnConnect: !localConfig.autoSyncOnConnect })}
            className={`w-10 h-5 rounded-full transition-all ${localConfig.autoSyncOnConnect ? 'bg-purple-500' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${localConfig.autoSyncOnConnect ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-sm shadow-md"
        >
          <i className="fas fa-save mr-1"></i> Save Settings
        </button>
      </div>

      {/* Branch Info */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
        <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
          <i className="fas fa-store text-orange-500"></i>
          Branch Info (Shown on Receipts)
        </h3>

        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">Branch Name</label>
          <input
            type="text"
            value={localConfig.branchName}
            onChange={(e) => setLocalConfig({ ...localConfig, branchName: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">Address</label>
            <input
              type="text"
              value={localConfig.branchAddress}
              onChange={(e) => setLocalConfig({ ...localConfig, branchAddress: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">Phone</label>
            <input
              type="text"
              value={localConfig.branchPhone}
              onChange={(e) => setLocalConfig({ ...localConfig, branchPhone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Sync Queue */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
            <i className="fas fa-sync-alt text-blue-500"></i>
            Email Queue
          </h3>
          <button
            onClick={handleManualSync}
            disabled={syncing || pendingCount === 0}
            className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-bold disabled:opacity-40 hover:bg-blue-600"
          >
            {syncing ? (
              <><i className="fas fa-spinner fa-spin mr-1"></i> Syncing...</>
            ) : (
              <><i className="fas fa-sync mr-1"></i> Sync Now</>
            )}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="p-2 rounded-lg bg-yellow-50 text-center">
            <p className="text-lg font-black text-yellow-600">{pendingCount}</p>
            <p className="text-[10px] text-yellow-600">Pending</p>
          </div>
          <div className="p-2 rounded-lg bg-green-50 text-center">
            <p className="text-lg font-black text-green-600">{sentCount}</p>
            <p className="text-[10px] text-green-600">Sent</p>
          </div>
          <div className="p-2 rounded-lg bg-red-50 text-center">
            <p className="text-lg font-black text-red-600">{pendingEmails.filter(e => e.status === 'failed').length}</p>
            <p className="text-[10px] text-red-600">Failed</p>
          </div>
        </div>

        {pendingEmails.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No emails in queue</p>
        ) : (
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {pendingEmails.slice().reverse().map(email => (
              <div key={email.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    email.status === 'sent' ? 'bg-green-500' :
                    email.status === 'pending' ? 'bg-yellow-500' :
                    email.status === 'sending' ? 'bg-blue-500 animate-pulse' :
                    'bg-red-500'
                  }`}></span>
                  <span className="font-mono text-gray-700">{email.orderId}</span>
                  <span className="text-gray-400 capitalize">{email.status}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-400">
                    {new Date(email.createdAt).toLocaleTimeString()}
                  </span>
                  {email.status === 'sent' && (
                    <button
                      onClick={() => removePendingEmail(email.id)}
                      className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500"
                    >
                      <i className="fas fa-times text-[8px]"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {sentCount > 0 && (
          <button
            onClick={() => {
              clearSentEmails();
              toast.success('Cleared sent emails');
            }}
            className="mt-2 w-full py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200"
          >
            <i className="fas fa-trash mr-1"></i> Clear Sent Emails
          </button>
        )}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
            <i className="fas fa-credit-card text-green-500"></i>
            Payment Methods
          </h3>
          <button
            onClick={() => setShowAddPayment(true)}
            className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600"
          >
            <i className="fas fa-plus mr-1"></i> Add
          </button>
        </div>

        <div className="space-y-2">
          {paymentMethods.sort((a, b) => a.sortOrder - b.sortOrder).map(method => (
            <div key={method.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <i className={`fab ${method.icon} text-xl text-gray-600`}></i>
                <div>
                  <p className="text-xs font-bold text-gray-700">{method.name}</p>
                  <p className="text-[10px] text-gray-400">Order: {method.sortOrder}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newOrder = prompt('Enter sort order (1-99):', method.sortOrder.toString());
                    if (newOrder) {
                      updatePaymentMethod(method.id, { sortOrder: parseInt(newOrder) });
                    }
                  }}
                  className="w-7 h-7 rounded bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200"
                  title="Change order"
                >
                  <i className="fas fa-sort text-xs"></i>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${method.name}" payment method?`)) {
                      removePaymentMethod(method.id);
                      toast.success('Payment method deleted');
                    }
                  }}
                  className="w-7 h-7 rounded bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200"
                  title="Delete"
                >
                  <i className="fas fa-trash text-xs"></i>
                </button>
                <button
                  onClick={() => {
                    togglePaymentMethod(method.id);
                    toast.success(`${method.name} ${method.enabled ? 'disabled' : 'enabled'}`);
                  }}
                  className={`w-10 h-5 rounded-full transition-all ${method.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${method.enabled ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Payment Method Modal */}
        {showAddPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-5 max-w-md w-full mx-4">
              <h3 className="font-bold text-sm text-gray-800 mb-4">Add Payment Method</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Name</label>
                  <input
                    type="text"
                    value={newPayment.name}
                    onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
                    placeholder="e.g., Bitcoin, PayPal"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Icon (FontAwesome class)</label>
                  <input
                    type="text"
                    value={newPayment.icon}
                    onChange={(e) => setNewPayment({ ...newPayment, icon: e.target.value })}
                    placeholder="e.g., fa-bitcoin, fa-paypal"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-sm"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Preview: <i className={`fab ${newPayment.icon} text-lg`}></i></p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Color Theme</label>
                  <select
                    value={newPayment.color}
                    onChange={(e) => setNewPayment({ ...newPayment, color: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="yellow">Yellow</option>
                    <option value="red">Red</option>
                    <option value="gray">Gray</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => {
                    if (!newPayment.name.trim()) {
                      toast.error('Please enter a name');
                      return;
                    }
                    const id = newPayment.name.toLowerCase().replace(/\s+/g, '-');
                    addPaymentMethod({
                      id,
                      name: newPayment.name,
                      icon: newPayment.icon,
                      color: newPayment.color,
                      enabled: true,
                      sortOrder: paymentMethods.length + 1,
                    });
                    toast.success('Payment method added');
                    setNewPayment({ name: '', icon: 'fa-money-bill-wave', color: 'blue' });
                    setShowAddPayment(false);
                  }}
                  className="flex-1 py-2 rounded-lg bg-green-500 text-white font-bold text-xs hover:bg-green-600"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddPayment(false);
                    setNewPayment({ name: '', icon: 'fa-money-bill-wave', color: 'blue' });
                  }}
                  className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
