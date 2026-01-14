# SnapCart - University Marketplace

A modern, secure marketplace platform for university students to buy and sell products.

## 🚀 Features

- **User Authentication** - Secure login with Supabase Auth
- **Role-Based Access** - User, Seller, and Admin roles
- **Product Marketplace** - Browse and search products
- **Seller Dashboard** - Manage products and inventory
- **Admin Dashboard** - Approve sellers, manage banners
- **Responsive Design** - Works on all devices
- **Secure** - RLS policies, input validation, XSS protection

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Auth:** Supabase Auth

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/snapcart-v7.git

# Navigate to project
cd snapcart-v7

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Supabase credentials to .env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Run development server
npm run dev
```

## 🗄️ Database Setup

1. Create a Supabase project
2. Run `FINAL_SETUP.sql` in Supabase SQL Editor
3. Run `security_setup_safe.sql` for security enhancements
4. (Optional) Use scripts in `sql/` folder for admin tasks

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Input validation at database level
- XSS prevention
- Rate limiting
- Privilege escalation prevention

See `SECURITY.md` for full details.

## 📁 Project Structure

```
snapcart-v7/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom hooks (useAuth)
│   ├── utils/          # Utilities (security.js)
│   └── lib/            # Supabase client
├── sql/                # SQL utility scripts
├── public/             # Static assets
└── .env                # Environment variables (not in git)
```

## 🚀 Deployment

### Hostinger (or any static host)

```bash
# Build for production
npm run build

# Upload dist/ folder to Hostinger
# Set environment variables in Hostinger dashboard
```

### Netlify/Vercel (Recommended)

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

## 🔧 Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📝 Admin Tasks

Use SQL scripts in `sql/` folder:
- `add_admin.sql` - Add new admin
- `approve_seller.sql` - Approve seller manually
- `database_stats.sql` - View analytics
- See `sql/README.md` for full list

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Supabase for backend infrastructure
- React team for the framework
- Tailwind CSS for styling

---

**Status:** ✅ Production Ready
**Version:** 1.0.0
**Last Updated:** 2026-01-14
