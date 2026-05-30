"use client";

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { AppShell } from '../../components/layout/app-shell';
import { PageHeader } from '../../components/layout/page-header';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { apiRequest } from '../../lib/api';

export default function WalletsPage() {
  const [network, setNetwork] = useState<'TRON' | 'ETHEREUM'>('TRON');
  const query = useQuery({
    queryKey: ['wallets'],
    queryFn: () => apiRequest<any[]>('/wallets')
  });

  async function createWallet() {
    await apiRequest('/wallets', {
      method: 'POST',
      body: JSON.stringify({ network })
    });
    await query.refetch();
  }

  return (
    <AppShell>
      <PageHeader
        title="Wallets"
        description="Generated destination wallets used by invoices."
        actions={
          <div className="flex items-center gap-3">
            <select value={network} aria-label="Wallet network" onChange={(event) => setNetwork(event.target.value as 'TRON' | 'ETHEREUM')} className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm">
              <option value="TRON">TRON</option>
              <option value="ETHEREUM">ETHEREUM</option>
            </select>
            <Button onClick={createWallet}>Generate wallet</Button>
          </div>
        }
      />
      <div className="space-y-4 px-6 pb-8 sm:px-10">
        {query.data?.map((wallet) => (
          <Card key={wallet.id}>
            <CardContent className="flex flex-col gap-2 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="font-medium text-white">{wallet.address}</div>
                <div className="text-sm text-slate-400">{wallet.network}</div>
              </div>
              <div className="text-xs text-slate-500">Encrypted private key stored</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
