import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
import Contact from './pages/Contact';
import MyDownloads from './pages/MyDownloads';
import UserDashboard from './pages/UserDashboard';
import Checkout from './pages/Checkout';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStats from './pages/admin/AdminStats';
import AdminProducts from './pages/admin/AdminProducts';
import AdminInquiries from './pages/admin/AdminInquiries';

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

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Public Routes */}
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
          <Route path="/my-downloads" element={
            <>
              <Navbar />
              <MyDownloads />
              <Footer />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Navbar />
              <Contact />
              <Footer />
            </>
          } />
          <Route path="/dashboard" element={
            <>
              <Navbar />
              <UserDashboard />
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

          {/* Admin Routes - Protected */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout onLogout={() => {}} />
            </AdminProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminStats />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="inquiries" element={<AdminInquiries />} />
          </Route>

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
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;