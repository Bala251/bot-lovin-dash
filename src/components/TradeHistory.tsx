import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Trade {
  id: string;
  pair: string;
  type: "buy" | "sell";
  amount: string;
  price: string;
  profit: string;
  isProfit: boolean;
  date: string;
  time: string;
}

const mockTrades: Trade[] = [
  {
    id: "1",
    pair: "BTC/USDT",
    type: "sell",
    amount: "0.025",
    price: "$45,200",
    profit: "+$85",
    isProfit: true,
    date: "15.01.2025",
    time: "15:30",
  },
  {
    id: "2",
    pair: "ETH/USDT",
    type: "buy",
    amount: "1.5",
    price: "$2,850",
    profit: "+$45",
    isProfit: true,
    date: "15.01.2025",
    time: "14:20",
  },
  {
    id: "3",
    pair: "SOL/USDT",
    type: "sell",
    amount: "25",
    price: "$105",
    profit: "-$20",
    isProfit: false,
    date: "15.01.2025",
    time: "13:45",
  },
  {
    id: "4",
    pair: "BNB/USDT",
    type: "buy",
    amount: "5",
    price: "$310",
    profit: "+$30",
    isProfit: true,
    date: "14.01.2025",
    time: "12:10",
  },
  {
    id: "5",
    pair: "ADA/USDT",
    type: "sell",
    amount: "500",
    price: "$0.52",
    profit: "+$15",
    isProfit: true,
    date: "14.01.2025",
    time: "11:30",
  },
];

export const TradeHistory = () => {
  return (
    <Card className="glass-card shadow-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          История сделок
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] pr-4">
          <div className="space-y-3">
            {mockTrades.map((trade) => (
              <div
                key={trade.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/30 transition-smooth hover:bg-secondary/70"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full p-2 ${
                      trade.type === "buy" ? "bg-success/20" : "bg-destructive/20"
                    }`}
                  >
                    {trade.type === "buy" ? (
                      <ArrowUpRight className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{trade.pair}</p>
                    <p className="text-xs text-muted-foreground">
                      {trade.amount} • {trade.price}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {trade.date} • {trade.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold text-sm ${
                      trade.isProfit ? "text-success" : "text-destructive"
                    }`}
                  >
                    {trade.profit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
