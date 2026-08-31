import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaCreditCard, FaLock } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setOrderPlaced(true);
      clearCart();
    }, 2000);
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="pt-20 min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="bg-[#1A2D4A] p-8 rounded-2xl border border-[#2A3D5A] text-center">
          <p className="text-3xl mb-4">🛒</p>
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-[#B0C4DE] mb-6">Browse our store and add some resources!</p>
          <Link to="/store" className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all inline-block">
            Browse Store
          </Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="pt-20 min-h-screen bg-[#0A1628] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1A2D4A] p-8 rounded-2xl border border-green-500/50 text-center max-w-md w-full"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-2">Order Placed!</h2>
          <p className="text-[#B0C4DE] mb-4">Thank you for your purchase! You will receive a confirmation email shortly.</p>
          <p className="text-[#00D4FF] text-sm mb-6">Your download links are now available in your account.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/my-downloads" className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all">
              Go to Downloads
            </Link>
            <Link to="/" className="px-6 py-3 border border-[#00D4FF] text-[#00D4FF] font-semibold rounded-lg hover:bg-[#00D4FF] hover:text-[#0A1628] transition-all">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const total = getCartTotal();

  return (
    <div className="pt-20 min-h-screen bg-[#0A1628]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/store" className="text-[#B0C4DE] hover:text-[#00D4FF] transition-all">
            <FaArrowLeft className="text-xl" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-[#1A2D4A] rounded-xl border border-[#2A3D5A] p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 pb-4 border-b border-[#2A3D5A] last:border-0"
                  >
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <p className="text-[#B0C4DE] text-sm">{item.category}</p>
                      <p className="text-[#00D4FF] font-semibold">{formatCurrency(item.price)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-1 bg-[#0A1628] text-[#B0C4DE] rounded hover:text-white transition-all"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="text-white w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1 bg-[#0A1628] text-[#B0C4DE] rounded hover:text-white transition-all"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-400 hover:text-red-300 transition-all"
                    >
                      <FaTrash />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A2D4A] rounded-xl border border-[#2A3D5A] p-6 sticky top-24">
              <h2 className="text-white font-semibold text-lg mb-4">Payment Summary</h2>
              
              <div className="space-y-3 text-[#B0C4DE]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className="border-t border-[#2A3D5A] pt-3 flex justify-between font-bold text-white text-lg">
                  <span>Total</span>
                  <span className="text-[#00D4FF]">{formatCurrency(total)}</span>
                </div>
              </div>

              {!user && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm text-center">
                  ⚠️ Please login to complete your purchase
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={processing || !user}
                className={`w-full mt-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  processing || !user ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FaCreditCard />
                    Place Order
                  </span>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#B0C4DE]">
                <FaLock className="text-[10px]" />
                Secure payment powered by Stripe
              </div>

              {!user && (
                <Link
                  to="/login"
                  className="block mt-3 text-center text-sm text-[#00D4FF] hover:underline"
                >
                  Login to purchase →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}