import Link from 'next/link';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const features = [
  'Register and login merchant accounts',
  'Generate crypto invoices with QR codes',
  'Automatic blockchain monitoring mock-ready',
  'Realtime invoice status via Socket.io',
  'Webhook callbacks with HMAC signature',
  'Withdrawal approval flow for admins'
];

export default function HomePage() {
  return (
    <main className="grid-overlay relative overflow-hidden">
      <div className="mx-auto min-h-screen max-w-7xl px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">
          <div>
            <div className="text-xs uppercase tracking-[0.45em] text-emerald-300">CryptoMerchant</div>
            <div className="mt-1 text-sm text-slate-400">Merchant crypto gateway</div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="text-sm text-slate-300 hover:text-white">Pricing</Link>
            <Link href="/login" className="text-sm text-slate-300 hover:text-white">Login</Link>
            <Button asChild>
              <Link href="/register">Start free</Link>
            </Button>
          </div>
        </header>

        <section className="grid gap-10 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <Badge>Crypto payment gateway</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-7xl font-[family-name:var(--font-space-grotesk)]">
              Accept USDT payments with live blockchain monitoring.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              CryptoMerchant gives merchants invoice creation, payment detection, webhook callbacks, dashboard analytics, and admin controls in one SaaS.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/dashboard">Open dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
          </div>

          <Card className="relative overflow-hidden border-emerald-400/20 bg-slate-950/60">
            <CardHeader>
              <CardDescription>Live flow</CardDescription>
              <CardTitle>Invoice lifecycle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-300">
              {['Invoice created', 'Wallet generated', 'Blockchain watched', 'Transaction confirmed', 'Webhook sent', 'Realtime updated'].map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20 text-sm font-semibold text-emerald-300">{index + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 pb-16 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature}>
              <CardHeader>
                <CardDescription>Feature</CardDescription>
                <CardTitle>{feature}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
