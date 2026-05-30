"use client";

import { useQuery } from '@tanstack/react-query';
import { AppShell } from '../../../components/layout/app-shell';
import { PageHeader } from '../../../components/layout/page-header';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { apiRequest } from '../../../lib/api';

export default function AdminMerchantsPage() {
  const query = useQuery({ queryKey: ['admin-merchants'], queryFn: () => apiRequest<any[]>('/admin/merchants') });

  async function suspend(id: string) {
    await apiRequest(`/admin/merchants/${id}/suspend`, { method: 'PATCH' });
    await query.refetch();
  }

  return (
    <AppShell>
      <PageHeader title="Merchants" description="Review, suspend, and manage merchants." />
      <div className="space-y-4 px-6 pb-8 sm:px-10">
        {query.data?.map((merchant) => (
          <Card key={merchant.id}>
            <CardContent className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="font-medium text-white">{merchant.name}</div>
                <div className="text-sm text-slate-400">{merchant.email} · {merchant.status}</div>
              </div>
              <Button variant="outline" onClick={() => suspend(merchant.id)}>Suspend</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
