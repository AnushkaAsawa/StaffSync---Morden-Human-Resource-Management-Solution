/**
 * StaffSync Localization & Formatting Helpers
 * - INR Currency (₹) with Indian Numbering System
 * - Indian Standard Time (IST - UTC+5:30) date & time formatters
 */

/**
 * Format currency in Indian Rupees (INR ₹) using standard Indian grouping (Lakhs/Crores)
 * e.g., 1650000 -> ₹16,50,000
 */
export const formatINR = (amount: number, compact: boolean = false): string => {
  if (isNaN(amount)) return '₹0';

  if (compact) {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date string or Date object to DD/MM/YYYY in IST (Asia/Kolkata)
 */
export const formatDateIST = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return '—';
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return '—';
  }
};

/**
 * Format date + time in IST e.g. "27/10/2026, 09:30 AM IST"
 */
export const formatDateTimeIST = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return '—';
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const formatted = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
    return `${formatted} IST`;
  } catch {
    return '—';
  }
};

/**
 * Format only time in IST e.g. "09:30:15 AM IST"
 */
export const formatTimeIST = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return '—';
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const formatted = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
    return `${formatted} IST`;
  } catch {
    return '—';
  }
};

/**
 * Returns current IST date in YYYY-MM-DD
 */
export const getTodayISTString = (): string => {
  const d = new Date();
  const istDateString = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
  return istDateString;
};
