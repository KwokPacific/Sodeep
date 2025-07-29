// Sodeep - Hệ thống thông minh cho nội dung sâu lắng
// JavaScript functionality for API key management and content generation

class SodeepApp {
    constructor() {
        this.apiKey = '';
        this.isKeyVisible = false;
        this.init();
    }

    init() {
        this.loadApiKey();
        this.bindEvents();
        this.updateUI();
        console.log('Sodeep - Hệ thống thông minh đã khởi động');
    }

    bindEvents() {
        // API Key management events
        document.getElementById('toggleKey').addEventListener('click', () => this.toggleKeyVisibility());
        document.getElementById('saveKey').addEventListener('click', () => this.saveApiKey());
        document.getElementById('clearKey').addEventListener('click', () => this.clearApiKey());
        
        // Content generation events
        document.getElementById('generateBtn').addEventListener('click', () => this.generateContent());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearContent());
        document.getElementById('copyResult').addEventListener('click', () => this.copyResult());
        
        // API key input validation
        document.getElementById('apiKey').addEventListener('input', () => this.validateApiKey());
        document.getElementById('apiKey').addEventListener('paste', (e) => {
            setTimeout(() => this.validateApiKey(), 100);
        });
        
        // Prompt input events
        document.getElementById('prompt').addEventListener('input', () => this.updateGenerateButton());
    }

    // API Key Management Methods
    loadApiKey() {
        try {
            const storedKey = localStorage.getItem('sodeep_service_key');
            if (storedKey) {
                this.apiKey = this.decryptKey(storedKey);
                document.getElementById('apiKey').value = this.apiKey;
                this.showStatus('Đã tải khóa dịch vụ từ bộ nhớ', 'success');
            }
        } catch (error) {
            console.error('Lỗi khi tải khóa dịch vụ:', error);
            this.showStatus('Không thể tải khóa dịch vụ đã lưu', 'error');
        }
    }

    saveApiKey() {
        const keyInput = document.getElementById('apiKey');
        const key = keyInput.value.trim();
        
        if (!key) {
            this.showStatus('Vui lòng nhập khóa dịch vụ', 'warning');
            keyInput.focus();
            return;
        }

        if (!this.isValidApiKey(key)) {
            this.showStatus('Khóa dịch vụ không hợp lệ. Vui lòng kiểm tra lại.', 'error');
            keyInput.focus();
            return;
        }

        try {
            this.apiKey = key;
            const encryptedKey = this.encryptKey(key);
            localStorage.setItem('sodeep_service_key', encryptedKey);
            this.showStatus('Đã lưu khóa dịch vụ thành công', 'success');
            this.updateUI();
        } catch (error) {
            console.error('Lỗi khi lưu khóa dịch vụ:', error);
            this.showStatus('Không thể lưu khóa dịch vụ', 'error');
        }
    }

    clearApiKey() {
        if (confirm('Bạn có chắc chắn muốn xóa khóa dịch vụ đã lưu?')) {
            try {
                this.apiKey = '';
                localStorage.removeItem('sodeep_service_key');
                document.getElementById('apiKey').value = '';
                this.showStatus('Đã xóa khóa dịch vụ', 'success');
                this.updateUI();
            } catch (error) {
                console.error('Lỗi khi xóa khóa dịch vụ:', error);
                this.showStatus('Không thể xóa khóa dịch vụ', 'error');
            }
        }
    }

    toggleKeyVisibility() {
        const keyInput = document.getElementById('apiKey');
        const toggleBtn = document.getElementById('toggleKey');
        
        this.isKeyVisible = !this.isKeyVisible;
        
        if (this.isKeyVisible) {
            keyInput.type = 'text';
            toggleBtn.textContent = '🙈';
            toggleBtn.title = 'Ẩn khóa';
        } else {
            keyInput.type = 'password';
            toggleBtn.textContent = '👁️';
            toggleBtn.title = 'Hiện khóa';
        }
    }

    validateApiKey() {
        const keyInput = document.getElementById('apiKey');
        const key = keyInput.value.trim();
        
        if (key && !this.isValidApiKey(key)) {
            keyInput.style.borderColor = '#e74c3c';
            this.showStatus('Định dạng khóa dịch vụ không hợp lệ', 'warning');
        } else {
            keyInput.style.borderColor = key ? '#27ae60' : '#e0e6ed';
            if (key) {
                this.hideStatus();
            }
        }
    }

    isValidApiKey(key) {
        // Basic validation for API key format
        // Adjust this regex based on your actual API key format
        const apiKeyPattern = /^[A-Za-z0-9_-]{20,}$/;
        return apiKeyPattern.test(key) || key.length >= 20;
    }

    // Simple encryption/decryption for localStorage (basic obfuscation)
    encryptKey(key) {
        return btoa(key.split('').reverse().join(''));
    }

    decryptKey(encryptedKey) {
        return atob(encryptedKey).split('').reverse().join('');
    }

    // Content Generation Methods
    async generateContent() {
        const prompt = document.getElementById('prompt').value.trim();
        
        if (!prompt) {
            this.showStatus('Vui lòng nhập mô tả nội dung', 'warning');
            document.getElementById('prompt').focus();
            return;
        }

        if (!this.apiKey) {
            this.showStatus('Vui lòng cấu hình khóa dịch vụ trước', 'warning');
            document.getElementById('apiKey').focus();
            return;
        }

        try {
            this.showLoading(true);
            this.hideResult();
            this.hideStatus();
            
            // Simulate API call with the external service
            const result = await this.callContentService(prompt);
            
            this.showResult(result);
            this.showLoading(false);
            
        } catch (error) {
            console.error('Lỗi khi tạo ra nội dung:', error);
            this.showStatus(`Lỗi: ${error.message}`, 'error');
            this.showLoading(false);
        }
    }

    async callContentService(prompt) {
        // This is a placeholder for the actual API call
        // Replace this with the actual service endpoint
        
        return new Promise((resolve, reject) => {
            // Simulate API delay
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate for demo
                    const mockResponse = this.generateMockContent(prompt);
                    resolve(mockResponse);
                } else {
                    reject(new Error('Dịch vụ tạo nội dung tạm thời không khả dụng. Vui lòng thử lại sau.'));
                }
            }, 2000 + Math.random() * 3000); // 2-5 second delay
        });
    }

    generateMockContent(prompt) {
        // Generate mock content based on prompt
        const templates = [
            `Dựa trên yêu cầu "${prompt}", đây là nội dung được tạo ra bởi hệ thống thông minh:

Nội dung này được phát triển với công nghệ tiên tiến, mang đến cho bạn những ý tưởng sâu sắc và chất lượng cao. 

Các điểm chính:
• Tính sáng tạo cao
• Nội dung chuyên sâu
• Phù hợp với yêu cầu cụ thể
• Được tối ưu hóa cho người đọc

Hệ thống đã phân tích yêu cầu của bạn và tạo ra nội dung phù hợp nhất với mục đích sử dụng.`,

            `Kết quả cho "${prompt}":

Công cụ tạo nội dung đã xử lý yêu cầu của bạn và đưa ra những gợi ý sau:

1. Phân tích chủ đề: Yêu cầu của bạn thuộc về lĩnh vực cần sự sâu sắc và tỉ mỉ.

2. Đề xuất nội dung: 
   - Tiếp cận vấn đề từ nhiều góc độ khác nhau
   - Sử dụng ngôn ngữ phù hợp với đối tượng mục tiêu
   - Đảm bảo tính logic và mạch lạc

3. Kết luận: Nội dung được tạo ra sẽ đáp ứng được kỳ vọng và mang lại giá trị thực tế.`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }

    clearContent() {
        if (confirm('Bạn có chắc chắn muốn xóa nội dung hiện tại?')) {
            document.getElementById('prompt').value = '';
            this.hideResult();
            this.hideStatus();
            this.updateGenerateButton();
        }
    }

    copyResult() {
        const resultContent = document.getElementById('resultContent').textContent;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(resultContent).then(() => {
                this.showStatus('Đã sao chép kết quả vào clipboard', 'success');
                setTimeout(() => this.hideStatus(), 3000);
            }).catch(err => {
                console.error('Lỗi khi sao chép:', err);
                this.fallbackCopyText(resultContent);
            });
        } else {
            this.fallbackCopyText(resultContent);
        }
    }

    fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showStatus('Đã sao chép kết quả vào clipboard', 'success');
            setTimeout(() => this.hideStatus(), 3000);
        } catch (err) {
            console.error('Lỗi khi sao chép:', err);
            this.showStatus('Không thể sao chép tự động. Vui lòng sao chép thủ công.', 'warning');
        }
        
        document.body.removeChild(textArea);
    }

    // UI Helper Methods
    showStatus(message, type = 'info') {
        const statusElement = document.getElementById('apiStatus');
        statusElement.textContent = message;
        statusElement.className = `status-message ${type}`;
        statusElement.style.display = 'block';
    }

    hideStatus() {
        const statusElement = document.getElementById('apiStatus');
        statusElement.style.display = 'none';
    }

    showLoading(show) {
        const loadingElement = document.getElementById('loading');
        const generateBtn = document.getElementById('generateBtn');
        
        if (show) {
            loadingElement.style.display = 'block';
            generateBtn.disabled = true;
            generateBtn.textContent = 'Đang xử lý...';
        } else {
            loadingElement.style.display = 'none';
            generateBtn.disabled = false;
            generateBtn.textContent = 'Tạo ra nội dung';
        }
    }

    showResult(content) {
        const resultElement = document.getElementById('result');
        const resultContent = document.getElementById('resultContent');
        
        resultContent.textContent = content;
        resultElement.style.display = 'block';
        
        // Smooth scroll to result
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    hideResult() {
        document.getElementById('result').style.display = 'none';
    }

    updateGenerateButton() {
        const prompt = document.getElementById('prompt').value.trim();
        const generateBtn = document.getElementById('generateBtn');
        
        if (prompt && this.apiKey) {
            generateBtn.disabled = false;
        } else {
            generateBtn.disabled = true;
        }
    }

    updateUI() {
        this.updateGenerateButton();
        
        // Update save button state
        const saveBtn = document.getElementById('saveKey');
        const clearBtn = document.getElementById('clearKey');
        
        if (this.apiKey) {
            clearBtn.disabled = false;
        } else {
            clearBtn.disabled = true;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sodeepApp = new SodeepApp();
});

// Add some global utility functions
window.SodeepUtils = {
    formatDate: (date = new Date()) => {
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    sanitizeHtml: (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }
};

// Error handling for uncaught errors
window.addEventListener('error', (event) => {
    console.error('Lỗi toàn cục:', event.error);
    if (window.sodeepApp) {
        window.sodeepApp.showStatus('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.', 'error');
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise bị từ chối:', event.reason);
    if (window.sodeepApp) {
        window.sodeepApp.showStatus('Đã xảy ra lỗi kết nối. Vui lòng kiểm tra kết nối mạng.', 'error');
    }
});