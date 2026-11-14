import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BLOG_POSTS } from '../data/blogData';
import { Subscriber } from '../types';

const ADMIN_EMAIL = 'said.cpge24@gmail.com';

const INITIAL_SUBS: Subscriber[] = [
  { email: 'sarah.k@gmail.com', plan: 'pro', date: '2026-10-28', status: 'active', amount: 6.0 },
  { email: 'elena.b@outlook.com', plan: 'pro', date: '2026-10-27', status: 'active', amount: 6.0 },
  { email: 'chloe.m@yahoo.com', plan: 'free', date: '2026-10-25', status: 'active', amount: 0.0 },
  { email: 'maya.jewelry@gmail.com', plan: 'pro', date: '2026-10-24', status: 'active', amount: 6.0 },
  { email: 'jessica.w@gmail.com', plan: 'free', date: '2026-10-22', status: 'active', amount: 0.0 },
];

export const DashboardPage: React.FC = () => {
  const { currentUser, login, logout, formatPrice, navigate } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers' | 'blog' | 'settings'>('overview');
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('koo_subscribers') || JSON.stringify(INITIAL_SUBS));
    } catch {
      return INITIAL_SUBS;
    }
  });

  const [adminEmailInput, setAdminEmailInput] = useState(ADMIN_EMAIL);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginMsg, setLoginMsg] = useState('');

  // New subscriber inputs
  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubPlan, setNewSubPlan] = useState<'pro' | 'free'>('pro');

  const isAdmin = currentUser?.email && currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMsg('Verifying credentials...');
    const res = await login(adminEmailInput, adminPasswordInput);
    if (res.error) {
      setLoginMsg(`Login error: ${res.error}`);
    } else {
      setLoginMsg('');
    }
  };

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail.trim()) return;

    const newSub: Subscriber = {
      email: newSubEmail.trim(),
      plan: newSubPlan,
      date: new Date().toISOString().slice(0, 10),
      status: 'active',
      amount: newSubPlan === 'pro' ? 6.0 : 0.0,
    };

    const updated = [newSub, ...subscribers];
    setSubscribers(updated);
    localStorage.setItem('koo_subscribers', JSON.stringify(updated));
    setNewSubEmail('');
  };

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-md px-5 py-24 text-center">
        <div className="glass p-8 rounded-3xl shadow-2xl">
          <div className="text-3xl mb-2">🔐</div>
          <h1 className="serif text-3xl gt">McGee Admin Portal</h1>
          <p className="muted text-xs mt-1 mb-6">Restricted to authorized administrators.</p>

          <form onSubmit={handleAdminLogin} className="flex flex-col gap-3 text-left">
            <label className="fld">
              <span>Admin Email</span>
              <input
                type="email"
                value={adminEmailInput}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                required
              />
            </label>
            <label className="fld">
              <span>Password</span>
              <input
                type="password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                required
                placeholder="••••••••"
              />
            </label>
            <button type="submit" className="btn btn-gold w-full mt-4 justify-center">
              Sign In to Admin
            </button>
            {loginMsg && <p className="text-xs text-center mt-2 text-red-400">{loginMsg}</p>}
          </form>

          <div className="mt-6 pt-4 border-t border-rose-200/10">
            <button onClick={() => navigate('index')} className="muted text-xs hover:underline bg-transparent border-0 cursor-pointer">
              &larr; Back to Public Studio
            </button>
          </div>
        </div>
      </main>
    );
  }

  const proSubs = subscribers.filter((s) => s.plan === 'pro');
  const mrr = proSubs.reduce((acc, s) => acc + s.amount, 0);

  return (
    <div className="min-h-screen grid lg:grid-cols-[16rem_1fr]">
      {/* Sidebar */}
      <aside className="p-6 border-r border-rose-200/15 bg-slate-900/40 backdrop-blur-md flex flex-col justify-between">
        <div>
          <button
            onClick={() => navigate('index')}
            className="brand flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0 text-left"
          >
            <span className="serif gt text-2xl font-bold">McGee</span>
            <span className="text-[10px] tracking-widest text-[#b76e79] font-sans uppercase font-bold">
              ADMIN
            </span>
          </button>

          <nav className="flex flex-col gap-1.5 mt-8" aria-label="Admin tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`chip text-xs py-2.5 px-3 block text-left cursor-pointer ${
                activeTab === 'overview' ? 'border-rose-400 bg-rose-500/10 font-bold' : ''
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`chip text-xs py-2.5 px-3 block text-left cursor-pointer ${
                activeTab === 'subscribers' ? 'border-rose-400 bg-rose-500/10 font-bold' : ''
              }`}
            >
              👥 Subscribers ({subscribers.length})
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`chip text-xs py-2.5 px-3 block text-left cursor-pointer ${
                activeTab === 'blog' ? 'border-rose-400 bg-rose-500/10 font-bold' : ''
              }`}
            >
              ✍️ Blog Manager ({BLOG_POSTS.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`chip text-xs py-2.5 px-3 block text-left cursor-pointer ${
                activeTab === 'settings' ? 'border-rose-400 bg-rose-500/10 font-bold' : ''
              }`}
            >
              ⚙️ Settings
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-rose-200/15 text-xs">
          <p className="muted font-mono truncate">{currentUser.email}</p>
          <button onClick={logout} className="text-red-400 hover:underline mt-1 bg-transparent border-0 p-0 cursor-pointer">
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-6 md:p-10 max-w-5xl w-full">
        {activeTab === 'overview' && (
          <div className="fade">
            <h1 className="serif text-3xl sm:text-4xl gt mb-6">Performance Overview</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="glass p-5 rounded-2xl">
                <span className="muted text-xs uppercase tracking-wider">Total Articles</span>
                <p className="serif text-3xl gt mt-1">{BLOG_POSTS.length}</p>
              </div>
              <div className="glass p-5 rounded-2xl">
                <span className="muted text-xs uppercase tracking-wider">Pro Members</span>
                <p className="serif text-3xl gt mt-1">{proSubs.length}</p>
              </div>
              <div className="glass p-5 rounded-2xl">
                <span className="muted text-xs uppercase tracking-wider">Estimated MRR</span>
                <p className="serif text-3xl text-emerald-400 mt-1">{formatPrice(mrr)}</p>
              </div>
              <div className="glass p-5 rounded-2xl">
                <span className="muted text-xs uppercase tracking-wider">Active Studios</span>
                <p className="serif text-3xl gt mt-1">12</p>
              </div>
            </div>

            <div className="glass p-6 rounded-3xl">
              <h2 className="serif text-2xl gt mb-3">Quick Navigation</h2>
              <p className="muted text-xs mb-4">Jump directly into any customer-facing studio to test experience:</p>
              <div className="flex flex-wrap gap-2">
                {['vault', 'planner', 'sizing', 'styling', 'care', 'gold', 'diamond'].map((slug) => (
                  <button key={slug} onClick={() => navigate(slug)} className="btn btn-ghost text-xs py-1.5 px-3">
                    {slug} &rarr;
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="fade">
            <div className="flex items-center justify-between mb-6">
              <h1 className="serif text-3xl sm:text-4xl gt">Subscribers & Members</h1>
              <span className="chip text-xs">Total: {subscribers.length}</span>
            </div>

            {/* Add Subscriber Form */}
            <form onSubmit={handleAddSubscriber} className="glass p-5 rounded-2xl mb-6 flex flex-wrap gap-3 items-end">
              <label className="fld flex-1 min-w-[200px]">
                <span className="text-xs">Add Subscriber Email</span>
                <input
                  type="email"
                  required
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </label>
              <label className="fld w-32">
                <span className="text-xs">Plan Tier</span>
                <select value={newSubPlan} onChange={(e) => setNewSubPlan(e.target.value as any)}>
                  <option value="pro">Pro ($6)</option>
                  <option value="free">Free</option>
                </select>
              </label>
              <button type="submit" className="btn btn-gold text-xs py-3 px-4">
                + Add Member
              </button>
            </form>

            <div className="glass p-6 rounded-3xl overflow-x-auto">
              <table className="w-full text-left text-sm" style={{ minWidth: '32rem' }}>
                <thead>
                  <tr className="border-b border-rose-200/20 text-xs uppercase tracking-wider muted">
                    <th className="pb-3 px-3">Email Address</th>
                    <th className="pb-3 px-3">Plan</th>
                    <th className="pb-3 px-3">Subscribed Date</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Monthly</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub, i) => (
                    <tr key={i} className="border-t border-rose-200/10">
                      <td className="py-3 px-3 font-mono text-xs">{sub.email}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`chip text-[10px] py-0.5 px-2 ${
                            sub.plan === 'pro' ? 'border-amber-400 text-amber-300 font-bold' : ''
                          }`}
                        >
                          {sub.plan.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs muted">{sub.date}</td>
                      <td className="py-3 px-3">
                        <span className="text-emerald-400 text-xs">● Active</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs">
                        {formatPrice(sub.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="fade">
            <h1 className="serif text-3xl sm:text-4xl gt mb-6">Published Editorial Guides</h1>
            <div className="grid gap-3">
              {BLOG_POSTS.map((post) => (
                <div key={post.url} className="glass p-5 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="chip text-[10px] py-0.5 px-2">{post.cat}</span>
                      <span className="text-xs text-emerald-400 font-medium">● Published Live</span>
                    </div>
                    <h3 className="serif text-xl gt font-medium mt-1">{post.title}</h3>
                    <p className="muted text-xs mt-0.5">{post.read} &middot; {post.date}</p>
                  </div>
                  <button
                    onClick={() => navigate(post.url)}
                    className="btn btn-ghost text-xs py-1.5 px-3 shrink-0"
                  >
                    View Post &rarr;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="fade">
            <h1 className="serif text-3xl sm:text-4xl gt mb-6">Studio & Production Settings</h1>
            <div className="glass p-6 sm:p-8 rounded-3xl grid gap-5 max-w-xl">
              <label className="fld">
                <span>Production Domain</span>
                <input readOnly value="https://mcgeejewelry.com" className="font-mono text-xs" />
              </label>
              <label className="fld">
                <span>GitHub Repository</span>
                <input readOnly value="SAJAD-52/cnyjewelry" className="font-mono text-xs" />
              </label>
              <label className="fld">
                <span>Brand Niche</span>
                <textarea
                  readOnly
                  rows={3}
                  value="Fine jewelry: rings, necklaces, earrings, bracelets, gold scrap value, diamond visualizers, and care guides."
                  className="text-xs"
                />
              </label>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
