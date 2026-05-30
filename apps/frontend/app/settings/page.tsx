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

export default function SettingsPage() {
  const query = useQuery({
    queryKey: ['webhook-settings'],
    queryFn: () => apiRequest<{ callback_url: string | null; secret_key: string | null }>('/webhooks/settings')
  });
  const [callbackUrl, setCallbackUrl] = useState('https://example.com/webhooks/cryptomerchant');
  const [secretKey, setSecretKey] = useState('merchant-secret-key');

  async function save() {
    await apiRequest('/webhooks/settings', {
      method: 'PUT',
      body: JSON.stringify({ callbackUrl, secretKey })
    });
    await query.refetch();
  }

  return (
    <AppShell>
      <PageHeader title="Settings" description="Manage webhook callback and shared secret." />
      <div className="grid gap-4 px-6 pb-8 lg:grid-cols-[0.9fr_1.1fr] sm:px-10">
        <Card>
          <CardContent className="space-y-4 py-4">
            <div>
              <Label htmlFor="callbackUrl">Callback URL</Label>
              <Input id="callbackUrl" value={callbackUrl} onChange={(event) => setCallbackUrl(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="secretKey">Secret key</Label>
              <Input id="secretKey" value={secretKey} onChange={(event) => setSecretKey(event.target.value)} />
            </div>
            <Button onClick={save} className="w-full">Save webhook settings</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 py-4 text-sm text-slate-300">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Current settings</div>
            <div>Callback: {query.data?.callback_url ?? '-'}</div>
            <div>Secret: {query.data?.secret_key ? 'configured' : '-'}</div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
