import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem, EventItem } from '../data/menu';

// Types
export interface CartItem {
  product: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  cashTendered?: number; // Amount of cash given by customer
  change?: number; // Change to return to customer
  cashier: string;
  timestamp: number;
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  tableNumber?: string;
  status: 'completed' | 'refunded';
}

export interface StaffMember {
  id: string;
  name: string;
  pin: string;
  role: 'admin' | 'manager' | 'cashier' | 'kitchen';
  active: boolean;
  permissions: StaffPermissions;
  createdAt: number;
}

export interface StaffPermissions {
  canProcessOrders: boolean;
  canRefund: boolean;
  canViewReports: boolean;
  canManageStaff: boolean;
  canEditMenu: boolean;
  canViewAllOrders: boolean;
  canPrintReceipts: boolean;
  canApplyDiscounts: boolean;
  allowedCategories: string[]; // Empty array = all categories allowed
}

export const defaultPermissions: Record<StaffMember['role'], StaffPermissions> = {
  admin: {
    canProcessOrders: true,
    canRefund: true,
    canViewReports: true,
    canManageStaff: true,
    canEditMenu: true,
    canViewAllOrders: true,
    canPrintReceipts: true,
    canApplyDiscounts: true,
    allowedCategories: [], // Empty = all categories
  },
  manager: {
    canProcessOrders: true,
    canRefund: true,
    canViewReports: true,
    canManageStaff: false,
    canEditMenu: true,
    canViewAllOrders: true,
    canPrintReceipts: true,
    canApplyDiscounts: true,
    allowedCategories: [], // Empty = all categories
  },
  cashier: {
    canProcessOrders: true,
    canRefund: false,
    canViewReports: false,
    canManageStaff: false,
    canEditMenu: false,
    canViewAllOrders: false,
    canPrintReceipts: true,
    canApplyDiscounts: false,
    allowedCategories: [], // Empty = all categories
  },
  kitchen: {
    canProcessOrders: false,
    canRefund: false,
    canViewReports: false,
    canManageStaff: false,
    canEditMenu: false,
    canViewAllOrders: true,
    canPrintReceipts: false,
    canApplyDiscounts: false,
    allowedCategories: [], // Empty = all categories
  },
};

export interface EmailConfig {
  enabled: boolean;
  recipientEmail: string;
  branchName: string;
  branchAddress: string;
  branchPhone: string;
  autoSyncOnConnect: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string; // FontAwesome icon class (e.g. 'fa-money-bill-wave')
  enabled: boolean;
  color: string; // Tailwind color class
  sortOrder: number;
}

export interface PendingEmail {
  id: string;
  orderId: string;
  recipientEmail: string;
  orderData: Order;
  createdAt: number;
  attempts: number;
  lastAttempt?: number;
  status: 'pending' | 'sending' | 'sent' | 'failed';
}

interface AppState {
  // Auth
  currentUser: StaffMember | null;
  isLoggedIn: boolean;
  
  // Cart
  cart: CartItem[];
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  tableNumber: string;
  
  // Orders
  orders: Order[];
  
  // Staff
  staff: StaffMember[];
  
  // Menu overrides (for availability toggling)
  menuOverrides: Record<string, boolean>;
  
  // Email & Sync
  emailConfig: EmailConfig;
  pendingEmails: PendingEmail[];
  
  // Payment Methods
  paymentMethods: PaymentMethod[];
  
  // Custom Menu Images (stored separately to avoid bloating menu data)
  customImages: Record<string, string>; // itemId -> base64 image
  
  // Custom Menu Items (added by admin)
  customMenuItems: MenuItem[];
  
  // Removed Menu Items (hidden by admin)
  removedMenuItems: string[]; // array of item IDs
  
  // Event Items (special packages for events)
  eventItems: EventItem[];
  
  // Actions
  updateEmailConfig: (config: Partial<EmailConfig>) => void;
  addPendingEmail: (email: PendingEmail) => void;
  updatePendingEmail: (id: string, updates: Partial<PendingEmail>) => void;
  removePendingEmail: (id: string) => void;
  clearSentEmails: () => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => void;
  removePaymentMethod: (id: string) => void;
  togglePaymentMethod: (id: string) => void;
  setCustomImage: (itemId: string, imageBase64: string) => void;
  removeCustomImage: (itemId: string) => void;
  addMenuItem: (item: MenuItem) => void;
  removeMenuItem: (itemId: string) => void;
  restoreMenuItem: (itemId: string) => void;
  addEventItem: (item: EventItem) => void;
  updateEventItem: (id: string, updates: Partial<EventItem>) => void;
  removeEventItem: (id: string) => void;
  toggleEventItem: (id: string) => void;
  
