// Security utilities for SnapCart frontend

// 1. Input Sanitization
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    // Remove potential XSS characters
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
};

// 2. Validate Email
export const isValidEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
};

// 3. Validate WhatsApp Number
export const isValidWhatsApp = (number) => {
    const whatsappRegex = /^[0-9]{10,15}$/;
    return whatsappRegex.test(number.replace(/\s/g, ''));
};

// 4. Validate Price
export const isValidPrice = (price) => {
    const num = parseFloat(price);
    return !isNaN(num) && num > 0 && num < 10000000;
};

// 5. Validate Product Name
export const isValidProductName = (name) => {
    return name && name.trim().length >= 3 && name.trim().length <= 100;
};

// 6. Validate Business Name
export const isValidBusinessName = (name) => {
    return name && name.trim().length >= 3 && name.trim().length <= 50;
};

// 7. Prevent XSS in Display
export const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// 8. Rate Limiting Helper (Client-side)
export const checkRateLimit = (key, maxAttempts = 5, windowMs = 60000) => {
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < windowMs);

    if (recentAttempts.length >= maxAttempts) {
        return false; // Rate limit exceeded
    }

    // Add current attempt
    recentAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(recentAttempts));

    return true; // Allowed
};

// 9. Secure Image Upload Validation
export const isValidImage = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
        return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
    }

    if (file.size > maxSize) {
        return { valid: false, error: 'Image must be less than 5MB' };
    }

    return { valid: true };
};

// 10. Content Security Policy Headers (for production)
export const securityHeaders = {
    'Content-Security-Policy': "default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

// 11. Detect Suspicious Activity
export const detectSuspiciousActivity = (action) => {
    const suspiciousPatterns = [
        /script/i,
        /eval\(/i,
        /javascript:/i,
        /<iframe/i,
        /onerror=/i,
        /onclick=/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(action));
};

// 12. Session Timeout Warning
export const setupSessionTimeout = (timeoutMs = 30 * 60 * 1000) => {
    let timeout;

    const resetTimer = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            alert('Your session is about to expire. Please save your work.');
        }, timeoutMs - 60000); // Warn 1 minute before
    };

    // Reset on user activity
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetTimer, true);
    });

    resetTimer();
};

export default {
    sanitizeInput,
    isValidEmail,
    isValidWhatsApp,
    isValidPrice,
    isValidProductName,
    isValidBusinessName,
    escapeHtml,
    checkRateLimit,
    isValidImage,
    detectSuspiciousActivity,
    setupSessionTimeout
};
