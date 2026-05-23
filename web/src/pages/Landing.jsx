import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '📐', title: 'Xactimate-Mirrored Pricing',   desc: '178 San Diego area line items organized by Xactimate category codes. Labor/material split on every item.' },
  { icon: '📋', title: 'RSMeans MasterFormat Database', desc: '150+ RSMeans CSI division line items adjusted to San Diego City Cost Index. The same standard insurance adjusters use.' },
  { icon: '📈', title: 'Competitor Price Comparison',   desc: 'See exactly how your rates stack up against SERVPRO, Paul Davis, and ServiceMaster in the San Diego market.' },
  { icon: '💰', title: 'Auto O&P Calculation',          desc: '10%+10% overhead & profit applied automatically. Adjust per estimate. RCV, ACV, depreciation, and net claim calculated live.' },
  { icon: '📄', title: 'Branded PDF Export',            desc: 'Generate professional estimate PDFs with your company logo, license number, and all line item details.' },
  { icon: '🏢', title: 'Multi-Company Ready',           desc: 'Each company gets their own account, users, and estimates. Perfect for restoration franchises or multi-location contractors.' },
];

const TRADES = [
  'Water Mitigation','Drywall','Painting','Roofing','Plumbing',
  'Electrical','HVAC','Flooring','Tile & Stone','Cabinets',
  'Framing','Insulation','Mold Remediation','Concrete','Demolition',
  'Windows & Doors','Cleaning','Structural',
];

const PLANS = [
  { name:'Free',        price:0,   highlight:false, features:['5 estimates/mo','SD Xactimate pricing','PDF export','1 user'] },
  { name:'Pro',         price:79,  highlight:true,  features:['Unlimited estimates','RSMeans database','Competitor pricing','PDF export','3 users','Priority support'] },
  { name:'Team',        price:149, highlight:false, features:['Everything in Pro','10 users','API access','White-label PDF','Custom markup rules'] },
  { name:'Enterprise',  price:299, highlight:false, features:['Everything in Team','Unlimited users','Dedicated support','Custom training','SLA'] },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
            <span className="font-bold text-gray-900">BCS Estimator</span>
            <span className="text-xs text-gray-400 ml-1 hidden sm:inline">San Diego, CA</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 hidden sm:block">Features</a>
            <a href="#pricing"  className="text-sm text-gray-600 hover:text-gray-900 hidden sm:block">Pricing</a>
            <Link to="/login"   className="text-sm font-medium text-gray-700 hover:text-gray-900">Sign in</Link>
            <Link to="/register" className="btn-primary text-sm py-2">Start free →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900 text-white pt-20 pb-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/40 border border-blue-400/30 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-8">
            <span>🏙️</span> Built specifically for San Diego, CA contractors
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Professional Construction<br />
            <span className="text-blue-300">Estimating Platform</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Xactimate-mirrored pricing + RSMeans database + competitor comparison.
            Everything a San Diego restoration or construction company needs to estimate faster and win more jobs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-lg">
              Start for free — no card needed
            </Link>
            <Link to="/login" className="px-8 py-4 bg-blue-600/30 border border-blue-400/40 text-white rounded-xl font-bold text-lg hover:bg-blue-600/50 transition">
              Sign in to your account
            </Link>
          </div>
          <p className="text-blue-300 text-sm mt-6">178 SD line items · 150+ RSMeans items · 19 trade categories</p>
        </div>
      </section>

      {/* Trade categories ticker */}
      <div className="bg-gray-900 py-4 overflow-hidden">
        <div className="flex gap-4 animate-none">
          <div className="flex gap-4 whitespace-nowrap">
            {[...TRADES, ...TRADES].map((t, i) => (
              <span key={i} className="text-gray-400 text-sm font-medium px-3 py-1 bg-gray-800 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Everything you need to estimate confidently</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">San Diego-specific data, insurance-ready calculations, and professional output — in one platform.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-6 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Database stats */}
      <section className="py-16 px-6 bg-blue-700 text-white">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n:'178',    label:'SD Xactimate Line Items' },
            { n:'150+',   label:'RSMeans CSI Items' },
            { n:'19',     label:'Trade Categories' },
            { n:'17',     label:'Competitor Benchmarks' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold mb-1">{s.n}</p>
              <p className="text-blue-200 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-16">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step:'1', title:'Create an estimate', desc:'Select your client, job type, and start adding line items from the San Diego price list or RSMeans database.' },
              { step:'2', title:'Add line items',     desc:'Browse by Xactimate code or CSI division. Click to add. Set quantities. O&P and totals update instantly.' },
              { step:'3', title:'Export & submit',    desc:'Generate a professional PDF with BCS branding, RCV/ACV breakdown, and insurance claim fields pre-filled.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{s.step}</div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Simple, honest pricing</h2>
            <p className="text-gray-500">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {PLANS.map(plan => (
              <div key={plan.name}
                className={`card p-6 flex flex-col ${plan.highlight ? 'border-blue-500 border-2 shadow-lg ring-1 ring-blue-200' : ''}`}>
                {plan.highlight && (
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">Most Popular</div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-3 mb-6">
                  {plan.price === 0
                    ? <span className="text-3xl font-extrabold text-gray-900">Free</span>
                    : <><span className="text-3xl font-extrabold text-gray-900">${plan.price}</span><span className="text-gray-500 text-sm">/mo</span></>
                  }
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-500 mt-0.5">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link to="/register"
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold text-center transition
                    ${plan.highlight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {plan.price === 0 ? 'Start free' : `Get ${plan.name}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">B</div>
              <span className="text-white font-bold">BCS Estimator</span>
            </div>
            <p className="text-sm">Building Care Solutions · San Diego, CA 92122</p>
            <p className="text-sm">(858) 737-8499 · mig.buildingcaresolutions@gmail.com</p>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#pricing"  className="hover:text-white">Pricing</a>
            <Link to="/login"   className="hover:text-white">Sign in</Link>
            <Link to="/register" className="hover:text-white">Register</Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-800 text-xs text-center">
          Pricing data sourced from Xactimate SAN price list, RSMeans 2025/2026, and San Diego area market research.
          Not affiliated with Verisk Analytics, Xactware, or Gordian.
        </div>
      </footer>
    </div>
  );
}
