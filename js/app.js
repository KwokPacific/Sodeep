/**
 * Main Application Logic for Sodeep
 * Author: Thái Bình Dương
 */

// ========================================
// Application State
// ========================================

const SodeepApp = {
  // Configuration
  config: {
    storageKeys: {
      theme: 'sodeep_theme',
      apiKey: 'gemini_api_key',
      history: 'sodeep_quote_history',
      settings: 'sodeep_settings'
    },
    maxHistoryItems: 50,
    toastDuration: 3000,
    animationDuration: 300
  },

  // Application state
  state: {
    currentTheme: 'light',
    isGenerating: false,
    quotes: [],
    history: [],
    settings: {
      autoSave: true,
      showNotifications: true,
      language: 'vi'
    }
  },

  // DOM elements cache
  elements: {},

  // Initialize application
  init() {
    this.cacheElements();
    this.loadSettings();
    this.setupTheme();
    this.bindEvents();
    this.loadHistory();
    this.checkApiConfiguration();
    
    console.log('🌊 Sodeep App initialized successfully');
  },

  // ========================================
  // DOM Element Management
  // ========================================

  cacheElements() {
    const elementIds = [
      'quoteForm', 'style', 'topic', 'generateBtn',
      'resultsSection', 'quotesContainer', 'historyBtn',
      'historyModal', 'modalOverlay', 'modalClose',
      'historyContent', 'clearHistoryBtn', 'themeToggle',
      'toast'
    ];

    elementIds.forEach(id => {
      this.elements[id] = getElementById(id);
      if (!this.elements[id]) {
        console.warn(`Element with ID '${id}' not found`);
      }
    });
  },

  // ========================================
  // Event Binding
  // ========================================

  bindEvents() {
    // Form submission
    if (this.elements.quoteForm) {
      addEventListener(this.elements.quoteForm, 'submit', (e) => {
        e.preventDefault();
        this.handleGenerateQuote();
      });
    }

    // Theme toggle
    if (this.elements.themeToggle) {
      addEventListener(this.elements.themeToggle, 'click', () => {
        this.toggleTheme();
      });
    }

    // History modal
    if (this.elements.historyBtn) {
      addEventListener(this.elements.historyBtn, 'click', () => {
        this.showHistoryModal();
      });
    }

    if (this.elements.modalClose) {
      addEventListener(this.elements.modalClose, 'click', () => {
        this.hideHistoryModal();
      });
    }

    if (this.elements.modalOverlay) {
      addEventListener(this.elements.modalOverlay, 'click', () => {
        this.hideHistoryModal();
      });
    }

    // Clear history
    if (this.elements.clearHistoryBtn) {
      addEventListener(this.elements.clearHistoryBtn, 'click', () => {
        this.clearHistory();
      });
    }

    // Keyboard shortcuts
    addEventListener(document, 'keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Form validation
    const formElements = [this.elements.style, this.elements.topic];
    formElements.forEach(element => {
      if (element) {
        addEventListener(element, 'change', () => {
          this.validateForm();
        });
      }
    });
  },

  // ========================================
  // Theme Management
  // ========================================

  setupTheme() {
    const savedTheme = loadFromStorage(this.config.storageKeys.theme, 'light');
    this.setTheme(savedTheme);
  },

  setTheme(theme) {
    this.state.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update theme toggle icon
    if (this.elements.themeToggle) {
      const icon = this.elements.themeToggle.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }

    // Save theme preference
    saveToStorage(this.config.storageKeys.theme, theme);
  },

  toggleTheme() {
    const newTheme = this.state.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    
    this.showToast(
      newTheme === 'dark' ? 'Đã chuyển sang chế độ tối' : 'Đã chuyển sang chế độ sáng',
      'success'
    );
  },

  // ========================================
  // Settings Management
  // ========================================

  loadSettings() {
    const savedSettings = loadFromStorage(this.config.storageKeys.settings, {});
    this.state.settings = { ...this.state.settings, ...savedSettings };
  },

  saveSettings() {
    saveToStorage(this.config.storageKeys.settings, this.state.settings);
  },

  // ========================================
  // API Configuration
  // ========================================

  checkApiConfiguration() {
    if (!geminiAPI.isConfigured()) {
      this.showApiKeyPrompt();
    }
  },

  showApiKeyPrompt() {
    const apiKey = prompt(
      'Để sử dụng Sodeep, bạn cần nhập API key của Google Gemini.\n\n' +
      'Cách lấy API key:\n' +
      '1. Truy cập https://makersuite.google.com/app/apikey\n' +
      '2. Tạo API key mới\n' +
      '3. Sao chép và dán vào đây\n\n' +
      'Nhập API key:'
    );

    if (apiKey && apiKey.trim()) {
      const cleanApiKey = apiKey.trim();
      if (geminiAPI.validateApiKey(cleanApiKey)) {
        geminiAPI.setApiKey(cleanApiKey);
        saveToStorage(this.config.storageKeys.apiKey, cleanApiKey);
        this.showToast('API key đã được cấu hình thành công!', 'success');
      } else {
        this.showToast('API key không hợp lệ. Vui lòng thử lại.', 'error');
        setTimeout(() => this.showApiKeyPrompt(), 2000);
      }
    }
  },

  // ========================================
  // Form Handling
  // ========================================

  validateForm() {
    const style = this.elements.style?.value;
    const topic = this.elements.topic?.value;
    const isValid = style && topic;
    
    if (this.elements.generateBtn) {
      this.elements.generateBtn.disabled = !isValid || this.state.isGenerating;
    }
    
    return isValid;
  },

  async handleGenerateQuote() {
    if (!this.validateForm() || this.state.isGenerating) {
      return;
    }

    if (!geminiAPI.isConfigured()) {
      this.showApiKeyPrompt();
      return;
    }

    const style = this.elements.style.value;
    const topic = this.elements.topic.value;

    try {
      this.setGeneratingState(true);
      
      const quotes = await geminiAPI.generateQuote(style, topic);
      
      this.displayQuotes(quotes);
      this.addToHistory(quotes);
      this.showToast('Câu nói đã được tạo thành công!', 'success');
      
      // Update usage stats
      geminiAPI.updateUsageStats(true);
      
    } catch (error) {
      console.error('Error generating quote:', error);
      this.showToast(error.message || 'Có lỗi xảy ra khi tạo câu nói. Vui lòng thử lại.', 'error');
      
      // Update usage stats
      geminiAPI.updateUsageStats(false);
    } finally {
      this.setGeneratingState(false);
    }
  },

  setGeneratingState(isGenerating) {
    this.state.isGenerating = isGenerating;
    
    if (this.elements.generateBtn) {
      const button = this.elements.generateBtn;
      const text = button.querySelector('.btn__text');
      const spinner = button.querySelector('.btn__spinner');
      
      button.disabled = isGenerating;
      
      if (isGenerating) {
        button.classList.add('btn--loading');
        if (text) text.style.opacity = '0';
        if (spinner) spinner.style.display = 'block';
      } else {
        button.classList.remove('btn--loading');
        if (text) text.style.opacity = '1';
        if (spinner) spinner.style.display = 'none';
      }
    }
  },

  // ========================================
  // Quote Display
  // ========================================

  displayQuotes(quotes) {
    if (!this.elements.quotesContainer || !this.elements.resultsSection) {
      return;
    }

    this.state.quotes = [quotes];
    
    // Show results section
    this.elements.resultsSection.style.display = 'block';
    fadeIn(this.elements.resultsSection, this.config.animationDuration);
    
    // Clear previous quotes
    this.elements.quotesContainer.innerHTML = '';
    
    // Create quote elements
    const languages = [
      { key: 'vietnamese', label: 'Tiếng Việt', icon: '🇻🇳' },
      { key: 'english', label: 'English', icon: '🇺🇸' },
      { key: 'chinese', label: '中文', icon: '🇨🇳' }
    ];

    languages.forEach((lang, index) => {
      const quoteElement = this.createQuoteElement(quotes, lang);
      this.elements.quotesContainer.appendChild(quoteElement);
      
      // Animate in with delay
      setTimeout(() => {
        animateElement(quoteElement, 'fadeInUp', this.config.animationDuration);
      }, index * 100);
    });

    // Scroll to results
    this.elements.resultsSection.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  },

  createQuoteElement(quotes, language) {
    const quoteDiv = document.createElement('div');
    quoteDiv.className = 'quote';
    
    quoteDiv.innerHTML = `
      <div class="quote__header">
        <span class="quote__language">
          ${language.icon} ${language.label}
        </span>
        <button class="quote__copy" title="Sao chép câu nói" 
                data-text="${sanitizeHTML(quotes[language.key])}">
          <i class="fas fa-copy"></i>
        </button>
      </div>
      <p class="quote__text">${quotes[language.key]}</p>
      <p class="quote__author">${quotes.author}</p>
    `;

    // Add copy functionality
    const copyBtn = quoteDiv.querySelector('.quote__copy');
    if (copyBtn) {
      addEventListener(copyBtn, 'click', async () => {
        const text = copyBtn.getAttribute('data-text');
        const success = await copyToClipboard(text);
        
        if (success) {
          this.showToast('Đã sao chép câu nói!', 'success');
          
          // Visual feedback
          const icon = copyBtn.querySelector('i');
          if (icon) {
            const originalClass = icon.className;
            icon.className = 'fas fa-check';
            setTimeout(() => {
              icon.className = originalClass;
            }, 1000);
          }
        } else {
          this.showToast('Không thể sao chép. Vui lòng thử lại.', 'error');
        }
      });
    }

    return quoteDiv;
  },

  // ========================================
  // History Management
  // ========================================

  loadHistory() {
    this.state.history = loadFromStorage(this.config.storageKeys.history, []);
  },

  saveHistory() {
    // Keep only the latest items
    if (this.state.history.length > this.config.maxHistoryItems) {
      this.state.history = this.state.history.slice(-this.config.maxHistoryItems);
    }
    
    saveToStorage(this.config.storageKeys.history, this.state.history);
  },

  addToHistory(quotes) {
    if (!this.state.settings.autoSave) {
      return;
    }

    const historyItem = {
      ...quotes,
      createdAt: new Date().toISOString()
    };

    this.state.history.unshift(historyItem);
    this.saveHistory();
  },

  showHistoryModal() {
    if (!this.elements.historyModal) {
      return;
    }

    this.renderHistoryContent();
    this.elements.historyModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  },

  hideHistoryModal() {
    if (!this.elements.historyModal) {
      return;
    }

    this.elements.historyModal.classList.remove('show');
    document.body.style.overflow = '';
  },

  renderHistoryContent() {
    if (!this.elements.historyContent) {
      return;
    }

    if (this.state.history.length === 0) {
      this.elements.historyContent.innerHTML = `
        <div class="history__empty">
          <i class="fas fa-history" style="font-size: 3rem; color: var(--color-text-muted); margin-bottom: 1rem;"></i>
          <p>Chưa có câu nói nào trong lịch sử.</p>
          <p>Hãy tạo câu nói đầu tiên của bạn!</p>
        </div>
      `;
      return;
    }

    const historyHTML = this.state.history.map(item => `
      <div class="history__item">
        <div class="history__meta">
          <span class="history__date">${getRelativeTime(new Date(item.createdAt))}</span>
          <span class="history__style">${item.style} • ${item.topic}</span>
        </div>
        <div class="history__quote">${item.vietnamese}</div>
        <div class="history__author">— ${item.author}</div>
      </div>
    `).join('');

    this.elements.historyContent.innerHTML = `<div class="history">${historyHTML}</div>`;
  },

  clearHistory() {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử? Hành động này không thể hoàn tác.')) {
      this.state.history = [];
      saveToStorage(this.config.storageKeys.history, []);
      this.renderHistoryContent();
      this.showToast('Đã xóa lịch sử thành công!', 'success');
    }
  },

  // ========================================
  // Toast Notifications
  // ========================================

  showToast(message, type = 'success') {
    if (!this.elements.toast || !this.state.settings.showNotifications) {
      return;
    }

    const toast = this.elements.toast;
    const messageElement = toast.querySelector('.toast__message');
    const iconElement = toast.querySelector('.toast__icon');

    // Set message
    if (messageElement) {
      messageElement.textContent = message;
    }

    // Set icon based on type
    if (iconElement) {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      };
      iconElement.className = `toast__icon ${icons[type] || icons.success}`;
    }

    // Set type class
    toast.className = `toast ${type}`;
    
    // Show toast
    toast.classList.add('show');

    // Auto hide after duration
    setTimeout(() => {
      toast.classList.remove('show');
    }, this.config.toastDuration);
  },

  // ========================================
  // Keyboard Shortcuts
  // ========================================

  handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + Enter: Generate quote
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      this.handleGenerateQuote();
    }

    // Escape: Close modal
    if (event.key === 'Escape') {
      this.hideHistoryModal();
    }

    // Ctrl/Cmd + H: Show history
    if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
      event.preventDefault();
      this.showHistoryModal();
    }

    // Ctrl/Cmd + D: Toggle theme
    if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
      event.preventDefault();
      this.toggleTheme();
    }
  },

  // ========================================
  // Utility Methods
  // ========================================

  exportHistory() {
    const data = {
      history: this.state.history,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sodeep-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    this.showToast('Đã xuất lịch sử thành công!', 'success');
  },

  async importHistory(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.history && Array.isArray(data.history)) {
        this.state.history = [...data.history, ...this.state.history];
        this.saveHistory();
        this.showToast('Đã nhập lịch sử thành công!', 'success');
      } else {
        throw new Error('Invalid file format');
      }
    } catch (error) {
      this.showToast('Không thể nhập file. Vui lòng kiểm tra định dạng.', 'error');
    }
  }
};

// ========================================
// Application Initialization
// ========================================

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  addEventListener(document, 'DOMContentLoaded', () => {
    SodeepApp.init();
  });
} else {
  SodeepApp.init();
}

// Make app available globally for debugging
if (typeof window !== 'undefined') {
  window.SodeepApp = SodeepApp;
}

// Export for module usage (if needed)
// export { SodeepApp };