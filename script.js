/**
 * Sodeep - Công cụ tạo ra những câu quote đặc biệt
 * Sử dụng dịch vụ tạo nội dung để tạo ra những câu quote ý nghĩa
 */

class SodeepQuoteGenerator {
    constructor() {
        this.DEFAULT_API_KEY = "AIzaSyDSVRTEEx5oFNBTxvA44_E9NpgMFp0G7sU";
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.accessCode = '';
        this.isGenerating = false;
        
        this.initializeElements();
        this.loadSavedSettings();
        this.attachEventListeners();
        this.checkFormValidity();
    }

    /**
     * Khởi tạo các phần tử DOM
     */
    initializeElements() {
        this.elements = {
            userInput: document.getElementById('userInput'),
            accessCode: document.getElementById('accessCode'),
            generateBtn: document.getElementById('generateBtn'),
            outputSection: document.getElementById('outputSection'),
            quoteOutput: document.getElementById('quoteOutput'),
            copyBtn: document.getElementById('copyBtn'),
            shareBtn: document.getElementById('shareBtn'),
            regenerateBtn: document.getElementById('regenerateBtn'),
            saveAccessCode: document.getElementById('saveAccessCode'),
            toggleAccessCode: document.getElementById('toggleAccessCode'),
            toggleIcon: document.getElementById('toggleIcon'),
            charCount: document.getElementById('charCount'),
            toast: document.getElementById('toast'),
            toggleApiSection: document.getElementById('toggleApiSection'),
            apiSection: document.querySelector('.api-section')
        };
    }

    /**
     * Tải cài đặt đã lưu từ localStorage
     */
    loadSavedSettings() {
        const savedAccessCode = localStorage.getItem('sodeep_access_code');
        if (savedAccessCode) {
            this.accessCode = savedAccessCode;
            this.elements.accessCode.value = savedAccessCode;
        } else {
            // Sử dụng API key mặc định nếu không có saved key
            this.accessCode = this.DEFAULT_API_KEY;
        }

        const savedInput = localStorage.getItem('sodeep_last_input');
        if (savedInput) {
            this.elements.userInput.value = savedInput;
            this.updateCharCount();
        }
    }

