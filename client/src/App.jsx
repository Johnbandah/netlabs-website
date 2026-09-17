import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
// ===== ADD THIS IMPORT =====
import { LogProvider } from './context/LogContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UserLayout from './components/UserLayout';
import Hero from './components/Hero';
import ImageCarousel from './components/ImageCarousel';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Industries from './components/Industries';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import ServicesPage from './pages/Services';
import Projects from './pages/Projects';
import Store from './pages/Store';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import QuoteRequest from './pages/QuoteRequest';
import MyDownloads from './pages/MyDownloads';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import ChangePassword from './pages/ChangePassword';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminProducts from './pages/admin/AdminProducts';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminQuoteRequests from './pages/admin/AdminQuoteRequests';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBlog from './pages/admin/AdminBlog';
// ===== ADD THIS IMPORT =====
import SystemLogs from './pages/SystemLogs';

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <section className="py-12 bg-[#E8F4FD]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#1A3A5C] mb-4">Our Network Solutions in Action</h2>
          <ImageCarousel />
        </div>
      </section>
      <Services />
      <WhyChooseUs />
      <Industries />
      <Footer />
    </>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Protected admin route
  const AdminProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D4FF]"></div>
        </div>
      );
    }
    if (!user || user.role !== 'admin') {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Protected user route
  const UserProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D4FF]"></div>
        </div>
      );
    }
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Public Routes - No Sidebar */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={
            <>
              <Navbar />
              <Login />
              <Footer />
            </>
          } />
          <Route path="/register" element={
            <>
              <Navbar />
              <Register />
              <Footer />
            </>
          } />
          <Route path="/about" element={
            <>
              <Navbar />
              <About />
              <Footer />
            </>
          } />
          <Route path="/services" element={
            <>
              <Navbar />
              <ServicesPage />
              <Footer />
            </>
          } />
          <Route path="/projects" element={
            <>
              <Navbar />
              <Projects />
              <Footer />
            </>
          } />
          <Route path="/store" element={
            <>
              <Navbar />
              <Store />
              <Footer />
            </>
          } />
          <Route path="/blog" element={
            <>
              <Navbar />
              <Blog />
              <Footer />
            </>
          } />
          <Route path="/blog/:slug" element={
            <>
              <Navbar />
              <BlogDetail />
              <Footer />
            </>
          } />
          <Route path="/checkout" element={
            <>
              <Navbar />
              <Checkout />
              <Footer />
            </>
          } />
          <Route path="/quote-request" element={
            <>
              <Navbar />
              <QuoteRequest />
              <Footer />
            </>
          } />

          {/* User Routes - With Sidebar (UserLayout) */}
          <Route path="/dashboard" element={
            <UserProtectedRoute>
              <UserLayout />
            </UserProtectedRoute>
          }>
            <Route index element={<UserDashboard />} />
          </Route>
          <Route path="/my-downloads" element={
            <UserProtectedRoute>
              <UserLayout />
            </UserProtectedRoute>
          }>
            <Route index element={<MyDownloads />} />
          </Route>
          <Route path="/orders" element={
            <UserProtectedRoute>
              <UserLayout />
            </UserProtectedRoute>
          }>
            <Route index element={<OrderHistory />} />
          </Route>
          <Route path="/profile" element={
            <UserProtectedRoute>
              <UserLayout />
            </UserProtectedRoute>
          }>
            <Route index element={<UserProfile />} />
          </Route>
          <Route path="/change-password" element={
            <UserProtectedRoute>
              <UserLayout />
            </UserProtectedRoute>
          }>
            <Route index element={<ChangePassword />} />
          </Route>
          <Route path="/wishlist" element={
            <UserProtectedRoute>
              <UserLayout />
            </UserProtectedRoute>
          }>
            <Route index element={<Wishlist />} />
          </Route>
          <Route path="/contact" element={
            <UserProtectedRoute>
              <UserLayout />
            </UserProtectedRoute>
          }>
            <Route index element={<Contact />} />
          </Route>

          {/* Admin Routes - Protected */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="quote-requests" element={<AdminQuoteRequests />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="blog" element={<AdminBlog />} />
            {/* ===== ADD THIS ROUTE ===== */}
            <Route path="system-logs" element={<SystemLogs />} />
          </Route>

          {/* ===== ADD SYSTEM LOGS ROUTE (Alternative direct access) ===== */}
          <Route path="/system-logs" element={
            <AdminProtectedRoute>
              <>
                <Navbar />
                <SystemLogs />
                <Footer />
              </>
            </AdminProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <>
              <Navbar />
              <div className="min-h-screen flex items-center justify-center pt-20 bg-[#0A1628]">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-[#00D4FF]">404</h1>
                  <p className="text-white text-xl mt-4">Page Not Found</p>
                  <a href="/" className="text-[#00D4FF] hover:underline mt-4 inline-block">Go Home</a>
                </div>
              </div>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    // ===== WRAP WITH LogProvider =====
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <LogProvider>
            <AppContent />
          </LogProvider>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;