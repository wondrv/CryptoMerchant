"use client";

import { useQuery } from '@tanstack/react-query';
import { AppShell } from '../../../components/layout/app-shell';
import { PageHeader } from '../../../components/layout/page-header';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { apiRequest } from '../../../lib/api';

export default function AdminWithdrawalsPage() {
  const query = useQuery({ queryKey: ['admin-withdrawals'], queryFn: () => apiRequest<any[]>('/admin/withdrawals') });

  async function approve(id: string) {
    await apiRequest(`/admin/withdrawals/${id}/approve`, { method: 'PATCH' });
    await query.refetch();
  }

  return (
    <AppShell>
      <PageHeader title="Withdrawals" description="Approve or review merchant withdrawal requests." />
      <div className="space-y-4 px-6 pb-8 sm:px-10">
        {query.data?.map((withdrawal) => (
          <Card key={withdrawal.id}>
            <CardContent className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="font-medium text-white">{withdrawal.amount}</div>
                <div className="text-sm text-slate-400">{withdrawal.destination_wallet} · {withdrawal.status}</div>
              </div>
              <Button onClick={() => approve(withdrawal.id)}>Approve</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
