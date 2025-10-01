import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (getWebhook: string, postWebhook: string) => void;
  getWebhook: string;
  postWebhook: string;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  onSave,
  getWebhook: initialGetWebhook,
  postWebhook: initialPostWebhook,
}: SettingsModalProps) => {
  const [getWebhook, setGetWebhook] = useState(initialGetWebhook);
  const [postWebhook, setPostWebhook] = useState(initialPostWebhook);

  useEffect(() => {
    setGetWebhook(initialGetWebhook);
    setPostWebhook(initialPostWebhook);
  }, [initialGetWebhook, initialPostWebhook, isOpen]);

  const handleSave = () => {
    onSave(getWebhook, postWebhook);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Webhook Einstellungen</DialogTitle>
          <DialogDescription className="text-base">
            Konfigurieren Sie Ihre Webhooks für Datenoperationen
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="get-webhook" className="text-base font-medium">
              GET Webhook (Daten Laden)
            </Label>
            <Input
              id="get-webhook"
              placeholder="https://example.com/webhook/get-data"
              value={getWebhook}
              onChange={(e) => setGetWebhook(e.target.value)}
              className="h-11"
            />
            <p className="text-sm text-muted-foreground">
              Dieser Webhook wird verwendet, um Daten zu laden
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-webhook" className="text-base font-medium">
              POST Webhook (Daten Speichern)
            </Label>
            <Input
              id="post-webhook"
              placeholder="https://example.com/webhook/save-data"
              value={postWebhook}
              onChange={(e) => setPostWebhook(e.target.value)}
              className="h-11"
            />
            <p className="text-sm text-muted-foreground">
              Dieser Webhook wird verwendet, um Änderungen zu speichern
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} className="btn-primary">
            <Save className="w-4 h-4 mr-2" />
            Speichern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
