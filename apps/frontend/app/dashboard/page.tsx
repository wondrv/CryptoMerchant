"use client";

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { AppShell } from '../../components/layout/app-shell';
import { MetricCard } from '../../components/layout/metric-card';
import { PageHeader } from '../../components/layout/page-header';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { apiRequest } from '../../lib/api';
import { createMerchantSocket } from '../../lib/socket';
import { queryClient } from '../../lib/query-client';
import { useAuthStore } from '../../lib/auth-store';

type DashboardResponse = {
  totalVolume: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  totalWithdrawals: number;
  dailyTransactions: Array<{ day: string; total: number }>;
};

export default function DashboardPage() {
  const session = useAuthStore((state) => state.session);

  const dashboardQuery = useQuery({
    queryKey: ['merchant-dashboard'],
    queryFn: () => apiRequest<DashboardResponse>('/dashboard')
  });

  useEffect(() => {
    if (!session?.merchant?.id) {
      return;
    }

    const socket = createMerchantSocket(session.merchant.id);
    const refresh = () => {
      void queryClient.invalidateQueries({ queryKey: ['merchant-dashboard'] });
      void queryClient.invalidateQueries({ queryKey: ['invoices'] });
      void queryClient.invalidateQueries({ queryKey: ['transactions'] });
    };

    socket.on('invoice_created', refresh);
    socket.on('invoice_paid', refresh);
    socket.on('invoice_expired', refresh);
    socket.on('withdrawal_completed', refresh);

    return () => {
      socket.disconnect();
    };
  }, [session?.merchant?.id]);

  const stats = dashboardQuery.data;

  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        description="Realtime merchant performance and blockchain payment activity."
        actions={
          <Button asChild>
            <Link href="/invoices/new">Create invoice</Link>
          </Button>
        }
      />
      <div className="grid gap-4 px-6 sm:px-10 lg:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total Volume" value={stats ? stats.totalVolume.toFixed(2) : '0.00'} hint="Paid invoices only" />
        <MetricCard label="Total Invoice" value={stats?.totalInvoices ?? 0} />
        <MetricCard label="Paid Invoice" value={stats?.paidInvoices ?? 0} />
        <MetricCard label="Pending Invoice" value={stats?.pendingInvoices ?? 0} />
        <MetricCard label="Total Withdrawal" value={stats?.totalWithdrawals ?? 0} />
      </div>
      <div className="px-6 py-6 sm:px-10">
        <Card>
          <CardContent className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Daily transactions</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Last 30 days</span>
            </div>
            <div className="space-y-3">
              {(stats?.dailyTransactions ?? []).map((entry) => (
                <div key={entry.day} className="flex items-center gap-4">
                  <div className="w-28 text-xs text-slate-400">{entry.day}</div>
                  <div className="h-3 flex-1 rounded-full bg-white/8">
                    <div
                      className={[
                        'h-3 rounded-full bg-emerald-400',
                        entry.total >= 9 ? 'w-full' : '',
                        entry.total >= 7 && entry.total < 9 ? 'w-5/6' : '',
                        entry.total >= 5 && entry.total < 7 ? 'w-3/4' : '',
                        entry.total >= 3 && entry.total < 5 ? 'w-1/2' : '',
                        entry.total > 0 && entry.total < 3 ? 'w-1/4' : ''
                      ].join(' ')}
                    />
                  </div>
                  <div className="w-10 text-right text-sm text-slate-200">{entry.total}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
