import { AppShell } from '../../components/layout/app-shell';
import { PageHeader } from '../../components/layout/page-header';
import { Card, CardContent } from '../../components/ui/card';

export default function ApiKeysPage() {
  return (
    <AppShell>
      <PageHeader title="API Keys" description="Use this page to copy the merchant API key after login." />
      <div className="px-6 pb-8 sm:px-10">
        <Card>
          <CardContent className="py-6 text-sm text-slate-300">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Public API key</div>
            <div className="mt-3 break-all rounded-2xl border border-white/10 bg-black/20 p-4 text-white">
              Sign in as a merchant to load the live API key from the backend.
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
