"use client";

import { useQuery } from '@tanstack/react-query';
import { AppShell } from '../../../components/layout/app-shell';
import { PageHeader } from '../../../components/layout/page-header';
import { Card, CardContent } from '../../../components/ui/card';
import { apiRequest } from '../../../lib/api';

export default function AdminInvoicesPage() {
  const query = useQuery({ queryKey: ['admin-invoices'], queryFn: () => apiRequest<any[]>('/admin/invoices') });

  return (
    <AppShell>
      <PageHeader title="Invoices" description="All merchant invoices across the platform." />
      <div className="space-y-4 px-6 pb-8 sm:px-10">
        {query.data?.map((invoice) => (
          <Card key={invoice.id}>
            <CardContent className="py-4 text-sm text-slate-300">
              <div className="font-medium text-white">{invoice.invoice_number}</div>
              <div>{invoice.merchant?.name ?? 'Unknown merchant'}</div>
              <div>{invoice.status}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
