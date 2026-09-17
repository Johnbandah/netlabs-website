import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: Call API to update admin profile
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="text-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          My <span className="text-[#00D4FF]">Profile</span>
        </h1>
        <p className="text-[#B0C4DE] text-sm mt-1">Manage your admin account</p>
      </div>

      {saved && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400">
          ✅ Profile updated successfully
        </div>
      )}

      <div className="bg-[#1A2D4A] rounded-2xl p-6 border border-[#2A3D5A]">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#2A3D5A]">
          <div className="w-20 h-20 bg-gradient-to-br from-[#00D4FF] to-[#0066FF] rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-[#B0C4DE] text-sm">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-[#00D4FF]/20 text-[#00D4FF] rounded-full text-xs font-medium">
              Administrator
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-[#B0C4DE] mb-2">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#0A1628] text-white rounded-lg px-4 py-3 border border-[#2A3D5A] focus:outline-none focus:border-[#00D4FF] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[#B0C4DE] mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full bg-[#0A1628] text-[#B0C4DE] rounded-lg px-4 py-3 border border-[#2A3D5A] cursor-not-allowed"
              />
              <p className="text-xs text-[#4A6A8A] mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm text-[#B0C4DE] mb-2">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Enter your phone number"
                className="w-full bg-[#0A1628] text-white rounded-lg px-4 py-3 border border-[#2A3D5A] focus:outline-none focus:border-[#00D4FF] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[#B0C4DE] mb-2">Role</label>
              <input
                type="text"
                value="Administrator"
                disabled
                className="w-full bg-[#0A1628] text-[#B0C4DE] rounded-lg px-4 py-3 border border-[#2A3D5A] cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#B0C4DE] mb-2">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Enter your address"
              className="w-full bg-[#0A1628] text-white rounded-lg px-4 py-3 border border-[#2A3D5A] focus:outline-none focus:border-[#00D4FF] transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0066FF] text-white font-semibold rounded-lg hover:scale-105 transition-all shadow-lg shadow-[#00D4FF]/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}