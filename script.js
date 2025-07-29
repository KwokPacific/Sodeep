// Sodeep - Quote Generation Application
// Modern JavaScript implementation with Gemini API integration

class SodeepApp {
    constructor() {
        this.apiKey = '';
        this.isLoading = false;
        this.maxChars = 500;
        
        // Initialize app
        this.init();
    }

    init() {
        this.loadStoredSettings();
        this.bindEvents();
        this.updateCharCounter();
        this.checkApiKeyStatus();
    }

    // Event Binding
    bindEvents() {
        // Settings panel events
        document.getElementById('openSettings').addEventListener('click', () => this.openSettings());
        document.getElementById('closeSettings').addEventListener('click', () => this.closeSettings());
        document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
        
        // Password toggle
        document.getElementById('togglePassword').addEventListener('click', () => this.togglePasswordVisibility());
        
        // Form submission
        document.getElementById('quoteForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Copy functionality
        document.getElementById('copyBtn').addEventListener('click', () => this.copyToClipboard());
        
        // Character counter
        document.getElementById('topicInput').addEventListener('input', () => this.updateCharCounter());
        
        // API key input
        document.getElementById('apiKey').addEventListener('input', () => this.validateApiKey());
        
        // Overlay click to close settings
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('overlay')) {
                this.closeSettings();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Form validation on input
        document.getElementById('topicInput').addEventListener('input', () => this.validateForm());
    }

    // Settings Management
    loadStoredSettings() {
        const storedApiKey = localStorage.getItem('sodeep_api_key');
        if (storedApiKey) {
            this.apiKey = storedApiKey;
            document.getElementById('apiKey').value = storedApiKey;
        }
    }

    saveSettings() {
        const apiKeyInput = document.getElementById('apiKey').value.trim();
        
        if (!apiKeyInput) {
            this.showToast('Vui lòng nhập mã truy cập dịch vụ', 'error');
            return;
        }
        
        if (!this.validateApiKeyFormat(apiKeyInput)) {
            this.showToast('Mã truy cập không đúng định dạng', 'error');
            return;
        }
        
        this.apiKey = apiKeyInput;
        localStorage.setItem('sodeep_api_key', apiKeyInput);
        this.closeSettings();
        this.showToast('Đã lưu cài đặt thành công', 'success');
        this.checkApiKeyStatus();
    }

    openSettings() {
        document.body.appendChild(this.createOverlay());
        document.getElementById('settingsPanel').classList.add('active');
        document.getElementById('apiKey').focus();
    }

    closeSettings() {
        document.getElementById('settingsPanel').classList.remove('active');
        const overlay = document.querySelector('.overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'overlay active';
        return overlay;
    }

    togglePasswordVisibility() {
        const apiKeyInput = document.getElementById('apiKey');
        const toggleBtn = document.getElementById('togglePassword');
        const eyeIcon = toggleBtn.querySelector('.eye-icon');
        
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
            eyeIcon.textContent = '🙈';
        } else {
            apiKeyInput.type = 'password';
            eyeIcon.textContent = '👁️';
        }
    }

    // Form Handling
    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (this.isLoading) return;
        
        const topic = document.getElementById('topicInput').value.trim();
        
        if (!this.validateInput(topic)) return;
        if (!this.apiKey) {
            this.showError('Vui lòng cài đặt mã truy cập dịch vụ trước khi sử dụng');
            this.openSettings();
            return;
        }
        
        await this.generateQuote(topic);
    }

    validateInput(topic) {
        if (!topic) {
            this.showError('Vui lòng nhập chủ đề hoặc ý tưởng của bạn');
            return false;
        }
        
        if (topic.length < 10) {
            this.showError('Chủ đề cần ít nhất 10 ký tự để tạo ra quote có ý nghĩa');
            return false;
        }
        
        if (topic.length > this.maxChars) {
            this.showError(`Chủ đề không được vượt quá ${this.maxChars} ký tự`);
            return false;
        }
        
        return true;
    }

    validateForm() {
        const topic = document.getElementById('topicInput').value.trim();
        const generateBtn = document.getElementById('generateBtn');
        
        if (topic.length >= 10 && this.apiKey) {
            generateBtn.disabled = false;
        } else {
            generateBtn.disabled = true;
        }
    }

    validateApiKey() {
        const apiKey = document.getElementById('apiKey').value.trim();
        const saveBtn = document.getElementById('saveSettings');
        
        if (this.validateApiKeyFormat(apiKey)) {
            saveBtn.disabled = false;
        } else {
            saveBtn.disabled = true;
        }
    }

    validateApiKeyFormat(apiKey) {
        // Basic validation for Gemini API key format
        return apiKey && apiKey.length > 20 && apiKey.startsWith('AIzaSy');
    }

    checkApiKeyStatus() {
        const generateBtn = document.getElementById('generateBtn');
        const topicInput = document.getElementById('topicInput');
        
        if (!this.apiKey) {
            generateBtn.disabled = true;
            topicInput.placeholder = 'Vui lòng cài đặt mã truy cập dịch vụ trước khi sử dụng...';
        } else {
            topicInput.placeholder = 'Hãy chia sẻ chủ đề, cảm xúc, hoặc ý tưởng mà bạn muốn biến thành một câu quote ý nghĩa...';
            this.validateForm();
        }
    }

