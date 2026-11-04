// Storage helper for user transactions (bookings & gear orders)
// and admin customizations (adventures, products, stays, price adjustments & booking toggles)
// Guarantees persistence across sessions, both locally and in cloud demo mode

import { fallbackAdventures, fallbackProducts, fallbackStays } from '../data/fallbackData';

const BOOKINGS_KEY = 'wildtrail_user_bookings';
const ORDERS_KEY = 'wildtrail_user_orders';
const OVERRIDES_KEY = 'wildtrail_item_overrides';
const CUSTOM_ADVENTURES_KEY = 'wildtrail_custom_adventures';
const CUSTOM_PRODUCTS_KEY = 'wildtrail_custom_products';
const CUSTOM_STAYS_KEY = 'wildtrail_custom_stays';

export const getLocalBookings = () => {
  try {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveLocalBooking = (booking) => {
  try {
    const existing = getLocalBookings();
    const index = existing.findIndex((b) => b._id === booking._id);
    let updated;
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...updated[index], ...booking };
    } else {
      updated = [booking, ...existing];
    }
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const cancelLocalBooking = (id) => {
  try {
    const existing = getLocalBookings();
    const updated = existing.map((b) =>
      b._id === id ? { ...b, status: 'Cancelled' } : b
    );
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const getLocalOrders = () => {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveLocalOrder = (order) => {
  try {
    const existing = getLocalOrders();
    const index = existing.findIndex((o) => o._id === order._id);
    let updated;
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...updated[index], ...order };
    } else {
      updated = [order, ...existing];
    }
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const mergeRecords = (apiRecords = [], localRecords = []) => {
  const map = new Map();
  (localRecords || []).forEach((item) => {
    if (item && item._id) {
      map.set(item._id, item);
    }
  });
  (apiRecords || []).forEach((item) => {
    if (item && item._id) {
      map.set(item._id, item);
    }
  });
  return Array.from(map.values()).sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });
};

// --- Item Overrides (Price & Booking Enable/Disable) ---
export const getItemOverrides = () => {
  try {
    const data = localStorage.getItem(OVERRIDES_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

export const saveItemOverride = (id, updates) => {
  try {
    const overrides = getItemOverrides();
    overrides[id] = { ...(overrides[id] || {}), ...updates };
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
    return overrides;
  } catch (e) {
    return {};
  }
};

// --- Custom Items (Added by Admin in Every Section) ---
const getCustomList = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const saveCustomItem = (key, item) => {
  try {
    const list = getCustomList(key);
    const index = list.findIndex((i) => i._id === item._id);
    let updated;
    if (index >= 0) {
      updated = [...list];
      updated[index] = { ...updated[index], ...item };
    } else {
      updated = [item, ...list];
    }
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

const removeCustomItem = (key, id) => {
  try {
    const list = getCustomList(key).filter((i) => i._id !== id);
    localStorage.setItem(key, JSON.stringify(list));
    return list;
  } catch (e) {
    return [];
  }
};

export const getCustomAdventures = () => getCustomList(CUSTOM_ADVENTURES_KEY);
export const saveCustomAdventure = (adv) => saveCustomItem(CUSTOM_ADVENTURES_KEY, adv);
export const deleteCustomAdventure = (id) => removeCustomItem(CUSTOM_ADVENTURES_KEY, id);

export const getCustomProducts = () => getCustomList(CUSTOM_PRODUCTS_KEY);
export const saveCustomProduct = (prod) => saveCustomItem(CUSTOM_PRODUCTS_KEY, prod);
export const deleteCustomProduct = (id) => removeCustomItem(CUSTOM_PRODUCTS_KEY, id);

export const getCustomStays = () => getCustomList(CUSTOM_STAYS_KEY);
export const saveCustomStay = (stay) => saveCustomItem(CUSTOM_STAYS_KEY, stay);
export const deleteCustomStay = (id) => removeCustomItem(CUSTOM_STAYS_KEY, id);

// Merged getters applying overrides and custom items
export const getMergedAdventures = (apiList = []) => {
  const overrides = getItemOverrides();
  const custom = getCustomAdventures();
  const map = new Map();

  // 1. Fallback base items
  fallbackAdventures.forEach((item) => map.set(item._id, { ...item }));
  // 2. Custom local additions
  custom.forEach((item) => map.set(item._id, { ...item }));
  // 3. API items if available
  (apiList || []).forEach((item) => {
    if (item && item._id) map.set(item._id, { ...item });
  });

  // Apply overrides
  return Array.from(map.values()).map((item) => {
    if (overrides[item._id]) {
      return { ...item, ...overrides[item._id] };
    }
    return item;
  });
};

export const getMergedProducts = (apiList = []) => {
  const overrides = getItemOverrides();
  const custom = getCustomProducts();
  const map = new Map();

  fallbackProducts.forEach((item) => map.set(item._id, { ...item }));
  custom.forEach((item) => map.set(item._id, { ...item }));
  (apiList || []).forEach((item) => {
    if (item && item._id) map.set(item._id, { ...item });
  });

  return Array.from(map.values()).map((item) => {
    if (overrides[item._id]) {
      return { ...item, ...overrides[item._id] };
    }
    return item;
  });
};

export const getMergedStays = (apiList = []) => {
  const overrides = getItemOverrides();
  const custom = getCustomStays();
  const map = new Map();

  fallbackStays.forEach((item) => map.set(item._id, { ...item }));
  custom.forEach((item) => map.set(item._id, { ...item }));
  (apiList || []).forEach((item) => {
    if (item && item._id) map.set(item._id, { ...item });
  });

  return Array.from(map.values()).map((item) => {
    if (overrides[item._id]) {
      return { ...item, ...overrides[item._id] };
    }
    return item;
  });
};
