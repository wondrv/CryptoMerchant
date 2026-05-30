import { Card, CardContent, CardDescription, CardTitle } from '../ui/card';

export function MetricCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card>
      <CardDescription>{label}</CardDescription>
      <CardTitle className="mt-2 text-3xl text-white">{value}</CardTitle>
      {hint ? <CardContent className="mt-2 text-xs text-slate-400">{hint}</CardContent> : null}
    </Card>
  );
}
