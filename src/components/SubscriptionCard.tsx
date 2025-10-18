import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Crown, Calendar, Sparkles } from "lucide-react";
import { useState } from "react";

interface SubscriptionCardProps {
  plan: "free" | "premium";
  expiryDate?: string; // For premium plan
}

export const SubscriptionCard = ({ plan, expiryDate }: SubscriptionCardProps) => {
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = () => {
    setIsUpgrading(true);
    // TODO: Implement payment integration
    setTimeout(() => setIsUpgrading(false), 1000);
  };

  const isPremium = plan === "premium";

  return (
    <Card className="shadow-card">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="subscription" className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-center gap-2">
                <Crown className={`h-5 w-5 ${isPremium ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="font-semibold">Подписка</span>
              </div>
              <Badge 
                variant={isPremium ? "default" : "secondary"}
                className={isPremium ? "gradient-primary text-white" : ""}
              >
                {isPremium ? "Premium" : "Free"}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            {isPremium ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Активна до:</span>
                  <span className="font-medium">{expiryDate}</span>
                </div>
                <div className="p-3 rounded-lg glass-card">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Премиум возможности</p>
                      <ul className="mt-2 space-y-1 text-muted-foreground">
                        <li>• Безлимитные сделки</li>
                        <li>• Расширенная аналитика</li>
                        <li>• Приоритетная поддержка</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleUpgrade}
                >
                  Продлить подписку
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-border/50">
                  <p className="text-sm text-muted-foreground mb-3">
                    Бесплатный план с базовыми возможностями
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Ограниченная аналитика</li>
                    <li>• Базовые настройки бота</li>
                    <li>• Стандартная поддержка</li>
                  </ul>
                </div>
                <Button 
                  className="w-full gradient-primary"
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                >
                  <Crown className="mr-2 h-4 w-4" />
                  {isUpgrading ? "Обработка..." : "Улучшить до Premium"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Разблокируйте все возможности за 999₽/месяц
                </p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
