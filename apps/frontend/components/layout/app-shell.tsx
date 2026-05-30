import Link from 'next/link';
import { ReactNode } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/invoices', label: 'Invoices' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/wallets', label: 'Wallets' },
  { href: '/withdrawal', label: 'Withdrawal' },
  { href: '/settings', label: 'Settings' },
  { href: '/api-keys', label: 'API Keys' }
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_32%),linear-gradient(180deg,#071018_0%,#04070c_100%)] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 p-4 lg:p-8">
        <aside className="hidden w-72 flex-col rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:flex">
          <div className="mb-8">
            <div className="text-xs uppercase tracking-[0.45em] text-emerald-300">CryptoMerchant</div>
            <div className="mt-2 text-2xl font-semibold">Merchant Control</div>
          </div>
          <nav className="flex flex-1 flex-col gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
            Automatic blockchain monitoring aktif di mode mock untuk local development.
          </div>
        </aside>
        <main className="flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl">
          {children}
        </main>
      </div>
    </div>
  );
}
