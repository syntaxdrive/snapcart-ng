# SQL Utilities for SnapCart

This folder contains useful SQL scripts for managing your SnapCart database.

## 📁 Available Scripts

### User Management
- **`add_admin.sql`** - Promote a user to admin
- **`remove_admin.sql`** - Demote an admin to regular user
- **`view_users_by_role.sql`** - View all users grouped by role

### Seller Management
- **`approve_seller.sql`** - Manually approve a seller application
- **`revoke_seller.sql`** - Revoke seller privileges
- **`view_applications.sql`** - View all seller applications

### Product Management
- **`delete_product.sql`** - Delete a specific product

### Maintenance
- **`cleanup_old_applications.sql`** - Remove old rejected applications
- **`database_stats.sql`** - View database statistics and analytics

### Utilities
- **`search.sql`** - Search for users, products, or sellers

## 🚀 How to Use

1. Open **Supabase Dashboard** → **SQL Editor**
2. Choose the appropriate script from this folder
3. **Replace placeholder values** (e.g., `email@example.com`, `USER_ID`)
4. Run the script
5. Verify the results

## ⚠️ Important Notes

- **Always preview before deleting** - Most delete scripts include a preview query
- **Backup first** - For major changes, export your data first
- **Test on staging** - If you have a staging environment, test there first
- **Replace placeholders** - Scripts use placeholders like `email@example.com` - replace with actual values

## 📝 Examples

### Make someone an admin
```sql
-- Edit add_admin.sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'john@example.com';
```

### View database stats
```sql
-- Run database_stats.sql as-is
-- No changes needed
```

### Search for a user
```sql
-- Edit search.sql
WHERE email ILIKE '%john%';
```

## 🔒 Security

- Only run these scripts if you're an admin
- Never share your Supabase credentials
- Keep this folder private (don't commit to public repos)

## 📊 Monitoring

Run `database_stats.sql` weekly to monitor:
- User growth
- Product listings
- Application trends
- Recent activity

---

**Last Updated:** 2026-01-14
**Maintained by:** SnapCart Team
