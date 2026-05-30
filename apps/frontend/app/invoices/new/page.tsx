"use client";

import { useState } from 'react';
import { AppShell } from '../../../components/layout/app-shell';
import { PageHeader } from '../../../components/layout/page-header';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { apiRequest } from '../../../lib/api';

export default function CreateInvoicePage() {
  const [amount, setAmount] = useState('100');
  const [currency, setCurrency] = useState('USDT');
  const [network, setNetwork] = useState<'TRON' | 'ETHEREUM'>('TRON');
  const [result, setResult] = useState<any>(null);

  async function handleCreate() {
    const response = await apiRequest('/invoices', {
      method: 'POST',
      body: JSON.stringify({ amount: Number(amount), currency, network, expiredMinutes: 30 })
    });
    setResult(response);
  }

  return (
    <AppShell>
      <PageHeader title="Create Invoice" description="Generate wallet address and QR code for payment." />
      <div className="grid gap-4 px-6 pb-8 lg:grid-cols-[0.9fr_1.1fr] sm:px-10">
        <Card>
          <CardContent className="space-y-4 py-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" value={currency} onChange={(event) => setCurrency(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="network">Network</Label>
              <select id="network" aria-label="Network" className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm" value={network} onChange={(event) => setNetwork(event.target.value as 'TRON' | 'ETHEREUM')}>
                <option value="TRON">TRON</option>
                <option value="ETHEREUM">ETHEREUM</option>
              </select>
            </div>
            <Button onClick={handleCreate} className="w-full">Create invoice</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 py-4">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Result</div>
            {result ? (
              <div className="space-y-2 text-sm text-slate-200">
                <div>Invoice: {result.invoice.invoiceNumber}</div>
                <div>Wallet: {result.walletAddress}</div>
                <div>Payment URL: {result.paymentUrl}</div>
                <img src={result.qrCodeDataUrl} alt="QR code" className="h-56 w-56 rounded-3xl bg-white p-4" />
              </div>
            ) : (
              <div className="text-sm text-slate-400">Invoice output will appear here.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