    // Quote Generation
    async generateQuote(topic) {
        this.setLoadingState(true);
        this.hideResults();
        this.hideError();
        
        try {
            const prompt = this.createPrompt(topic);
            const quote = await this.callGeminiAPI(prompt);
            
            if (quote) {
                this.displayQuote(quote);
                this.showToast('Quote đã được tạo thành công!', 'success');
            } else {
                throw new Error('Không thể tạo quote từ chủ đề này');
            }
        } catch (error) {
            console.error('Error generating quote:', error);
            this.showError(this.getErrorMessage(error));
        } finally {
            this.setLoadingState(false);
        }
    }

    createPrompt(topic) {
        return `Hãy tạo một câu quote tiếng Việt cảm hứng, ý nghĩa và sâu sắc dựa trên chủ đề sau: "${topic}". 
        
Yêu cầu:
- Quote phải bằng tiếng Việt hoàn toàn
- Độ dài từ 50-150 ký tự
- Phải có ý nghĩa sâu sắc và cảm hứng
- Phong cách thanh lịch, tinh tế
- Không sử dụng từ ngữ tiêu cực hoặc gây tổn thương
- Phù hợp với văn hóa Việt Nam
- Chỉ trả về câu quote, không cần giải thích thêm

Chủ đề: ${topic}`;
    }

    async callGeminiAPI(prompt) {
        const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.8,
                topK: 40,
                topP: 0.9,
                maxOutputTokens: 200,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        const response = await fetch(`${API_URL}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            let quote = data.candidates[0].content.parts[0].text.trim();
            
            // Clean up the quote
            quote = quote.replace(/^["'""`]/g, '').replace(/["'""`]$/g, '');
            quote = quote.replace(/^\s*-\s*/g, '').trim();
            
            return quote;
        } else {
            throw new Error('Phản hồi từ dịch vụ không hợp lệ');
        }
    }

    // UI Management
    setLoadingState(loading) {
        this.isLoading = loading;
        const generateBtn = document.getElementById('generateBtn');
        const topicInput = document.getElementById('topicInput');
        
        if (loading) {
            generateBtn.classList.add('loading');
            generateBtn.disabled = true;
            topicInput.disabled = true;
        } else {
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
            topicInput.disabled = false;
            this.validateForm();
        }
    }

    displayQuote(quote) {
        const quoteOutput = document.getElementById('quoteOutput');
        const resultsSection = document.getElementById('resultsSection');
        
        quoteOutput.textContent = quote;
        resultsSection.classList.add('visible');
        
        // Smooth scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    hideResults() {
        document.getElementById('resultsSection').classList.remove('visible');
    }

    showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        const errorSection = document.getElementById('errorSection');
        
        errorMessage.textContent = message;
        errorSection.classList.add('visible');
        
        // Auto hide error after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        document.getElementById('errorSection').classList.remove('visible');
    }

    getErrorMessage(error) {
        const message = error.message || error.toString();
        
        if (message.includes('API_KEY_INVALID') || message.includes('401')) {
            return 'Mã truy cập dịch vụ không hợp lệ. Vui lòng kiểm tra lại trong cài đặt.';
        } else if (message.includes('QUOTA_EXCEEDED') || message.includes('403')) {
            return 'Đã vượt quá giới hạn sử dụng dịch vụ. Vui lòng thử lại sau.';
        } else if (message.includes('429')) {
            return 'Quá nhiều yêu cầu. Vui lòng đợi một chút rồi thử lại.';
        } else if (message.includes('500') || message.includes('502') || message.includes('503')) {
            return 'Dịch vụ tạm thời gián đoạn. Vui lòng thử lại sau.';
        } else if (message.includes('NetworkError') || message.includes('Failed to fetch')) {
            return 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.';
        } else {
            return 'Có lỗi xảy ra khi tạo quote. Vui lòng thử lại với chủ đề khác.';
        }
    }

    // Utility Functions
    updateCharCounter() {
        const topicInput = document.getElementById('topicInput');
        const charCount = document.getElementById('charCount');
        const currentLength = topicInput.value.length;
        
        charCount.textContent = currentLength;
        
        if (currentLength > this.maxChars) {
            charCount.style.color = 'var(--error-color)';
            topicInput.style.borderColor = 'var(--error-color)';
        } else if (currentLength > this.maxChars * 0.8) {
            charCount.style.color = 'var(--warning-color)';
            topicInput.style.borderColor = 'var(--warning-color)';
        } else {
            charCount.style.color = 'var(--text-muted)';
            topicInput.style.borderColor = 'var(--border-color)';
        }
    }

    async copyToClipboard() {
        const quoteText = document.getElementById('quoteOutput').textContent;
        const copyBtn = document.getElementById('copyBtn');
        
        try {
            await navigator.clipboard.writeText(quoteText);
            
            // Visual feedback
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✅ Đã sao chép!';
            copyBtn.style.color = 'var(--success-color)';
            copyBtn.style.borderColor = 'var(--success-color)';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.color = '';
                copyBtn.style.borderColor = '';
            }, 2000);
            
            this.showToast('Đã sao chép quote vào clipboard!', 'success');
        } catch (error) {
            console.error('Failed to copy:', error);
            
            // Fallback for older browsers
            this.fallbackCopy(quoteText);
            this.showToast('Đã sao chép quote!', 'success');
        }
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter to generate quote
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!this.isLoading) {
                document.getElementById('quoteForm').dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape to close settings
        if (e.key === 'Escape') {
            this.closeSettings();
        }
        
        // Ctrl/Cmd + K to open settings
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.openSettings();
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SodeepApp();
});

// Export for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SodeepApp;
}