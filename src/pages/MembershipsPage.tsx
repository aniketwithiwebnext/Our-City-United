import React, { useState } from 'react';
import { Check, Sparkles, Shield, CreditCard, CheckCircle2 } from 'lucide-react';
import { MEMBERSHIP_PLANS } from '../data/mockData';
import { MembershipPlan } from '../types';

interface MembershipsPageProps {
  onSelectPlan: (planId: string) => void;
}

export const MembershipsPage: React.FC<MembershipsPageProps> = ({ onSelectPlan }) => {
  const [checkoutModalPlan, setCheckoutModalPlan] = useState<MembershipPlan | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [cardName, setCardName] = useState('');

  const handleStripeCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardName) {
      setCheckoutSuccess(true);
      setTimeout(() => {
        setCheckoutSuccess(false);
        setCheckoutModalPlan(null);
        setCardName('');
        onSelectPlan(checkoutModalPlan?.id || 'free');
      }, 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-sans">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/30">
          Our City United LLC • Membership Plans
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
          Choose the Right Plan for Your Socorro Business
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm">
          No long-term commitments. Upgrade or downgrade anytime. Empower your business with local search visibility and AI lead generation.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {MEMBERSHIP_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`glass-panel rounded-3xl p-8 flex flex-col justify-between space-y-6 relative border ${
              plan.popular
                ? 'border-amber-400 shadow-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950/80 scale-105 z-10'
                : 'border-slate-800'
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                {plan.badge}
              </span>
            )}

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white font-heading">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white font-heading">{plan.price}</span>
                <span className="text-xs text-slate-400">{plan.period}</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                if (plan.id === 'free') {
                  onSelectPlan('free');
                } else {
                  setCheckoutModalPlan(plan);
                }
              }}
              className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
                plan.popular
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-800'
              }`}
            >
              {plan.id === 'free' ? 'Get Started Free' : `Upgrade to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      {/* Stripe Simulated Checkout Modal */}
      {checkoutModalPlan && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <h3 className="text-white font-bold text-base font-heading">
                  Stripe Checkout • {checkoutModalPlan.name} Plan
                </h3>
              </div>
              <button onClick={() => setCheckoutModalPlan(null)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            {checkoutSuccess ? (
              <div className="p-4 bg-emerald-950 text-emerald-300 text-xs rounded-2xl border border-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <span>Payment successful! Welcome to Our City United LLC {checkoutModalPlan.name} Membership.</span>
              </div>
            ) : (
              <form onSubmit={handleStripeCheckout} className="space-y-4">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center text-slate-300">
                  <span>Selected Membership:</span>
                  <strong className="text-amber-400 font-bold">{checkoutModalPlan.price} {checkoutModalPlan.period}</strong>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Full Name on Card"
                    required
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Card Number (Simulated)</label>
                  <input
                    type="text"
                    placeholder="4242 •••• •••• 4242"
                    defaultValue="4242 4242 4242 4242"
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="12/28"
                      className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">CVC</label>
                    <input
                      type="text"
                      placeholder="CVC"
                      defaultValue="123"
                      className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow"
                >
                  Confirm & Pay {checkoutModalPlan.price}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
