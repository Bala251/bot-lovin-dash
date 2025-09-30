import { useState } from "react";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface BotSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BotSettingsDialog = ({ open, onOpenChange }: BotSettingsDialogProps) => {
  const [apiKey, setApiKey] = useState("sk_test_************************");
  const [apiSecret, setApiSecret] = useState("************************");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Настройки сохранены",
      description: "API ключи успешно обновлены",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API ключи
          </DialogTitle>
          <DialogDescription>
            Обновите ключи API для подключения к бирже
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Введите API ключ"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="apiSecret">API Secret</Label>
            <Input
              id="apiSecret"
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="Введите секретный ключ"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} className="gradient-primary">
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
