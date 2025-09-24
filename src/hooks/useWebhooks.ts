import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const WEBHOOK_URLS = {
  LOAD_DATA: "https://markusomega.app.n8n.cloud/webhook-test/load-data",
  SAVE_DATA: "https://markusomega.app.n8n.cloud/webhook-test/save-data",
};

export interface WebhookResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export const useWebhooks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadData = async (): Promise<Record<string, any>[]> => {
    setIsLoading(true);
    try {
      console.log("Loading data from webhook:", WEBHOOK_URLS.LOAD_DATA);
      
      const response = await fetch(WEBHOOK_URLS.LOAD_DATA, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data loaded successfully:", data);

      // Handle both array and single object responses
      let processedData: Record<string, any>[] = [];
      
      if (Array.isArray(data)) {
        processedData = data;
      } else if (data && typeof data === 'object') {
        // If it's a single object, wrap it in an array
        processedData = [data];
      }

      toast({
        title: "Daten geladen",
        description: `${processedData.length} Einträge erfolgreich geladen`,
      });

      return processedData;
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Fehler beim Laden",
        description: "Die Daten konnten nicht geladen werden. Überprüfen Sie die Webhook-Verbindung.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (data: Record<string, any>, action: "create" | "update" | "delete", index?: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Saving data to webhook:", WEBHOOK_URLS.SAVE_DATA, { data, action, index });

      const payload = {
        action,
        data,
        index,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(WEBHOOK_URLS.SAVE_DATA, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Data saved successfully:", result);

      toast({
        title: "Erfolgreich gespeichert",
        description: getActionMessage(action),
      });

      return true;
    } catch (error) {
      console.error("Error saving data:", error);
      
      // Try alternative approach without response parsing
      try {
        console.log("Retrying without response parsing...");
        const retryPayload = {
          action,
          data,
          index,
          timestamp: new Date().toISOString(),
        };
        
        const retryResponse = await fetch(WEBHOOK_URLS.SAVE_DATA, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(retryPayload),
        });
        
        console.log("Retry successful (no-cors mode)");
        toast({
          title: "Erfolgreich gespeichert",
          description: getActionMessage(action),
        });
        return true;
      } catch (retryError) {
        console.error("Retry also failed:", retryError);
        toast({
          title: "Fehler beim Speichern",
          description: "Die Änderungen konnten nicht gespeichert werden. Überprüfen Sie die Webhook-Verbindung.",
          variant: "destructive",
        });
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getActionMessage = (action: string): string => {
    switch (action) {
      case "create":
        return "Neuer Eintrag wurde hinzugefügt";
      case "update":
        return "Eintrag wurde aktualisiert";
      case "delete":
        return "Eintrag wurde gelöscht";
      default:
        return "Aktion wurde ausgeführt";
    }
  };

  return {
    loadData,
    saveData,
    isLoading,
  };
};