import { useState } from "react";
import { Power, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BotSettingsDialog } from "./BotSettingsDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface BotStatusCardProps {
  isActive: boolean;
  onToggle: () => void;
}

export const BotStatusCard = ({ isActive, onToggle }: BotStatusCardProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    toast({
      title: "Бот удален",
      description: "Настройки бота успешно удалены",
    });
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="glass-card shadow-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Статус бота</span>
            <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-success animate-pulse' : 'bg-muted'}`} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Статус</span>
            <span className={`font-semibold ${isActive ? 'text-success' : 'text-muted-foreground'}`}>
              {isActive ? 'Активен' : 'Остановлен'}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={onToggle}
              className={`col-span-3 h-12 text-base font-semibold transition-smooth ${
                isActive 
                  ? 'bg-destructive/20 hover:bg-destructive/30 text-destructive' 
                  : 'gradient-primary glow-primary hover:opacity-90'
              }`}
            >
              <Power className="mr-2 h-5 w-5" />
              {isActive ? 'Остановить' : 'Запустить'}
            </Button>
            
            <Button
              variant="secondary"
              onClick={() => setShowSettings(true)}
              className="col-span-2 h-12"
            >
              <Settings className="mr-2 h-4 w-4" />
              Ключи API
            </Button>
            
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="h-12"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <BotSettingsDialog open={showSettings} onOpenChange={setShowSettings} />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить настройки бота?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Все настройки и API ключи будут удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
