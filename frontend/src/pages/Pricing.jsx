import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/payment/create-session');
      window.location.href = res.data.url;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Simple Pricing</h1>
          <p className="text-slate-600 text-lg">Choose the plan that works for you</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className="bg-white border border-slate-200 rounded-xl p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Free</h2>
              <p className="text-slate-500 text-sm">Get started for free</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">$0</span>
              <span className="text-slate-500 ml-1">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                '3 resume analyses per day',
                'ATS score + feedback',
                'Missing skills detection',
                'Basic suggestions',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-slate-700 text-sm">
                  <span className="text-emerald-500">✓</span>
                  {feature}
                </li>
              ))}
              {[
                'Unlimited analyses',
                'Priority processing',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-slate-400 text-sm">
                  <span>✗</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-indigo-600 border border-indigo-600 rounded-xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-emerald-400 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">
              POPULAR
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1">Premium</h2>
              <p className="text-indigo-200 text-sm">For serious job seekers</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">$9</span>
              <span className="text-indigo-200 ml-1">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Unlimited resume analyses',
                'ATS score + detailed feedback',
                'Missing skills detection',
                'Actionable suggestions',
                'Priority processing',
                'Cancel anytime',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-300">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition disabled:opacity-60"
            >
              {loading ? 'Redirecting...' : '⭐ Upgrade to Premium'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}