  // Actions
  login: (pin: string) => boolean;
  logout: () => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  setOrderType: (type: 'dine-in' | 'takeaway' | 'delivery') => void;
  setTableNumber: (num: string) => void;
  completeOrder: (paymentMethod: string, cashTendered?: number, change?: number) => Order;
  refundOrder: (orderId: string) => void;
  addStaff: (member: Omit<StaffMember, 'id' | 'createdAt'>) => void;
  updateStaff: (id: string, updates: Partial<StaffMember>) => void;
  removeStaff: (id: string) => void;
  toggleMenuItem: (itemId: string) => void;
  getCartSubtotal: () => number;
  getCartTax: () => number;
  getCartTotal: () => number;
  resetData: () => void;
}

// Default admin account
const defaultAdmin: StaffMember = {
  id: 'admin-001',
  name: 'Admin',
  pin: '1234',
  role: 'admin',
  active: true,
  permissions: defaultPermissions.admin,
  createdAt: Date.now(),
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isLoggedIn: false,
      cart: [],
      orderType: 'takeaway',
      tableNumber: '',
      orders: [],
      staff: [defaultAdmin],
      menuOverrides: {},
      emailConfig: {
        enabled: false,
        recipientEmail: '',
        branchName: 'FLAMES BURGERS & MORE',
        branchAddress: 'Barka, Oman',
        branchPhone: '92809445',
        autoSyncOnConnect: true,
      },
      pendingEmails: [],
      paymentMethods: [
        { id: 'cash', name: 'Cash', icon: 'fa-money-bill-wave', enabled: true, color: 'green', sortOrder: 1 },
        { id: 'card', name: 'Card', icon: 'fa-credit-card', enabled: true, color: 'blue', sortOrder: 2 },
        { id: 'applepay', name: 'Apple Pay', icon: 'fa-apple', enabled: true, color: 'gray', sortOrder: 3 },
        { id: 'googlepay', name: 'Google Pay', icon: 'fa-google', enabled: true, color: 'yellow', sortOrder: 4 },
        { id: 'thawani', name: 'Thawani', icon: 'fa-wallet', enabled: true, color: 'purple', sortOrder: 5 },
      ],
      customImages: {},
      customMenuItems: [],
      removedMenuItems: [],
      eventItems: [],

      login: (pin: string) => {
        const state = get();
        const user = state.staff.find(s => s.pin === pin && s.active);
        if (user) {
          set({ currentUser: user, isLoggedIn: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ currentUser: null, isLoggedIn: false, cart: [], orderType: 'takeaway', tableNumber: '' });
      },

      addToCart: (item: MenuItem) => {
        const state = get();
        const existing = state.cart.find(c => c.product.id === item.id);
        if (existing) {
          set({
            cart: state.cart.map(c =>
              c.product.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
            ),
          });
        } else {
          set({ cart: [...state.cart, { product: item, quantity: 1 }] });
        }
      },

      removeFromCart: (itemId: string) => {
        set({ cart: get().cart.filter(c => c.product.id !== itemId) });
      },

      updateCartQuantity: (itemId: string, qty: number) => {
        if (qty <= 0) {
          set({ cart: get().cart.filter(c => c.product.id !== itemId) });
        } else {
          set({
            cart: get().cart.map(c =>
              c.product.id === itemId ? { ...c, quantity: qty } : c
            ),
          });
        }
      },

      clearCart: () => set({ cart: [] }),

      setOrderType: (type) => set({ orderType: type }),
      setTableNumber: (num) => set({ tableNumber: num }),

      completeOrder: (paymentMethod: string, cashTendered?: number, change?: number) => {
        const state = get();
        const subtotal = state.getCartSubtotal();
        const tax = state.getCartTax();
        const total = state.getCartTotal();
        
        const order: Order = {
          id: `FLM-${Date.now().toString(36).toUpperCase()}`,
          items: [...state.cart],
          subtotal,
          tax,
          total,
          paymentMethod,
          cashTendered: paymentMethod === 'cash' ? cashTendered : undefined,
          change: paymentMethod === 'cash' && change ? change : undefined,
          cashier: state.currentUser?.name || 'Unknown',
          timestamp: Date.now(),
          orderType: state.orderType,
          tableNumber: state.tableNumber,
          status: 'completed',
        };

        set({
          orders: [order, ...state.orders],
          cart: [],
          tableNumber: '',
        });

        return order;
      },

      refundOrder: (orderId: string) => {
        set({
          orders: get().orders.map(o =>
            o.id === orderId ? { ...o, status: 'refunded' as const } : o
          ),
        });
      },

      addStaff: (member) => {
        const newMember: StaffMember = {
          ...member,
          id: `staff-${Date.now()}`,
          createdAt: Date.now(),
        };
        set({ staff: [...get().staff, newMember] });
      },

      updateStaff: (id: string, updates: Partial<StaffMember>) => {
        set({
          staff: get().staff.map(s => s.id === id ? { ...s, ...updates } : s),
        });
      },

      removeStaff: (id: string) => {
        set({ staff: get().staff.filter(s => s.id !== id) });
      },

      toggleMenuItem: (itemId: string) => {
        const overrides = { ...get().menuOverrides };
        overrides[itemId] = !overrides[itemId];
        set({ menuOverrides: overrides });
      },

      updateEmailConfig: (config: Partial<EmailConfig>) => {
        set({ emailConfig: { ...get().emailConfig, ...config } });
      },

      addPendingEmail: (email: PendingEmail) => {
        set({ pendingEmails: [...get().pendingEmails, email] });
      },

      updatePendingEmail: (id: string, updates: Partial<PendingEmail>) => {
        set({
          pendingEmails: get().pendingEmails.map(e =>
            e.id === id ? { ...e, ...updates } : e
          ),
        });
      },

      removePendingEmail: (id: string) => {
        set({ pendingEmails: get().pendingEmails.filter(e => e.id !== id) });
      },

      clearSentEmails: () => {
        set({ pendingEmails: get().pendingEmails.filter(e => e.status !== 'sent') });
      },

      addPaymentMethod: (method: PaymentMethod) => {
        set({ paymentMethods: [...get().paymentMethods, method] });
      },

      updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => {
        set({
          paymentMethods: get().paymentMethods.map(pm =>
            pm.id === id ? { ...pm, ...updates } : pm
          ),
        });
      },

      removePaymentMethod: (id: string) => {
        set({ paymentMethods: get().paymentMethods.filter(pm => pm.id !== id) });
      },

      togglePaymentMethod: (id: string) => {
        set({
          paymentMethods: get().paymentMethods.map(pm =>
            pm.id === id ? { ...pm, enabled: !pm.enabled } : pm
          ),
        });
      },

      setCustomImage: (itemId: string, imageBase64: string) => {
        set({
          customImages: { ...get().customImages, [itemId]: imageBase64 },
        });
      },

      removeCustomImage: (itemId: string) => {
        const { [itemId]: _, ...rest } = get().customImages;
        set({ customImages: rest });
      },

      addMenuItem: (item: MenuItem) => {
        set({ customMenuItems: [...get().customMenuItems, item] });
      },

      removeMenuItem: (itemId: string) => {
        set({ removedMenuItems: [...get().removedMenuItems, itemId] });
      },

      restoreMenuItem: (itemId: string) => {
        set({ removedMenuItems: get().removedMenuItems.filter(id => id !== itemId) });
      },

      addEventItem: (item: EventItem) => {
        set({ eventItems: [...get().eventItems, item] });
      },

      updateEventItem: (id: string, updates: Partial<EventItem>) => {
        set({
          eventItems: get().eventItems.map(e =>
            e.id === id ? { ...e, ...updates } : e
          ),
        });
      },

      removeEventItem: (id: string) => {
        set({ eventItems: get().eventItems.filter(e => e.id !== id) });
      },

      toggleEventItem: (id: string) => {
        set({
          eventItems: get().eventItems.map(e =>
            e.id === id ? { ...e, available: !e.available } : e
          ),
        });
      },

      getCartSubtotal: () => {
        return get().cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },

      getCartTax: () => {
        return get().getCartSubtotal() * 0.05; // 5% VAT in Oman
      },

      getCartTotal: () => {
        return get().getCartSubtotal() + get().getCartTax();
      },

      resetData: () => {
        console.log('Store: Resetting all data...');
        // Clear all data from state
        set({
          orders: [],
          pendingEmails: [],
          customImages: {},
          customMenuItems: [],
          removedMenuItems: [],
          menuOverrides: {},
          cart: [],
        });
        console.log('Store: Data reset complete');
      },
    }),
    {
      name: 'flames-epos-storage',
      partialize: (state) => ({
        orders: state.orders,
        staff: state.staff,
        menuOverrides: state.menuOverrides,
        emailConfig: state.emailConfig,
        pendingEmails: state.pendingEmails,
        paymentMethods: state.paymentMethods,
        customImages: state.customImages,
        customMenuItems: state.customMenuItems,
        removedMenuItems: state.removedMenuItems,
        eventItems: state.eventItems,
      }),
    }
  )
);
