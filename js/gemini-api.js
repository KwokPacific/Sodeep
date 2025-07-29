/**
 * Gemini API Integration for Sodeep Application
 * Author: Thái Bình Dương
 */

// ========================================
// Gemini API Configuration
// ========================================

class GeminiAPI {
  constructor() {
    this.apiKey = '';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
    this.timeout = 30000; // 30 seconds
    this.rateLimitDelay = 1000; // 1 second between requests
    this.lastRequestTime = 0;
  }

  /**
   * Set API key
   * @param {string} apiKey - Gemini API key
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Get API key from various sources
   * @returns {string} - API key
   */
  getApiKey() {
    // Priority: 1. Manually set, 2. Environment variable, 3. Local storage
    if (this.apiKey) {
      return this.apiKey;
    }

    // Check if there's a globally defined API key
    if (typeof window !== 'undefined' && window.GEMINI_API_KEY) {
      return window.GEMINI_API_KEY;
    }

    // Check local storage
    return loadFromStorage('gemini_api_key', '');
  }

  /**
   * Validate API key format
   * @param {string} apiKey - API key to validate
   * @returns {boolean} - Validation result
   */
  validateApiKey(apiKey) {
    // Basic validation - Gemini API keys typically start with 'AIza'
    return typeof apiKey === 'string' && apiKey.length > 20 && apiKey.startsWith('AIza');
  }

  /**
   * Check if API is configured
   * @returns {boolean} - Configuration status
   */
  isConfigured() {
    const apiKey = this.getApiKey();
    return this.validateApiKey(apiKey);
  }

  /**
   * Create prompt for quote generation
   * @param {string} style - Writing style
   * @param {string} topic - Quote topic
   * @returns {string} - Formatted prompt
   */
  createPrompt(style, topic) {
    const prompt = `Tạo một câu nói hay và sâu lắng theo yêu cầu sau:

Văn phong: ${style}
Chủ đề: ${topic}

Yêu cầu:
1. Tạo một câu nói ngắn gọn, súc tích và có ý nghĩa sâu sắc
2. Câu nói phải phù hợp với văn phong "${style}" và chủ đề "${topic}"
3. Câu nói phải có tính triết lý, truyền cảm hứng hoặc khơi gợi suy tư
4. Độ dài từ 10-30 từ
5. Không sử dụng các từ ngữ phản cảm hoặc tiêu cực
6. Tạo ra một câu nói hoàn toàn mới, không copy từ nguồn nào

Trả về kết quả theo format JSON sau:
{
  "vietnamese": "Câu nói tiếng Việt",
  "english": "English quote translation",
  "chinese": "中文翻译"
}

Chỉ trả về JSON object, không thêm bất kỳ text nào khác.`;

    return prompt;
  }

