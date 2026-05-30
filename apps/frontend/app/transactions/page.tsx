"use client";

import { useQuery } from '@tanstack/react-query';
import { AppShell } from '../../components/layout/app-shell';
import { PageHeader } from '../../components/layout/page-header';
import { Card, CardContent } from '../../components/ui/card';
import { apiRequest } from '../../lib/api';

export default function TransactionsPage() {
  const query = useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiRequest<any[]>('/transactions')
  });

  return (
    <AppShell>
      <PageHeader title="Transactions" description="Detected and confirmed blockchain transactions." />
      <div className="space-y-4 px-6 pb-8 sm:px-10">
        {query.data?.map((tx) => (
          <Card key={tx.id}>
            <CardContent className="flex flex-col gap-2 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="font-medium text-white">{tx.tx_hash}</div>
                <div className="text-sm text-slate-400">{tx.amount} {tx.network} · {tx.confirmations} confirmations</div>
              </div>
              <div className="text-sm text-slate-300">{tx.status}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
