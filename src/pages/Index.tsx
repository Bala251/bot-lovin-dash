import { useState } from "react";
import { BotStatusCard } from "@/components/BotStatusCard";
import { MetricsCard } from "@/components/MetricsCard";
import { BalanceChart } from "@/components/BalanceChart";
import { TradeHistory } from "@/components/TradeHistory";
import { ProfitCalculator } from "@/components/ProfitCalculator";
import { Bot } from "lucide-react";

const Index = () => {
  const [isBotActive, setIsBotActive] = useState(true);
  const currentBalance = 12450; // Current balance from metrics


  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="sticky top-0 z-10 glass-card border-b border-border/50 px-4 py-4 mb-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="gradient-primary p-2 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Crypto Bot</h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Версия</p>
            <p className="text-sm font-semibold">v1.0.0</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 space-y-4">
        <BotStatusCard isActive={isBotActive} onToggle={() => setIsBotActive(!isBotActive)} />
        <MetricsCard />
        <BalanceChart />
        <TradeHistory />
        <ProfitCalculator initialBalance={currentBalance} />
      </main>
    </div>
  );
};

export default Index;
