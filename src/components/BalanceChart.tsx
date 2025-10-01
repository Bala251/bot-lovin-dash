import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const mockBalanceData = [
  { time: "00:00", balance: 10000 },
  { time: "04:00", balance: 10150 },
  { time: "08:00", balance: 10050 },
  { time: "12:00", balance: 10300 },
  { time: "16:00", balance: 10450 },
  { time: "20:00", balance: 10280 },
  { time: "24:00", balance: 10550 },
];

const chartConfig = {
  balance: {
    label: "Баланс",
    color: "hsl(var(--primary))",
  },
};

export const BalanceChart = () => {
  const currentBalance = mockBalanceData[mockBalanceData.length - 1].balance;
  const startBalance = mockBalanceData[0].balance;
  const change = currentBalance - startBalance;
  const changePercent = ((change / startBalance) * 100).toFixed(2);

  return (
    <Card className="glass-card shadow-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Изменение баланса
          </div>
          <div className="text-sm font-normal">
            <span className={change >= 0 ? "text-success" : "text-destructive"}>
              {change >= 0 ? "+" : ""}${change.toFixed(2)} ({changePercent}%)
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={mockBalanceData}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
