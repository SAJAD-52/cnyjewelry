import React, { useState, useEffect, useCallback } from 'react';
import { useApp, supabase } from '../context/AppContext';
import { BLOG_POSTS } from '../data/blogData';
import { Subscriber } from '../types';

const ADMIN_EMAIL = 'said.cpge24@gmail.com';

const ADMIN_SQL_SETUP = [
  "insert into public.admins (user_id, notes)",
  "select id, 'Primary Owner' from auth.users where lower(email) = 'said.cpge24@gmail.com'",
  "on conflict (user_id) do nothing;",
  "",
  "create or replace function public.is_admin_user()",
  "returns boolean language sql security definer stable set search_path = public, auth as $$",
  "  select auth.uid() is not null and (",
  "    exists (select 1 from public.admins where user_id = auth.uid())",
  "    or exists (select 1 from auth.users where id = auth.uid() and lower(email) = 'said.cpge24@gmail.com')",
  "  );",
  "$$;",
  "",
  "create or replace function public.admin_list_accounts()",
  "returns table (user_id uuid, email text, created_at timestamptz, email_confirmed_at timestamptz, last_sign_in_at timestamptz, plan text, sub_status text, current_period_end timestamptz, is_admin boolean, pieces_count bigint)",
  "language plpgsql security definer set search_path = public, auth as $$",
  "begin",
  "  if not public.is_admin_user() then raise exception 'Forbidden: admin access required'; end if;",
  "  return query",
  "  select u.id, u.email::text, u.created_at, u.email_confirmed_at, u.last_sign_in_at,",
  "    case when (s.status in ('active','trialing') and s.current_period_end > now()) or a.user_id is not null or lower(u.email) = 'said.cpge24@gmail.com' then 'pro' else 'free' end,",
  "    coalesce(s.status,'free')::text, s.current_period_end,",
  "    (a.user_id is not null or lower(u.email) = 'said.cpge24@gmail.com'),",
  "    coalesce(p.cnt, 0)::bigint",
  "  from auth.users u",
  "  left join public.subscriptions s on s.user_id = u.id",
  "  left join public.admins a on a.user_id = u.id",
  "  left join (select pc.user_id, count(*)::bigint as cnt from public.pieces pc group by pc.user_id) p on p.user_id = u.id",
  "  order by u.created_at desc;",
  "end; $$;",
  "",
  "create or replace function public.admin_set_user_plan(target_user_id uuid, new_plan text)",
  "returns void language plpgsql security definer set search_path = public, auth as $$",
  "begin",
  "  if not public.is_admin_user() then raise exception 'Forbidden: admin access required'; end if;",
  "  if new_plan = 'pro' then",
  "    insert into public.subscriptions (user_id, status, current_period_end, updated_at) values (target_user_id, 'active', now() + interval '1 year', now())",
  "    on conflict (user_id) do update set status = 'active', current_period_end = greatest(coalesce(public.subscriptions.current_period_end, now()), now() + interval '1 year'), updated_at = now();",
  "  else",
  "    insert into public.subscriptions (user_id, status, current_period_end, updated_at) values (target_user_id, 'canceled', now(), now())",
  "    on conflict (user_id) do update set status = 'canceled', current_period_end = now(), updated_at = now();",
  "  end if;",
  "end; $$;",
  "",
  "create or replace function public.admin_grant_pro_by_email(target_email text, new_plan text default 'pro')",
  "returns uuid language plpgsql security definer set search_path = public, auth as $$",
  "declare uid uuid;",
  "begin",
  "  if not public.is_admin_user() then raise exception 'Forbidden: admin access required'; end if;",
  "  select id into uid from auth.users where lower(email) = lower(trim(target_email)) limit 1;",
  "  if uid is null then raise exception 'No registered user found with email: %', target_email; end if;",
  "  perform public.admin_set_user_plan(uid, new_plan);",
  "  return uid;",
  "end; $$;",
  "",
  "create or replace function public.admin_delete_user(target_user_id uuid)",
  "returns void language plpgsql security definer set search_path = public, auth as $$",
  "begin",
  "  if not public.is_admin_user() then raise exception 'Forbidden: admin access required'; end if;",
  "  if target_user_id = auth.uid() then raise exception 'Cannot delete your own admin account'; end if;",
  "  delete from auth.users where id = target_user_id;",
  "end; $$;",
  "",
  "revoke all on function public.is_admin_user() from public; grant execute on function public.is_admin_user() to authenticated;",
  "revoke all on function public.admin_list_accounts() from public; grant execute on function public.admin_list_accounts() to authenticated;",
  "revoke all on function public.admin_set_user_plan(uuid, text) from public; grant execute on function public.admin_set_user_plan(uuid, text) to authenticated;",
  "revoke all on function public.admin_grant_pro_by_email(text, text) from public; grant execute on function public.admin_grant_pro_by_email(text, text) to authenticated;",
  "revoke all on function public.admin_delete_user(uuid) from public; grant execute on function public.admin_delete_user(uuid) to authenticated;",
].join('\n');

