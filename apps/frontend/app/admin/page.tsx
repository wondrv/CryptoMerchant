"use client";

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { AppShell } from '../../components/layout/app-shell';
import { MetricCard } from '../../components/layout/metric-card';
import { PageHeader } from '../../components/layout/page-header';
import { Button } from '../../components/ui/button';
import { apiRequest } from '../../lib/api';

export default function AdminDashboardPage() {
  const query = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => apiRequest<any>('/admin/dashboard')
  });

  const stats = query.data;

  return (
    <AppShell>
      <PageHeader
        title="Admin Dashboard"
        description="Global control plane for merchants, invoices, transactions, and withdrawals."
        actions={
          <Button asChild>
            <Link href="/admin/merchants">Manage merchants</Link>
          </Button>
        }
      />
      <div className="grid gap-4 px-6 pb-8 sm:px-10 xl:grid-cols-5">
        <MetricCard label="Total Volume" value={stats?.totalVolume ?? 0} />
        <MetricCard label="Total Invoice" value={stats?.totalInvoices ?? 0} />
        <MetricCard label="Paid Invoice" value={stats?.paidInvoices ?? 0} />
        <MetricCard label="Pending Invoice" value={stats?.pendingInvoices ?? 0} />
        <MetricCard label="Total Withdrawal" value={stats?.totalWithdrawals ?? 0} />
      </div>
    </AppShell>
  );
}
