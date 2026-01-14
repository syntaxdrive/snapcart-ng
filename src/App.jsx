import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ApprovalNotification from './components/ApprovalNotification';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Stores from './pages/Stores';
import StoreDetails from './pages/StoreDetails';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import SellerApplication from './pages/SellerApplication';
import Contact from './pages/Contact';
import SellerDashboard from './pages/SellerDashboard';
import ErrorBoundary from './components/ErrorBoundary';

// Layout wrapper to conditionally show things like Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ApprovalNotification />
      <main className="flex-grow bg-[var(--color-bg)] text-[var(--color-text)]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/store/:sellerId" element={<StoreDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/auth" element={<Login />} />
            <Route path="/apply-seller" element={<SellerApplication />} />
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
