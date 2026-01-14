# SnapCart Setup - Final Steps

## 🔴 CRITICAL: Run These SQL Scripts in Order

### Step 1: Fix ALL RLS Policies (REQUIRED)
**File:** `fix_all_rls.sql`
**What it does:**
- Fixes RLS policies on ALL tables (profiles, products, seller_applications, banners)
- Enables public read access for marketplace data
- Promotes quakestartup@gmail.com to admin
- Fixes storage bucket policies

**Run this FIRST in Supabase SQL Editor**

---

### Step 2: Add Database Constraints (RECOMMENDED)
**File:** `add_seller_constraints.sql`
**What it does:**
- Prevents duplicate seller applications (one per user)
- Adds data validation for status field
- Creates indexes for better performance

**Run this SECOND in Supabase SQL Editor**

---

## ✅ What's Been Fixed

### Frontend Components:
1. **SellerApplication.jsx**
   - ✅ Checks for existing applications before submission
   - ✅ Handles duplicate application errors gracefully
   - ✅ Redirects approved sellers to dashboard
   - ✅ Blocks admins from applying

2. **AdminDashboard.jsx**
   - ✅ Handles auth state properly with timeouts
   - ✅ Approve/Reject/Revoke functionality working
   - ✅ Fetches pending applications and active sellers
   - ✅ Banner management (create/delete/toggle)

3. **Navbar.jsx**
   - ✅ Shows correct links based on role (admin/seller/user)
   - ✅ Displays user's first name
   - ✅ Handles role changes in real-time

4. **SellerDashboard.jsx**
   - ✅ Full CRUD for products (Create/Read/Update/Delete)
   - ✅ Image upload working
   - ✅ Edit/Delete buttons always visible

---

## 🎯 Expected Behavior After SQL Scripts

### For Regular Users:
- Can browse Marketplace (see all products)
- Can view Stores (see approved sellers)
- Can apply to become a seller
- Cannot apply twice

### For Sellers:
- See "Sell" link in navbar
- Access Seller Dashboard
- Add/Edit/Delete their products
- Upload product images

### For Admins (quakestartup@gmail.com):
- See "Admin" link in navbar
- Access Admin Dashboard
- Approve/Reject seller applications
- Revoke seller status
- Manage banners
- Cannot apply to be a seller

---

## 🐛 Troubleshooting

### If data still won't load after running SQL:
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Check browser console for errors
4. Verify SQL scripts ran without errors in Supabase

### If seller application keeps saying "Submitting...":
- Run `fix_all_rls.sql` - RLS is blocking the insert

### If Admin Dashboard shows "Loading..." forever:
- Run `fix_all_rls.sql` - RLS is blocking profile read
- Check console for timeout errors

---

## 📝 Database Schema Summary

### Tables:
- `profiles` - User profiles with roles (user/seller/admin)
- `products` - Product listings by sellers
- `seller_applications` - Seller application requests
- `banners` - Homepage carousel banners

### Storage Buckets:
- `products` - Product images (public)
- `banners` - Banner images (public)

---

## 🚀 Next Steps (Optional Enhancements)

1. Add email notifications for seller approvals
2. Add product categories filter in Marketplace
3. Add seller ratings/reviews
4. Add order management system
5. Add payment integration

---

**Created:** 2026-01-14
**Status:** Ready for Production (after running SQL scripts)