    /**
     * Gắn các event listeners
     */
    attachEventListeners() {
        // Theo dõi thay đổi trong form
        this.elements.userInput.addEventListener('input', () => {
            this.updateCharCount();
            this.checkFormValidity();
            this.saveInputToStorage();
        });

        this.elements.accessCode.addEventListener('input', () => {
            this.checkFormValidity();
        });

        // Nút tạo quote
        this.elements.generateBtn.addEventListener('click', () => {
            this.generateQuote();
        });

        // Các nút action
        this.elements.copyBtn.addEventListener('click', () => {
            this.copyToClipboard();
        });

        this.elements.regenerateBtn.addEventListener('click', () => {
            this.generateQuote();
        });

        // Nút chia sẻ
        this.elements.shareBtn.addEventListener('click', () => {
            this.shareQuote();
        });

        // Lưu và hiển thị mã truy cập
        this.elements.saveAccessCode.addEventListener('click', () => {
            this.saveAccessCode();
        });

        this.elements.toggleAccessCode.addEventListener('click', () => {
            this.toggleAccessCodeVisibility();
        });

        // Toggle API section
        if (this.elements.toggleApiSection) {
            this.elements.toggleApiSection.addEventListener('click', () => {
                this.toggleApiSection();
            });
        }

        // Xử lý phím tắt
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'Enter':
                        e.preventDefault();
                        if (!this.isGenerating) {
                            this.generateQuote();
                        }
                        break;
                    case 'c':
                        if (this.elements.outputSection.style.display !== 'none') {
                            e.preventDefault();
                            this.copyToClipboard();
                        }
                        break;
                }
            }
        });
    }

    /**
     * Cập nhật số ký tự đã nhập
     */
    updateCharCount() {
        const count = this.elements.userInput.value.length;
        this.elements.charCount.textContent = count;
        
        if (count > 450) {
            this.elements.charCount.style.color = 'var(--warning)';
        } else if (count > 400) {
            this.elements.charCount.style.color = 'var(--text-muted)';
        } else {
            this.elements.charCount.style.color = 'var(--text-muted)';
        }
    }

    /**
     * Kiểm tra tính hợp lệ của form
     */
    checkFormValidity() {
        const hasInput = this.elements.userInput.value.trim().length > 0;
        // Không yêu cầu access code vì đã có default API key
        
        this.elements.generateBtn.disabled = !hasInput || this.isGenerating;
    }

    /**
     * Lưu input vào localStorage
     */
    saveInputToStorage() {
        localStorage.setItem('sodeep_last_input', this.elements.userInput.value);
    }

    /**
     * Lưu mã truy cập
     */
    saveAccessCode() {
        const accessCode = this.elements.accessCode.value.trim();
        if (accessCode) {
            localStorage.setItem('sodeep_access_code', accessCode);
            this.accessCode = accessCode;
            this.showToast('Đã lưu mã truy cập thành công', 'success');
        } else {
            this.showToast('Vui lòng nhập mã truy cập', 'error');
        }
    }

    /**
     * Chuyển đổi hiển thị mã truy cập
     */
    toggleAccessCodeVisibility() {
        const input = this.elements.accessCode;
        const icon = this.elements.toggleIcon;
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = '🙈';
        } else {
            input.type = 'password';
            icon.textContent = '👁️';
        }
    }

    /**
     * Lấy API key hiện tại (từ input hoặc default)
     */
    getCurrentApiKey() {
        const inputApiKey = this.elements.accessCode.value.trim();
        return inputApiKey || this.DEFAULT_API_KEY;
    }

    /**
     * Toggle hiển thị API section
     */
    toggleApiSection() {
        if (!this.elements.apiSection) return;
        
        const isVisible = this.elements.apiSection.style.display !== 'none';
        this.elements.apiSection.style.display = isVisible ? 'none' : 'block';
        
        // Cập nhật text của button
        if (this.elements.toggleApiSection) {
            const buttonText = isVisible ? 
                '<span>🔧</span> Sử dụng API key tùy chỉnh' : 
                '<span>🔧</span> Ẩn API key tùy chỉnh';
            this.elements.toggleApiSection.innerHTML = buttonText;
        }
    }
    /**
     * Tạo quote từ input của người dùng
     */
    async generateQuote() {
        if (this.isGenerating) return;

        const userInput = this.elements.userInput.value.trim();

        if (!userInput) {
            this.showToast('Vui lòng nhập ý tưởng của bạn', 'error');
            return;
        }

        this.setLoadingState(true);

        try {
            const apiKey = this.getCurrentApiKey();
            const quote = await this.callGenerativeService(userInput, apiKey);
            this.displayQuote(quote);
            this.showToast('Đã tạo ra quote thành công!', 'success');
        } catch (error) {
            console.error('Lỗi khi tạo quote:', error);
            this.handleGenerationError(error);
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Gọi dịch vụ tạo nội dung
     */
    async callGenerativeService(userInput, accessCode) {
        const prompt = this.createPrompt(userInput);
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
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

        const response = await fetch(`${this.apiEndpoint}?key=${accessCode}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(this.getErrorMessage(response.status, errorData));
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Dịch vụ không thể tạo ra nội dung phù hợp. Vui lòng thử lại với chủ đề khác.');
        }

        return data.candidates[0].content.parts[0].text;
    }

    /**
     * Tạo prompt cho dịch vụ tạo nội dung
     */
    createPrompt(userInput) {
        return `Hãy tạo ra một câu quote (danh ngôn) bằng tiếng Việt sâu sắc và ý nghĩa dựa trên chủ đề hoặc ý tưởng sau: "${userInput}"

Yêu cầu:
- Quote phải ngắn gọn, súc tích (tối đa 2-3 câu)
- Sử dụng ngôn ngữ đẹp, có chiều sâu triết học
- Thể hiện được tinh thần tích cực, động viên
- Phù hợp với văn hóa Việt Nam
- Không sử dụng từ ngữ tiêu cực hay gây tổn thương

Hãy chỉ trả về câu quote, không cần giải thích thêm.`;
    }

    /**
     * Hiển thị quote đã tạo
     */
    displayQuote(quote) {
        // Làm sạch và format quote
        const formattedQuote = this.formatQuote(quote);
        
        this.elements.quoteOutput.innerHTML = `<p>${formattedQuote}</p>`;
        this.elements.outputSection.style.display = 'block';
        
        // Scroll đến kết quả
        this.elements.outputSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    /**
     * Format quote để hiển thị đẹp
     */
    formatQuote(quote) {
        return quote
            .trim()
            .replace(/^["''""]|["''""]$/g, '') // Loại bỏ dấu ngoặc kép ở đầu/cuối
            .replace(/\n+/g, '<br><br>') // Thay thế line breaks
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Format bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Format italic
    }

    /**
     * Chia sẻ quote
     */
    async shareQuote() {
        try {
            const quoteText = this.elements.quoteOutput.textContent.trim();
            const shareText = `${quoteText}\n\n- Tạo bởi Sodeep (Thái Bình Dương)`;

            if (navigator.share) {
                // Sử dụng Web Share API nếu có
                await navigator.share({
                    title: 'Quote từ Sodeep',
                    text: shareText,
                    url: window.location.href
                });
                this.showToast('Đã chia sẻ quote thành công!', 'success');
            } else {
                // Fallback: copy to clipboard
                await this.copyShareText(shareText);
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Lỗi khi chia sẻ:', error);
                // Fallback: copy to clipboard
                const quoteText = this.elements.quoteOutput.textContent.trim();
                const shareText = `${quoteText}\n\n- Tạo bởi Sodeep (Thái Bình Dương)`;
                await this.copyShareText(shareText);
            }
        }
    }

    /**
     * Sao chép text để chia sẻ
     */
    async copyShareText(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Đã sao chép quote để chia sẻ vào clipboard', 'success');
        } catch (error) {
            console.error('Lỗi khi sao chép:', error);
            this.fallbackCopyShareText(text);
        }
    }

    /**
     * Phương thức sao chép dự phòng cho chia sẻ
     */
    fallbackCopyShareText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showToast('Đã sao chép quote để chia sẻ vào clipboard', 'success');
        } catch (error) {
            this.showToast('Không thể chia sẻ. Vui lòng sao chép thủ công.', 'error');
        } finally {
            document.body.removeChild(textArea);
        }
    }
    async copyToClipboard() {
        try {
            const quoteText = this.elements.quoteOutput.textContent.trim();
            await navigator.clipboard.writeText(quoteText);
            this.showToast('Đã sao chép quote vào clipboard', 'success');
        } catch (error) {
            console.error('Lỗi khi sao chép:', error);
            this.fallbackCopyToClipboard();
        }
    }

    /**
     * Phương thức sao chép dự phòng
     */
    fallbackCopyToClipboard() {
        const textArea = document.createElement('textarea');
        textArea.value = this.elements.quoteOutput.textContent.trim();
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showToast('Đã sao chép quote vào clipboard', 'success');
        } catch (error) {
            this.showToast('Không thể sao chép. Vui lòng sao chép thủ công.', 'error');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    /**
     * Thiết lập trạng thái loading
     */
    setLoadingState(isLoading) {
        this.isGenerating = isLoading;
        
        if (isLoading) {
            this.elements.generateBtn.classList.add('loading');
            this.elements.generateBtn.disabled = true;
        } else {
            this.elements.generateBtn.classList.remove('loading');
            this.checkFormValidity();
        }
    }

    /**
     * Xử lý lỗi khi tạo quote
     */
    handleGenerationError(error) {
        let errorMessage = 'Có lỗi xảy ra khi tạo quote. Vui lòng thử lại.';
        
        if (error.message) {
            errorMessage = error.message;
        }
        
        this.showToast(errorMessage, 'error');
    }

    /**
     * Lấy thông báo lỗi dựa trên status code
     */
    getErrorMessage(status, errorData) {
        switch (status) {
            case 400:
                return 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin đầu vào.';
            case 401:
                return 'Mã truy cập dịch vụ không hợp lệ. Vui lòng kiểm tra lại.';
            case 403:
                return 'Không có quyền truy cập dịch vụ. Vui lòng kiểm tra mã truy cập.';
            case 429:
                return 'Đã vượt quá giới hạn sử dụng. Vui lòng thử lại sau ít phút.';
            case 500:
                return 'Dịch vụ tạo nội dung tạm thời không khả dụng. Vui lòng thử lại sau.';
            default:
                return errorData.error?.message || 'Có lỗi xảy ra khi kết nối đến dịch vụ. Vui lòng thử lại.';
        }
    }

    /**
     * Hiển thị thông báo toast
     */
    showToast(message, type = 'info') {
        const toast = this.elements.toast;
        
        // Xóa các class cũ
        toast.className = 'toast';
        
        // Thêm class mới
        if (type) {
            toast.classList.add(type);
        }
        
        toast.textContent = message;
        toast.classList.add('show');
        
        // Tự động ẩn sau 4 giây
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}

// Khởi tạo ứng dụng khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    new SodeepQuoteGenerator();
});

// Service Worker registration (nếu có)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}