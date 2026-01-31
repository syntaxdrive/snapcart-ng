# SnapCart V2 - Feature Implementation Guide

This document tracks the implementation of the V2 feature set, including Search, Verification, Analytics, and Reporting.

## 🚀 Implemented Features

### 1. 🔍 Enhanced Marketplace & Store
- **Search Bar**: Users can now search for products by name, description, or seller name.
- **Sorting**: Products are automatically sorted:
    1.  **Verified Sellers** (Blue Tick) first.
    2.  **Same University** sellers second.
    3.  **Newest** items last.
- **Click Tracking**: "Buy on WhatsApp" clicks are tracked.
- **Analytics**: Sellers and Admins can see the "👁️ Click Count" on product cards (hidden from normal users).

### 2. ✅ Seller Verification (Blue Tick)
- **Automatic Verification**: Sellers are automatically verified if they reach **500 total clicks** across all products.
- **Manual Verification**: Admins can manually verify/unverify sellers from the Admin Dashboard.
- **Visual Indicator**: A Blue Tick (✓) appears next to the seller's name in Marketplace and Store Details.

### 3. 🏪 Seller Profile Enhancements
- **Qualifications**: Sellers can add "Qualifications" or additional info (e.g., "Certified Technician") in their Dashboard.
- **Store Banner**: Sellers can upload a custom background banner for their store.
- **Store Details**: Now displays Qualifications, Ratings, and the Banner.

### 4. ⭐ Ratings & Reporting
- **Reviews**: Users can rate sellers (1-5 stars) on the Store Details page.
- **Reporting**: Users can report suspicious sellers via the "Report Seller" button.
- **Schema**:
    - `reviews`: Stores rating and reviewer ID.
    - `reports`: Stores reporting reason and target.

### 5. 🛡️ Admin Dashboard Upgrades
- **User Analytics**: Displays total registered user count.
- **Verification Control**: "Verify/Unverify" buttons added to the "Active Sellers" list.
- **Banner Management**: Admins can post/delete homepage banners.

---

## 🛠️ Database Schema Changes
The following SQL migration (`v2_features.sql`) was applied:

```sql
-- Columns
ALTER TABLE profiles ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN qualifications TEXT;
ALTER TABLE products ADD COLUMN clicks INTEGER DEFAULT 0;

-- Tables
CREATE TABLE reviews (id UUID, seller_id UUID, rating INT, ...);
CREATE TABLE reports (id UUID, target_id UUID, reason TEXT, ...);

-- Functions
increment_product_clicks(product_id) -- Secure RPC
check_auto_verify() -- Trigger for 500 clicks
```

## 📋 Next Steps / TODO
- [ ] **Email Notifications**: Notify admins when a report is filed.
- [ ] **Advanced Analytics Dashboard**: Show graph of clicks over time.
- [ ] **Review Comments**: Allow text comments with ratings.
- [ ] **Edit Profile**: Allow users to edit their bio/avatar.
