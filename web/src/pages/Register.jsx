import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]   = useState({ username:'', email:'', password:'', full_name:'', company_name:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center font-bold text-xl">B</div>
            <span className="text-xl font-bold">BCS Estimator</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create your free account</h1>
          <p className="text-blue-200 mt-1">No credit card required</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}
          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" type="text" required autoFocus
                value={form.full_name} placeholder="Miguel Sanchez"
                onChange={set('full_name')} />
            </div>
            <div>
              <label className="label">Company Name</label>
              <input className="input" type="text"
                value={form.company_name} placeholder="Building Care Solutions"
                onChange={set('company_name')} />
            </div>
            <div>
              <label className="label">Username</label>
              <input className="input" type="text" required
                value={form.username} placeholder="miguel_bcs"
                onChange={set('username')} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" required
                value={form.email} placeholder="you@company.com"
                onChange={set('email')} />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" required minLength={8}
                value={form.password} placeholder="8+ characters"
                onChange={set('password')} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Creating account…' : 'Create free account →'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            Free plan: 5 estimates/mo, SD pricing, PDF export
          </p>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