  /**
   * Rate limiting - ensure we don't exceed API limits
   */
  async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const waitTime = this.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Make API request with retry logic
   * @param {string} prompt - Prompt for generation
   * @param {number} retryCount - Current retry count
   * @returns {Promise<Object>} - API response
   */
  async makeRequest(prompt, retryCount = 0) {
    const apiKey = this.getApiKey();
    
    if (!this.validateApiKey(apiKey)) {
      throw new Error('Invalid or missing Gemini API key. Please check your API key configuration.');
    }

    await this.enforceRateLimit();

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
        stopSequences: []
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle specific error cases
        if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again in a moment.');
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Please check your Gemini API key.');
        } else if (response.status === 403) {
          throw new Error('API access forbidden. Please check your API key permissions.');
        } else if (response.status >= 500) {
          throw new Error('Gemini API server error. Please try again later.');
        }
        
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated. Please try again with different parameters.');
      }

      const content = data.candidates[0]?.content?.parts[0]?.text;
      if (!content) {
        throw new Error('Empty response from API. Please try again.');
      }

      return this.parseResponse(content);

    } catch (error) {
      clearTimeout(timeoutId);
      
      // Handle network errors and retries
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      
      // Retry logic for certain errors
      if (retryCount < this.maxRetries && this.shouldRetry(error)) {
        console.log(`Retrying request... Attempt ${retryCount + 1}/${this.maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
        return this.makeRequest(prompt, retryCount + 1);
      }
      
      throw error;
    }
  }

  /**
   * Determine if error should trigger a retry
   * @param {Error} error - Error object
   * @returns {boolean} - Whether to retry
   */
  shouldRetry(error) {
    const retryableErrors = [
      'network error',
      'timeout',
      'server error',
      'rate limit',
      'temporary'
    ];
    
    const errorMessage = error.message.toLowerCase();
    return retryableErrors.some(retryableError => errorMessage.includes(retryableError));
  }

  /**
   * Parse and validate API response
   * @param {string} content - Raw response content
   * @returns {Object} - Parsed quotes object
   */
  parseResponse(content) {
    try {
      // Clean the response - remove any markdown code blocks
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.substring(7);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.substring(0, cleanContent.length - 3);
      }
      cleanContent = cleanContent.trim();

      const parsed = JSON.parse(cleanContent);
      
      // Validate required fields
      if (!parsed.vietnamese || !parsed.english || !parsed.chinese) {
        throw new Error('Invalid response format - missing required language fields');
      }

      // Sanitize the quotes
      return {
        vietnamese: sanitizeHTML(parsed.vietnamese.trim()),
        english: sanitizeHTML(parsed.english.trim()),
        chinese: sanitizeHTML(parsed.chinese.trim()),
        timestamp: new Date().toISOString(),
        id: generateId()
      };

    } catch (parseError) {
      console.error('Failed to parse API response:', parseError);
      
      // Fallback: try to extract quotes using regex if JSON parsing fails
      const fallbackQuotes = this.extractQuotesFallback(content);
      if (fallbackQuotes) {
        return fallbackQuotes;
      }
      
      throw new Error('Failed to parse API response. Please try again.');
    }
  }

  /**
   * Fallback method to extract quotes when JSON parsing fails
   * @param {string} content - Raw response content
   * @returns {Object|null} - Extracted quotes or null
   */
  extractQuotesFallback(content) {
    try {
      // Simple fallback - create a single Vietnamese quote from the content
      const cleanContent = content.replace(/[{}"\[\]]/g, '').trim();
      
      if (cleanContent.length > 10 && cleanContent.length < 200) {
        return {
          vietnamese: sanitizeHTML(cleanContent),
          english: "A meaningful quote from the depths of the soul",
          chinese: "来自心灵深处的有意义的名言",
          timestamp: new Date().toISOString(),
          id: generateId()
        };
      }
      
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Generate quotes based on style and topic
   * @param {string} style - Writing style
   * @param {string} topic - Quote topic
   * @returns {Promise<Object>} - Generated quotes
   */
  async generateQuote(style, topic) {
    if (!style || !topic) {
      throw new Error('Both style and topic are required');
    }

    if (!this.isConfigured()) {
      throw new Error('Gemini API is not configured. Please provide an API key.');
    }

    try {
      const prompt = this.createPrompt(style, topic);
      const quotes = await this.makeRequest(prompt);
      
      // Add metadata
      quotes.style = style;
      quotes.topic = topic;
      quotes.author = "Thái Bình Dương";
      
      return quotes;
      
    } catch (error) {
      logError(error, 'Quote Generation');
      throw error;
    }
  }

  /**
   * Test API connection
   * @returns {Promise<boolean>} - Connection status
   */
  async testConnection() {
    try {
      await this.generateQuote('triết lý', 'cuộc sống');
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  /**
   * Get API usage statistics (if available)
   * @returns {Object} - Usage statistics
   */
  getUsageStats() {
    return {
      requestCount: loadFromStorage('gemini_request_count', 0),
      lastRequestTime: loadFromStorage('gemini_last_request', null),
      errorCount: loadFromStorage('gemini_error_count', 0)
    };
  }

  /**
   * Update usage statistics
   * @param {boolean} success - Whether the request was successful
   */
  updateUsageStats(success = true) {
    const stats = this.getUsageStats();
    
    stats.requestCount += 1;
    stats.lastRequestTime = new Date().toISOString();
    
    if (!success) {
      stats.errorCount += 1;
    }

    saveToStorage('gemini_request_count', stats.requestCount);
    saveToStorage('gemini_last_request', stats.lastRequestTime);
    saveToStorage('gemini_error_count', stats.errorCount);
  }
}

// ========================================
// Export for global usage
// ========================================

// Create global instance
const geminiAPI = new GeminiAPI();

// Make it available globally
if (typeof window !== 'undefined') {
  window.GeminiAPI = GeminiAPI;
  window.geminiAPI = geminiAPI;
}

// Export for module usage (if needed)
// export { GeminiAPI, geminiAPI };