export const DashboardPage: React.FC = () => {
  const { currentUser, login, logout, formatPrice, navigate } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers' | 'blog' | 'settings'>('overview');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subsError, setSubsError] = useState('');
  const [needsSqlSetup, setNeedsSqlSetup] = useState(false);
  const [sqlCopyStatus, setSqlCopyStatus] = useState('');

  const [subSearch, setSubSearch] = useState('');
  const [subFilter, setSubFilter] = useState<'all' | 'pro' | 'free' | 'pending'>('all');
  const [actionFeedback, setActionFeedback] = useState<{ msg: string; err: boolean } | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const [adminEmailInput, setAdminEmailInput] = useState(ADMIN_EMAIL);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginMsg, setLoginMsg] = useState('');

  // Grant / revoke Pro by registered email
  const [targetEmailInput, setTargetEmailInput] = useState('');
  const [targetPlanInput, setTargetPlanInput] = useState<'pro' | 'free'>('pro');
  const [grantLoading, setGrantLoading] = useState(false);

  const isAdmin = Boolean(
    currentUser?.email && currentUser.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase()
  );

  // Purge legacy dummy subscriber cache if present
  useEffect(() => {
    try {
      localStorage.removeItem('koo_subscribers');
    } catch {
      // ignore storage errors
    }
  }, []);

  const loadSubscribers = useCallback(async () => {
    if (!isAdmin) return;
    setSubsLoading(true);
    setSubsError('');
    setNeedsSqlSetup(false);
    try {
      const { data, error } = await supabase.rpc('admin_list_accounts');
      if (error) {
        const msg = error.message || '';
        if (
          error.code === 'PGRST202' ||
          error.code === '42883' ||
          /Could not find the function/i.test(msg)
        ) {
          setNeedsSqlSetup(true);
          setSubsError(
            'Supabase admin RPC functions are not installed yet. Run the one-time SQL setup in Supabase SQL Editor to see live registered customers.'
          );
        } else {
          setSubsError(msg || 'Could not load accounts from Supabase.');
        }
        setSubscribers([]);
      } else {
        const rows: Subscriber[] = (data || []).map((r: any) => ({
          user_id: r.user_id,
          email: r.email || 'Unknown',
          plan: r.plan === 'pro' ? 'pro' : 'free',
          date: r.created_at ? String(r.created_at).slice(0, 10) : '',
          confirmed: Boolean(r.email_confirmed_at),
          lastSignIn: r.last_sign_in_at ? String(r.last_sign_in_at).slice(0, 10) : 'Never',
          status: r.sub_status || (r.plan === 'pro' ? 'active' : 'free'),
          isAdmin: Boolean(r.is_admin),
          piecesCount: Number(r.pieces_count) || 0,
          amount: r.plan === 'pro' && !r.is_admin ? 6.0 : 0.0,
        }));
        setSubscribers(rows);
      }
    } catch (err: any) {
      setSubsError(err?.message || 'Network error loading accounts.');
      setSubscribers([]);
    } finally {
      setSubsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      loadSubscribers();
    } else {
      setSubscribers([]);
    }
  }, [isAdmin, loadSubscribers]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmailInput.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setLoginMsg(`Only ${ADMIN_EMAIL} can log in here.`);
      return;
    }
    setLoginMsg('Verifying credentials...');
    const res = await login(adminEmailInput.trim(), adminPasswordInput);
    if (res.error) {
      setLoginMsg(`Login error: ${res.error}`);
    } else {
      setLoginMsg('');
    }
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(ADMIN_SQL_SETUP);
      setSqlCopyStatus('SQL copied! Paste and run it in Supabase → SQL Editor, then click Retry.');
    } catch {
      setSqlCopyStatus('Copy blocked by browser. Copy Section 13 from supabase/schema.sql.');
    }
  };

  const handleGrantByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = targetEmailInput.trim();
    if (!email) return;
    setGrantLoading(true);
    setActionFeedback(null);
    const { error } = await supabase.rpc('admin_grant_pro_by_email', {
      target_email: email,
      new_plan: targetPlanInput,
    });
    setGrantLoading(false);
    if (error) {
      setActionFeedback({ msg: error.message, err: true });
    } else {
      setActionFeedback({
        msg: `Updated ${email} to ${targetPlanInput.toUpperCase()}.`,
        err: false,
      });
      setTargetEmailInput('');
      await loadSubscribers();
    }
  };

  const handleTogglePlan = async (sub: Subscriber) => {
    if (!sub.user_id) return;
    const nextPlan = sub.plan === 'pro' ? 'free' : 'pro';
    setActionFeedback({ msg: `Updating ${sub.email}...`, err: false });
    const { error } = await supabase.rpc('admin_set_user_plan', {
      target_user_id: sub.user_id,
      new_plan: nextPlan,
    });
    if (error) {
      setActionFeedback({ msg: error.message, err: true });
    } else {
      setActionFeedback({
        msg: `Updated ${sub.email} to ${nextPlan.toUpperCase()}.`,
        err: false,
      });
      await loadSubscribers();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setPendingDeleteId(null);
    const { error } = await supabase.rpc('admin_delete_user', {
      target_user_id: userId,
    });
    if (error) {
      setActionFeedback({ msg: error.message, err: true });
    } else {
      setActionFeedback({ msg: 'Account deleted from Supabase.', err: false });
      await loadSubscribers();
    }
  };

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-md px-5 py-24 text-center">
        <div className="glass p-8 rounded-3xl shadow-2xl">
          <div className="text-3xl mb-2">🔐</div>
          <h1 className="serif text-3xl gt">McGee Admin Portal</h1>
          <p className="muted text-xs mt-1 mb-6">Restricted to {ADMIN_EMAIL}.</p>

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
            <button
              onClick={() => navigate('index')}
              className="muted text-xs hover:underline bg-transparent border-0 cursor-pointer"
            >
              &larr; Back to Public Studio
            </button>
          </div>
        </div>
      </main>
    );
  }

  const customers = subscribers.filter((s) => !s.isAdmin);
  const proSubs = customers.filter((s) => s.plan === 'pro');
  const freeSubs = customers.filter((s) => s.plan === 'free');
  const pendingSubs = customers.filter((s) => !s.confirmed);
  const mrr = proSubs.reduce((acc, s) => acc + s.amount, 0);
  const convRate = customers.length ? Math.round((proSubs.length / customers.length) * 100) : 0;

  const filteredSubs = subscribers.filter((s) => {
    if (subFilter === 'pro' && s.plan !== 'pro') return false;
    if (subFilter === 'free' && s.plan !== 'free') return false;
    if (subFilter === 'pending' && s.confirmed) return false;
    if (subSearch.trim() && !s.email.toLowerCase().includes(subSearch.trim().toLowerCase())) return false;
    return true;
  });

  const renderSqlBanner = () =>
    needsSqlSetup ? (
      <div className="glass p-6 rounded-3xl mb-6 border border-amber-400/40">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-xl">
            <span className="chip text-[11px] border-amber-400 text-amber-300">
              One-Time Database Setup Required
            </span>
            <h2 className="serif text-2xl gt mt-2">Connect Live Customer Accounts</h2>
            <p className="muted text-xs mt-1 leading-relaxed">
              Supabase blocks reading <code>auth.users</code> from the browser until you install the secure
              admin RPC functions in your Supabase SQL Editor.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCopySql} className="btn btn-gold text-xs py-2 px-3">
              Copy SQL Setup
            </button>
            <button onClick={loadSubscribers} className="btn btn-ghost text-xs py-2 px-3">
              Retry
            </button>
          </div>
        </div>
        {sqlCopyStatus && <p className="text-xs mt-2 text-emerald-400">{sqlCopyStatus}</p>}
      </div>
    ) : null;

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
          <p className="muted font-mono truncate">{currentUser?.email}</p>
          <button
            onClick={logout}
            className="text-red-400 hover:underline mt-1 bg-transparent border-0 p-0 cursor-pointer"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-6 md:p-10 max-w-5xl w-full">
        {activeTab === 'overview' && (
          <div className="fade">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h1 className="serif text-3xl sm:text-4xl gt">Business Overview</h1>
              <button
                onClick={loadSubscribers}
                disabled={subsLoading}
                className="btn btn-ghost text-xs py-2 px-3"
              >
                {subsLoading ? 'Syncing...' : '↻ Refresh Live Data'}
              </button>
            </div>

            {renderSqlBanner()}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="glass p-5 rounded-2xl">
                <span className="muted text-xs uppercase tracking-wider">Monthly MRR</span>
                <p className="serif text-3xl text-emerald-400 mt-1">{formatPrice(mrr)}</p>
                <p className="muted text-[11px] mt-1">{proSubs.length} Pro ($6/mo)</p>
              </div>
              <div className="glass p-5 rounded-2xl">
                <span className="muted text-xs uppercase tracking-wider">Customer Accounts</span>
                <p className="serif text-3xl gt mt-1">{customers.length}</p>
                <p className="muted text-[11px] mt-1">
                  {freeSubs.length} free &middot; {pendingSubs.length} unconfirmed
                </p>
              </div>
              <div className="glass p-5 rounded-2xl">
                <span className="muted text-xs uppercase tracking-wider">Conversion</span>
                <p className="serif text-3xl gt mt-1">{convRate}%</p>
                <p className="muted text-[11px] mt-1">Free &rarr; Pro ratio</p>
              </div>
              <div className="glass p-5 rounded-2xl">
                <span className="muted text-xs uppercase tracking-wider">Active Studios</span>
                <p className="serif text-3xl gt mt-1">13</p>
                <p className="muted text-[11px] mt-1">{BLOG_POSTS.length} editorial guides</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="serif text-2xl gt">Recent Signups</h2>
                  <button
                    onClick={() => setActiveTab('subscribers')}
                    className="text-xs gt underline bg-transparent border-0 cursor-pointer"
                  >
                    Manage &rarr;
                  </button>
                </div>
                {subsLoading ? (
                  <p className="muted text-xs py-4">Loading accounts from Supabase...</p>
                ) : subscribers.length === 0 ? (
                  <p className="muted text-xs py-4">
                    {needsSqlSetup
                      ? 'Run the SQL setup above to display live customer signups.'
                      : 'No registered accounts yet.'}
                  </p>
                ) : (
                  <div className="divide-y divide-rose-200/10">
                    {subscribers.slice(0, 5).map((s) => (
                      <div key={s.user_id || s.email} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`chip text-[10px] py-0.5 px-2 ${
                              s.plan === 'pro' ? 'border-amber-400 text-amber-300 font-bold' : ''
                            }`}
                          >
                            {s.isAdmin ? 'Admin' : s.plan === 'pro' ? '$6 Pro' : 'Free'}
                          </span>
                          <span className="truncate font-mono">{s.email}</span>
                        </div>
                        <span className="muted shrink-0">{s.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="glass p-6 rounded-3xl">
                <h2 className="serif text-2xl gt mb-3">Quick Navigation</h2>
                <p className="muted text-xs mb-4">Jump directly into any customer-facing studio:</p>
                <div className="flex flex-wrap gap-2">
                  {['vault', 'planner', 'sizing', 'styling', 'care', 'gold', 'diamond', 'beading'].map(
                    (slug) => (
                      <button
                        key={slug}
                        onClick={() => navigate(slug)}
                        className="btn btn-ghost text-xs py-1.5 px-3"
                      >
                        {slug} &rarr;
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="fade">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h1 className="serif text-3xl sm:text-4xl gt">Subscribers & Accounts</h1>
                <p className="muted text-xs mt-1">Live registered users from Supabase Auth</p>
              </div>
              <button
                onClick={loadSubscribers}
                disabled={subsLoading}
                className="btn btn-ghost text-xs py-2 px-3"
              >
                {subsLoading ? 'Syncing...' : '↻ Refresh Accounts'}
              </button>
            </div>

            {renderSqlBanner()}

            {actionFeedback && (
              <div
                className={`mb-4 p-3 rounded-2xl text-xs border ${
                  actionFeedback.err
                    ? 'bg-red-500/15 text-red-400 border-red-400/30'
                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-400/30'
                }`}
              >
                {actionFeedback.msg}
              </div>
            )}

            {/* Grant / Revoke Pro by Email */}
            <form
              onSubmit={handleGrantByEmail}
              className="glass p-5 rounded-2xl mb-5 flex flex-wrap gap-3 items-end"
            >
              <label className="fld flex-1 min-w-[220px]" style={{ marginTop: 0 }}>
                <span className="text-xs">Grant or Revoke Pro by Registered Email</span>
                <input
                  type="email"
                  required
                  value={targetEmailInput}
                  onChange={(e) => setTargetEmailInput(e.target.value)}
                  placeholder="customer@example.com"
                />
              </label>
              <label className="fld w-36" style={{ marginTop: 0 }}>
                <span className="text-xs">Plan Tier</span>
                <select
                  value={targetPlanInput}
                  onChange={(e) => setTargetPlanInput(e.target.value as 'pro' | 'free')}
                >
                  <option value="pro">Grant Pro ($6)</option>
                  <option value="free">Set Free</option>
                </select>
              </label>
              <button
                type="submit"
                disabled={grantLoading}
                className="btn btn-gold text-xs py-3 px-4"
              >
                {grantLoading ? 'Updating...' : 'Update Customer Plan'}
              </button>
            </form>

            {/* Filter & Search */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap gap-1.5">
                {([
                  ['all', `All (${subscribers.length})`],
                  ['pro', `Pro (${subscribers.filter((s) => s.plan === 'pro').length})`],
                  ['free', `Free (${subscribers.filter((s) => s.plan === 'free').length})`],
                  ['pending', `Pending Email (${subscribers.filter((s) => !s.confirmed).length})`],
                ] as const).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSubFilter(key)}
                    className={`btn text-xs py-1.5 px-3 ${
                      subFilter === key ? 'btn-gold' : 'btn-ghost'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <input
                type="search"
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                placeholder="Search email..."
                className="px-3 py-1.5 rounded-xl text-xs border border-rose-200/30 bg-white/80 text-slate-900"
              />
            </div>

            <div className="glass p-6 rounded-3xl overflow-x-auto">
              <table className="w-full text-left text-sm" style={{ minWidth: '38rem' }}>
                <thead>
                  <tr className="border-b border-rose-200/20 text-xs uppercase tracking-wider muted">
                    <th className="pb-3 px-3">Customer Email</th>
                    <th className="pb-3 px-3">Plan</th>
                    <th className="pb-3 px-3">Joined On</th>
                    <th className="pb-3 px-3">Email Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center muted text-xs">
                        {subsLoading
                          ? 'Loading registered accounts from Supabase...'
                          : subsError || 'No matching accounts found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredSubs.map((sub) => (
                      <tr key={sub.user_id || sub.email} className="border-t border-rose-200/10">
                        <td className="py-3 px-3">
                          <div className="font-mono text-xs flex items-center gap-2">
                            <span>{sub.email}</span>
                            {sub.isAdmin && (
                              <span className="chip text-[10px] py-0 px-2 border-amber-400 text-amber-300">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="muted text-[11px] mt-0.5">
                            {sub.piecesCount || 0} vault piece(s) &middot; Last login: {sub.lastSignIn || 'Never'}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`chip text-[10px] py-0.5 px-2 ${
                              sub.plan === 'pro' ? 'border-amber-400 text-amber-300 font-bold' : ''
                            }`}
                          >
                            {sub.plan === 'pro' ? 'PRO ($6/mo)' : 'FREE'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs muted">{sub.date}</td>
                        <td className="py-3 px-3 text-xs">
                          {sub.confirmed ? (
                            <span className="text-emerald-400">✓ Confirmed</span>
                          ) : (
                            <span className="text-amber-400">⏳ Pending Email</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          {sub.isAdmin ? (
                            <span className="muted text-xs">Owner</span>
                          ) : pendingDeleteId === sub.user_id ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="text-xs text-red-400">Confirm?</span>
                              <button
                                onClick={() => sub.user_id && handleDeleteUser(sub.user_id)}
                                className="btn btn-ghost text-xs py-1 px-2 text-red-400"
                              >
                                Yes, Delete
                              </button>
                              <button
                                onClick={() => setPendingDeleteId(null)}
                                className="text-xs muted hover:underline bg-transparent border-0 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleTogglePlan(sub)}
                                className="btn btn-ghost text-xs py-1 px-2.5"
                              >
                                {sub.plan === 'pro' ? 'Set Free' : 'Grant Pro'}
                              </button>
                              <button
                                onClick={() => sub.user_id && setPendingDeleteId(sub.user_id)}
                                className="text-xs text-red-400 hover:underline bg-transparent border-0 cursor-pointer"
                              >
                                Delete
                              </button>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
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
                    <p className="muted text-xs mt-0.5">
                      {post.read} &middot; {post.date}
                    </p>
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
