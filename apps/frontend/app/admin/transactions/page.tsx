"use client";

import { useQuery } from '@tanstack/react-query';
import { AppShell } from '../../../components/layout/app-shell';
import { PageHeader } from '../../../components/layout/page-header';
import { Card, CardContent } from '../../../components/ui/card';
import { apiRequest } from '../../../lib/api';

export default function AdminTransactionsPage() {
  const query = useQuery({ queryKey: ['admin-transactions'], queryFn: () => apiRequest<any[]>('/admin/transactions') });

  return (
    <AppShell>
      <PageHeader title="Transactions" description="Global blockchain transaction feed." />
      <div className="space-y-4 px-6 pb-8 sm:px-10">
        {query.data?.map((tx) => (
          <Card key={tx.id}>
            <CardContent className="py-4 text-sm text-slate-300">
              <div className="font-medium text-white">{tx.tx_hash}</div>
              <div>{tx.status}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
