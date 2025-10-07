import { TrendingUp, TrendingDown, Wallet, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  secondaryValue?: string;
}

const Metric = ({ title, value, change, isPositive, icon, secondaryValue }: MetricProps) => (
  <Card className="glass-card shadow-card border-border/50">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {secondaryValue && (
            <p className="text-sm text-muted-foreground">{secondaryValue}</p>
          )}
          {change && (
            <div className={`flex items-center text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`rounded-full p-2 ${isPositive ? 'bg-success/20' : isPositive === false ? 'bg-destructive/20' : 'bg-primary/20'}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const MetricsCard = () => {
  const balance = 12450; // Extract balance value
  
  return (
    <div className="grid grid-cols-2 gap-3">
      <Metric
        title="Баланс"
        value="$12,450"
        secondaryValue="≈ 1,182,750 ₽"
        icon={<Wallet className="h-5 w-5 text-primary" />}
      />
      <Metric
        title="Прибыль/Убыток"
        value="+$850"
        change="+6.8%"
        isPositive={true}
        icon={<TrendingUp className="h-5 w-5 text-success" />}
      />
      <Metric
        title="Активные сделки"
        value="5"
        icon={<Activity className="h-5 w-5 text-primary" />}
      />
      <Metric
        title="24ч прибыль"
        value="+$120"
        change="+2.1%"
        isPositive={true}
        icon={<TrendingUp className="h-5 w-5 text-success" />}
      />
    </div>
  );
};
