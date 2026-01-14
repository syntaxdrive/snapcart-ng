# 🔒 SnapCart Security Guide

## Security Measures Implemented

### 1. Database Security (`security_setup.sql`)

#### Input Validation
- ✅ Email format validation
- ✅ Role validation (only user/seller/admin)
- ✅ Price must be positive
- ✅ WhatsApp number format (10-15 digits)
- ✅ Product category validation
- ✅ Business name cannot be empty

#### Rate Limiting
- ✅ Max 3 seller applications per hour per user
- ✅ Database-level trigger enforcement

#### Privilege Escalation Prevention
- ✅ Users cannot promote themselves to admin
- ✅ Only admins can change user roles
- ✅ Database trigger blocks unauthorized role changes

#### Performance & Security Indexes
- ✅ Indexed email, role, seller_id, user_id, status
- ✅ Faster queries = harder to brute force

#### Data Cleanup
- ✅ Auto-delete rejected applications after 90 days
- ✅ Prevents database bloat

### 2. Frontend Security (`src/utils/security.js`)

#### XSS Prevention
- ✅ Input sanitization (removes `<>`, `javascript:`, event handlers)
- ✅ HTML escaping for display
- ✅ Suspicious pattern detection

#### Input Validation
- ✅ Email validation
- ✅ WhatsApp number validation
- ✅ Price validation (0 < price < 10M)
- ✅ Product name length (3-100 chars)
- ✅ Business name length (3-50 chars)

#### File Upload Security
- ✅ Only JPEG, PNG, WebP allowed
- ✅ Max 5MB file size
- ✅ Type validation

#### Client-Side Rate Limiting
- ✅ Prevents spam submissions
- ✅ Configurable attempts/time window

#### Session Security
- ✅ Session timeout warnings
- ✅ Activity-based session refresh

### 3. Row Level Security (RLS)

#### Profiles
- ✅ Public read access
- ✅ Users can only update own profile
- ✅ Admins can update any profile

#### Products
- ✅ Public read access
- ✅ Sellers can only manage own products
- ✅ Full CRUD for own products

#### Seller Applications
- ✅ Users see own applications
- ✅ Public sees approved sellers
- ✅ Admins see all applications
- ✅ Only admins can approve/reject

#### Banners
- ✅ Public sees active banners
- ✅ Only admins can manage banners

### 4. Storage Security

- ✅ Public read for product/banner images
- ✅ Only authenticated users can upload
- ✅ Separate buckets for products and banners

---

## How to Apply Security

### Step 1: Run SQL Script
```bash
# In Supabase SQL Editor, run:
security_setup.sql
```

### Step 2: Use Security Utils in Components
```javascript
import security from '../utils/security';

// Validate before submitting
if (!security.isValidEmail(email)) {
    alert('Invalid email');
    return;
}

// Sanitize user input
const safeName = security.sanitizeInput(productName);

// Check image before upload
const imageCheck = security.isValidImage(file);
if (!imageCheck.valid) {
    alert(imageCheck.error);
    return;
}
```

### Step 3: Enable HTTPS (Production)
- Use Netlify/Vercel for auto HTTPS
- Never use HTTP in production

### Step 4: Environment Variables
- Never commit `.env` to Git
- Use Supabase's anon key (public)
- Service role key should NEVER be in frontend

---

## Security Checklist

### Database ✅
- [x] RLS enabled on all tables
- [x] Input validation constraints
- [x] Rate limiting triggers
- [x] Privilege escalation prevention
- [x] Indexes for performance
- [x] Realtime disabled for sensitive tables

### Frontend ✅
- [x] Input sanitization
- [x] XSS prevention
- [x] File upload validation
- [x] Client-side rate limiting
- [x] Session timeout
- [x] Suspicious activity detection

### Authentication ✅
- [x] Supabase Auth (secure by default)
- [x] Email verification
- [x] Role-based access control
- [x] Admin-only routes protected

### API ✅
- [x] Supabase RLS (server-side enforcement)
- [x] No direct database access from client
- [x] All queries go through Supabase API

---

## Common Attack Vectors & Protection

| Attack | Protection |
|--------|-----------|
| SQL Injection | ✅ Supabase uses prepared statements |
| XSS | ✅ Input sanitization + HTML escaping |
| CSRF | ✅ Supabase handles tokens |
| Privilege Escalation | ✅ Database triggers + RLS |
| Brute Force | ✅ Rate limiting (DB + client) |
| File Upload Exploits | ✅ Type & size validation |
| Session Hijacking | ✅ Supabase secure cookies |
| Data Leakage | ✅ RLS policies enforce access |

---

## Production Deployment Security

### Netlify/Vercel
1. Enable HTTPS (automatic)
2. Set environment variables in dashboard
3. Enable security headers
4. Use CDN for DDoS protection

### Supabase
1. Enable email verification
2. Set up custom SMTP (optional)
3. Monitor database logs
4. Set up database backups
5. Enable 2FA for admin accounts

---

## Monitoring & Maintenance

### Weekly
- Check Supabase logs for errors
- Review failed login attempts
- Monitor database size

### Monthly
- Run `cleanup_old_applications()` function
- Review and update RLS policies
- Check for Supabase updates

### Quarterly
- Security audit
- Update dependencies
- Review user roles

---

## Emergency Response

### If Compromised
1. Immediately revoke Supabase API keys
2. Force logout all users (reset JWT secret)
3. Review database logs
4. Identify and fix vulnerability
5. Notify affected users
6. Generate new API keys

### Backup & Recovery
- Supabase auto-backups (7 days on free tier)
- Export critical data weekly
- Test restore process monthly

---

**Status:** 🔒 Secure
**Last Updated:** 2026-01-14
**Security Level:** Production-Ready
