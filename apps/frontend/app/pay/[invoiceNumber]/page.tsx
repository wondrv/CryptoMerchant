"use client";

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api';
import { queryClient } from '../../../lib/query-client';

export default function PublicInvoicePage() {
  const params = useParams<{ invoiceNumber: string }>();
  const invoiceNumber = params.invoiceNumber;

  const query = useQuery({
    queryKey: ['public-invoice', invoiceNumber],
    queryFn: () => apiRequest<any>(`/invoices/public/${invoiceNumber}`, { auth: false }),
    refetchInterval: 5000
  });

  useEffect(() => {
    const handle = setInterval(() => {
      void queryClient.invalidateQueries({ queryKey: ['public-invoice', invoiceNumber] });
    }, 5000);
    return () => clearInterval(handle);
  }, [invoiceNumber]);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-12">
      <Card className="w-full">
        <CardHeader>
          <Badge>Payment page</Badge>
          <CardTitle>{query.data?.invoice_number ?? invoiceNumber}</CardTitle>
          <CardDescription>Scan the wallet address QR from the merchant dashboard or pay manually from your wallet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <div>Status: {query.data?.status ?? 'Loading...'}</div>
          <div>Amount: {query.data?.amount ?? '-'}</div>
          <div>Network: {query.data?.network ?? '-'}</div>
          <div>Wallet: {query.data?.wallet_address ?? '-'}</div>
        </CardContent>
      </Card>
    </main>
  );
}
