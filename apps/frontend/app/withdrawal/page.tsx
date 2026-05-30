"use client";

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { AppShell } from '../../components/layout/app-shell';
import { PageHeader } from '../../components/layout/page-header';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { apiRequest } from '../../lib/api';

export default function WithdrawalPage() {
  const [amount, setAmount] = useState('50');
  const [destinationWallet, setDestinationWallet] = useState('tron_destination_wallet');
  const [network, setNetwork] = useState<'TRON' | 'ETHEREUM'>('TRON');
  const query = useQuery({
    queryKey: ['withdrawals'],
    queryFn: () => apiRequest<any[]>('/withdrawals')
  });

  async function createWithdrawal() {
    await apiRequest('/withdrawals', {
      method: 'POST',
      body: JSON.stringify({ amount: Number(amount), destinationWallet, network })
    });
    await query.refetch();
  }

  return (
    <AppShell>
      <PageHeader title="Withdrawal" description="Request balance withdrawal to a destination wallet." />
      <div className="grid gap-4 px-6 pb-8 lg:grid-cols-[0.9fr_1.1fr] sm:px-10">
        <Card>
          <CardContent className="space-y-4 py-4">
            <div>
              <Label htmlFor="withdrawal-amount">Amount</Label>
              <Input id="withdrawal-amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="destinationWallet">Destination wallet</Label>
              <Input id="destinationWallet" value={destinationWallet} onChange={(event) => setDestinationWallet(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="withdrawal-network">Network</Label>
              <select id="withdrawal-network" aria-label="Withdrawal network" value={network} onChange={(event) => setNetwork(event.target.value as 'TRON' | 'ETHEREUM')} className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm">
                <option value="TRON">TRON</option>
                <option value="ETHEREUM">ETHEREUM</option>
              </select>
            </div>
            <Button onClick={createWithdrawal} className="w-full">Submit withdrawal</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 py-4">
            {query.data?.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <div className="font-medium text-white">{item.amount}</div>
                <div>{item.destination_wallet}</div>
                <div>{item.status}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
