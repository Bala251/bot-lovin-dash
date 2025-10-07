import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Calculator } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Generate profit data with 7% monthly growth for 12 months
const generateProfitData = (initialAmount: number) => {
  const data = [];
  let currentAmount = initialAmount;
  const monthlyGrowthRate = 0.07; // 7% growth

  for (let month = 0; month <= 12; month++) {
    data.push({
      month: month === 0 ? "Сейчас" : `${month} мес`,
      profit: Math.round(currentAmount),
      monthIndex: month,
    });
    currentAmount *= (1 + monthlyGrowthRate);
  }

  return data;
};

const chartConfig = {
  profit: {
    label: "Прибыль",
    color: "hsl(var(--primary))",
  },
};

export const ProfitCalculator = ({ initialBalance }: { initialBalance: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const profitData = generateProfitData(initialBalance);
  const initialAmount = profitData[0].profit;
  const finalAmount = profitData[12].profit;
  const totalGrowth = finalAmount - initialAmount;
  const totalGrowthPercent = ((totalGrowth / initialAmount) * 100).toFixed(1);

  return (
    <Card className="glass-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 hover:bg-transparent"
            >
              <CardTitle className="text-lg flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Калькулятор прибыли
              </CardTitle>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-card p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Начальная сумма</p>
                <p className="text-sm font-semibold">${initialAmount.toLocaleString()}</p>
              </div>
              <div className="glass-card p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Через год</p>
                <p className="text-sm font-semibold text-success">${finalAmount.toLocaleString()}</p>
              </div>
              <div className="glass-card p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Рост</p>
                <p className="text-sm font-semibold text-success">+{totalGrowthPercent}%</p>
              </div>
            </div>

            {/* Chart */}
            <div className="glass-card p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-3">Прогноз роста (7% в месяц)</p>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <AreaChart data={profitData}>
                  <defs>
                    <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => `$${Number(value).toLocaleString()}`}
                        labelFormatter={(label) => `Период: ${label}`}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#profitGradient)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>

            {/* Info */}
            <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
              💡 Расчет основан на ежемесячном росте 7%. Реальная прибыль может отличаться в зависимости от рыночных условий.
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
