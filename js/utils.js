/**
 * Utility Functions for Sodeep Application
 * Author: Thái Bình Dương
 */

// ========================================
// DOM Utilities
// ========================================

/**
 * Get element by ID with error handling
 * @param {string} id - Element ID
 * @returns {HTMLElement|null}
 */
function getElementById(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with ID '${id}' not found`);
  }
  return element;
}

/**
 * Get elements by selector
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (optional)
 * @returns {NodeList}
 */
function querySelectorAll(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 * Get single element by selector
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (optional)
 * @returns {HTMLElement|null}
 */
function querySelector(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Add event listener with error handling
 * @param {HTMLElement} element - Target element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {boolean|Object} options - Event options
 */
function addEventListener(element, event, handler, options = false) {
  if (element && typeof handler === 'function') {
    element.addEventListener(event, handler, options);
  } else {
    console.warn('Invalid element or handler for event listener');
  }
}

// ========================================
// Local Storage Utilities
// ========================================

/**
 * Save data to localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 * @returns {boolean} - Success status
 */
function saveToStorage(key, data) {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Load data from localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - Parsed data or default value
 */
function loadFromStorage(key, defaultValue = null) {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} - Success status
 */
function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
}

/**
 * Clear all localStorage data
 * @returns {boolean} - Success status
 */
function clearStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

// ========================================
// Date and Time Utilities
// ========================================

/**
 * Format date to Vietnamese locale
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get relative time string (e.g., "2 giờ trước")
 * @param {Date} date - Date object
 * @returns {string} - Relative time string
 */
function getRelativeTime(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Vừa xong';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ngày trước`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} năm trước`;
}

// ========================================
// String Utilities
// ========================================

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} str - Input string
 * @returns {string} - Sanitized string
 */
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

/**
 * Truncate text to specified length
 * @param {string} text - Input text
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix for truncated text
 * @returns {string} - Truncated text
 */
function truncateText(text, maxLength = 100, suffix = '...') {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize first letter of each word
 * @param {string} str - Input string
 * @returns {string} - Capitalized string
 */
function capitalizeWords(str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Generate random ID
 * @param {number} length - ID length
 * @returns {string} - Random ID
 */
function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ========================================
// Copy to Clipboard
// ========================================

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

// ========================================
// Animation Utilities
// ========================================

/**
 * Add animation class and remove it after completion
 * @param {HTMLElement} element - Target element
 * @param {string} animationClass - CSS animation class
 * @param {number} duration - Animation duration in ms
 */
function animateElement(element, animationClass, duration = 300) {
  if (!element) return;
  
  element.classList.add(animationClass);
  
  setTimeout(() => {
    element.classList.remove(animationClass);
  }, duration);
}

/**
 * Fade in element
 * @param {HTMLElement} element - Target element
 * @param {number} duration - Animation duration in ms
 */
function fadeIn(element, duration = 300) {
  if (!element) return;
  
  element.style.opacity = '0';
  element.style.display = 'block';
  
  let start = null;
  
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const opacity = Math.min(progress / duration, 1);
    
    element.style.opacity = opacity;
    
    if (progress < duration) {
      requestAnimationFrame(animate);
    }
  }
  
  requestAnimationFrame(animate);
}

/**
 * Fade out element
 * @param {HTMLElement} element - Target element
 * @param {number} duration - Animation duration in ms
 */
function fadeOut(element, duration = 300) {
  if (!element) return;
  
  let start = null;
  const initialOpacity = parseFloat(getComputedStyle(element).opacity);
  
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const opacity = Math.max(initialOpacity - (progress / duration), 0);
    
    element.style.opacity = opacity;
    
    if (progress < duration) {
      requestAnimationFrame(animate);
    } else {
      element.style.display = 'none';
    }
  }
  
  requestAnimationFrame(animate);
}

// ========================================
// Validation Utilities
// ========================================

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} - Valid status
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 * @param {string} url - URL string
 * @returns {boolean} - Valid status
 */
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if string is empty or whitespace only
 * @param {string} str - Input string
 * @returns {boolean} - Empty status
 */
function isEmpty(str) {
  return !str || str.trim().length === 0;
}

// ========================================
// Debounce and Throttle
// ========================================

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ========================================
// Error Handling
// ========================================

/**
 * Log error with context
 * @param {Error} error - Error object
 * @param {string} context - Error context
 */
function logError(error, context = '') {
  console.error(`[Sodeep Error] ${context}:`, error);
}

/**
 * Handle async errors
 * @param {Promise} promise - Promise to handle
 * @param {string} context - Error context
 * @returns {Promise} - Promise with error handling
 */
function handleAsyncError(promise, context = '') {
  return promise.catch(error => {
    logError(error, context);
    throw error;
  });
}

// ========================================
// Environment Detection
// ========================================

/**
 * Check if running on mobile device
 * @returns {boolean} - Mobile status
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if running on touch device
 * @returns {boolean} - Touch status
 */
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Check if browser supports local storage
 * @returns {boolean} - Support status
 */
function supportsLocalStorage() {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// ========================================
// Export utilities for module usage (if needed)
// ========================================

// If using as ES6 module, uncomment the following:
/*
export {
  getElementById,
  querySelector,
  querySelectorAll,
  addEventListener,
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  clearStorage,
  formatDate,
  getRelativeTime,
  sanitizeHTML,
  truncateText,
  capitalizeWords,
  generateId,
  copyToClipboard,
  animateElement,
  fadeIn,
  fadeOut,
  isValidEmail,
  isValidURL,
  isEmpty,
  debounce,
  throttle,
  logError,
  handleAsyncError,
  isMobile,
  isTouchDevice,
  supportsLocalStorage
};
*/