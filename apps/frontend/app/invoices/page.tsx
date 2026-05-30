"use client";

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '../../components/layout/app-shell';
import { PageHeader } from '../../components/layout/page-header';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { apiRequest } from '../../lib/api';

type InvoiceItem = {
  id: string;
  invoice_number: string;
  amount: string | number;
  currency: string;
  status: string;
  created_at: string;
  wallet_address: string;
};

export default function InvoicesPage() {
  const query = useQuery({
    queryKey: ['invoices'],
    queryFn: () => apiRequest<InvoiceItem[]>('/invoices')
  });

  return (
    <AppShell>
      <PageHeader
        title="Invoices"
        description="Track invoice lifecycle from creation to payment confirmation."
        actions={
          <Button asChild>
            <Link href="/invoices/new">New invoice</Link>
          </Button>
        }
      />
      <div className="space-y-4 px-6 pb-8 sm:px-10">
        {query.data?.map((invoice) => (
          <Card key={invoice.id}>
            <CardContent className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="font-medium text-white">{invoice.invoice_number}</div>
                <div className="text-sm text-slate-400">{invoice.amount} {invoice.currency}</div>
              </div>
              <div className="text-sm text-slate-300">{invoice.status}</div>
              <div className="text-xs text-slate-500">{invoice.wallet_address}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
