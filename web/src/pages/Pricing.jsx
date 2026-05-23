import React from 'react';
import { Link } from 'react-router-dom';

const PLANS = [
  {
    name: 'Free',
    price: 0,
    highlight: false,
    features: ['5 estimates/month', 'SD Xactimate pricing (178 items)', 'PDF export', '1 user', 'Basic support'],
    missing: ['RSMeans database', 'Competitor pricing', 'Unlimited estimates'],
  },
  {
    name: 'Pro',
    price: 79,
    highlight: true,
    features: ['Unlimited estimates', 'SD Xactimate pricing (178 items)', 'RSMeans MasterFormat database (150+ items)', 'Competitor price comparison', 'PDF export with BCS branding', '3 users', 'Priority email support'],
    missing: [],
  },
  {
    name: 'Team',
    price: 149,
    highlight: false,
    features: ['Everything in Pro', '10 users', 'API access', 'White-label PDF', 'Custom markup rules', 'Phone support'],
    missing: [],
  },
  {
    name: 'Enterprise',
    price: 299,
    highlight: false,
    features: ['Everything in Team', 'Unlimited users', 'Dedicated account manager', 'Custom training sessions', '99.9% SLA', 'Custom integrations'],
    missing: [],
  },
];

const FAQ = [
  { q:'Can I change plans later?', a:'Yes — upgrade or downgrade any time. Changes take effect at the next billing cycle.' },
  { q:'Is the pricing data current?', a:'San Diego Xactimate pricing is updated Q1 and Q3. RSMeans data reflects the 2025/2026 edition with San Diego City Cost Index applied.' },
  { q:'What payment methods do you accept?', a:'All major credit cards (Visa, MC, Amex, Discover). Annual plans available at 2 months free.' },
  { q:'Is there a free trial for Pro?', a:'The Free plan is a full product with real pricing data. Upgrade to Pro when you need RSMeans or unlimited estimates.' },
  { q:'Can multiple estimators share one account?', a:'Pro supports 3 users, Team supports 10, Enterprise is unlimited. Each user gets their own login and estimate history.' },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-gray-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Simple, honest pricing</h1>
        <p className="text-blue-200 text-xl max-w-2xl mx-auto">Start free. Upgrade when your business needs more. No hidden fees, no long-term contracts.</p>
        <p className="text-blue-300 text-sm mt-4">San Diego, CA · All plans include SD Xactimate pricing</p>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 pb-20">
        <div className="grid md:grid-cols-4 gap-5">
          {PLANS.map(plan => (
            <div key={plan.name}
              className={`bg-white rounded-2xl p-6 flex flex-col shadow-sm ${plan.highlight ? 'border-2 border-blue-500 shadow-lg ring-1 ring-blue-200 -mt-4 pb-10' : 'border border-gray-200'}`}>
              {plan.highlight && (
                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">⭐ Most Popular</div>
              )}
              <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
              <div className="mt-3 mb-6">
                {plan.price === 0
                  ? <span className="text-4xl font-extrabold text-gray-900">Free</span>
                  : <><span className="text-4xl font-extrabold text-gray-900">${plan.price}</span><span className="text-gray-400 text-sm">/mo</span></>
                }
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-500 mt-0.5 shrink-0">✓</span>{f}
                  </li>
                ))}
                {plan.missing.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300 line-through">
                    <span className="mt-0.5 shrink-0">✗</span>{f}
                  </li>
                ))}
              </ul>
              <Link to="/register"
                className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition
                  ${plan.highlight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {plan.price === 0 ? 'Start free →' : `Get ${plan.name} →`}
              </Link>
            </div>
          ))}
        </div>

        {/* Feature comparison table */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Full feature comparison</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase">
                <th className="text-left px-6 py-3 w-1/3">Feature</th>
                {PLANS.map(p => <th key={p.name} className={`text-center px-4 py-3 ${p.highlight ? 'text-blue-700 bg-blue-50' : ''}`}>{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ['Estimates / month',            'Up to 5',  'Unlimited', 'Unlimited', 'Unlimited'],
                ['SD Xactimate pricing',          '✓','✓','✓','✓'],
                ['RSMeans database',              '—','✓','✓','✓'],
                ['Competitor pricing',            '—','✓','✓','✓'],
                ['PDF export',                    '✓','✓','✓','✓'],
                ['White-label PDF',               '—','—','✓','✓'],
                ['Users',                         '1','3','10','Unlimited'],
                ['API access',                    '—','—','✓','✓'],
                ['Custom markup rules',           '—','—','✓','✓'],
                ['Support',                       'Email','Priority email','Phone','Dedicated'],
                ['SLA',                           '—','—','—','99.9%'],
              ].map(([feat, ...vals]) => (
                <tr key={feat} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-6 py-3 text-gray-700 font-medium">{feat}</td>
                  {vals.map((v, i) => (
                    <td key={i} className={`px-4 py-3 text-center ${PLANS[i].highlight ? 'bg-blue-50/50' : ''} ${v==='✓'?'text-blue-600 font-bold':v==='—'?'text-gray-300':'text-gray-700'}`}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently asked questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {FAQ.map(item => (
              <div key={item.q} className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="font-semibold text-gray-900 mb-2">{item.q}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-blue-700 rounded-2xl text-white text-center py-12 px-6">
          <h2 className="text-2xl font-bold mb-3">Ready to estimate faster?</h2>
          <p className="text-blue-200 mb-6">Join San Diego contractors using BCS Estimator to win more jobs.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="px-8 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition">Start free — no card needed</Link>
            <Link to="/login"    className="px-8 py-3 bg-blue-600/40 border border-blue-400/40 rounded-xl font-bold hover:bg-blue-600/60 transition">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
