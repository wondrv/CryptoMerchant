import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

const plans = [
  { name: 'Starter', price: '$0', description: 'For testing the gateway locally.', perks: ['Invoice creation', 'Mock blockchain detection', 'Realtime updates'] },
  { name: 'Growth', price: '$49', description: 'For active merchants.', perks: ['Webhooks', 'Withdrawal approvals', 'Daily analytics'] },
  { name: 'Scale', price: '$199', description: 'For larger operations.', perks: ['Admin panel', 'API keys', 'Priority support'] }
];

export default function PricingPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-8 lg:px-10">
      <div className="mb-12 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">
        <div>
          <div className="text-xs uppercase tracking-[0.45em] text-emerald-300">CryptoMerchant</div>
          <div className="mt-1 text-sm text-slate-400">Simple pricing, no surprises</div>
        </div>
        <Button asChild variant="outline">
          <Link href="/register">Get started</Link>
        </Button>
      </div>

      <div className="mb-10 max-w-2xl">
        <h1 className="text-5xl font-semibold tracking-tight text-white font-[family-name:var(--font-space-grotesk)]">Pricing built for payment flows.</h1>
        <p className="mt-4 text-lg text-slate-300">Start in local mock mode, then switch to a real provider later without changing the merchant workflow.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col justify-between">
            <CardHeader>
              <CardDescription>{plan.name}</CardDescription>
              <CardTitle className="text-4xl">{plan.price}</CardTitle>
              <p className="text-sm text-slate-400">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-300">
                {plan.perks.map((perk) => (
                  <li key={perk}>• {perk}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
