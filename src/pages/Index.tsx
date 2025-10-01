import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { DataModal } from "@/components/DataModal";
import { SettingsModal } from "@/components/SettingsModal";
import { useToast } from "@/hooks/use-toast";
import { Database, RefreshCw, Trash2, Settings, Plus } from "lucide-react";

const Index = () => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingData, setEditingData] = useState<Record<string, any> | undefined>();
  const [editingIndex, setEditingIndex] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [getWebhook, setGetWebhook] = useState(() => {
    return localStorage.getItem('getWebhook') || '';
  });
  const [postWebhook, setPostWebhook] = useState(() => {
    return localStorage.getItem('postWebhook') || '';
  });
  const { toast } = useToast();

  const handleLoadData = async () => {
    if (!getWebhook) {
      toast({
        title: "Webhook fehlt",
        description: "Bitte konfigurieren Sie zuerst den GET Webhook in den Einstellungen",
        variant: "destructive",
      });
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(getWebhook);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const plants = await response.json();
      
      setData(Array.isArray(plants) ? plants : []);
      setDataLoaded(true);
      toast({
        title: "Erfolg",
        description: `${Array.isArray(plants) ? plants.length : 0} Datensätze erfolgreich geladen`,
      });
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Fehler",
        description: "Daten konnten nicht vom Webhook geladen werden",
        variant: "destructive",
      });
      setDataLoaded(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearTable = () => {
    setData([]);
    setDataLoaded(false);
  };

  const handleEdit = (row: Record<string, any>, index: number) => {
    setEditingData(row);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingData(undefined);
    setEditingIndex(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = async (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
    toast({
      title: "Erfolg",
      description: "Datensatz gelöscht",
    });
  };

  const handleSave = async (formData: Record<string, any>) => {
    if (!postWebhook) {
      toast({
        title: "Webhook fehlt",
        description: "Bitte konfigurieren Sie zuerst den POST Webhook in den Einstellungen",
        variant: "destructive",
      });
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      let savedRecord;
      
      if (editingIndex !== undefined) {
        // Update existing record
        savedRecord = { ...formData };
        const newData = [...data];
        newData[editingIndex] = savedRecord;
        setData(newData);
      } else {
        // Create new record
        savedRecord = { ...formData };
        setData([...data, savedRecord]);
      }

      // Send the saved record to webhook
      try {
        const response = await fetch(postWebhook, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(savedRecord),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (webhookError) {
        console.error('Webhook notification failed:', webhookError);
        toast({
          title: "Webhook Fehler",
          description: "Daten wurden lokal gespeichert, aber Webhook-Benachrichtigung fehlgeschlagen",
          variant: "destructive",
        });
      }
      
      setIsModalOpen(false);
      setEditingData(undefined);
      setEditingIndex(undefined);
      
      toast({
        title: "Erfolg",
        description: `Datensatz ${editingIndex !== undefined ? "aktualisiert" : "erstellt"}`,
      });
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Fehler",
        description: "Daten konnten nicht gespeichert werden",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getColumns = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(key => !['id', 'created_at', 'updated_at'].includes(key));
  };

  const handleSaveWebhooks = (newGetWebhook: string, newPostWebhook: string) => {
    setGetWebhook(newGetWebhook);
    setPostWebhook(newPostWebhook);
    localStorage.setItem('getWebhook', newGetWebhook);
    localStorage.setItem('postWebhook', newPostWebhook);
    toast({
      title: "Einstellungen gespeichert",
      description: "Ihre Webhook-Einstellungen wurden erfolgreich gespeichert",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Industrial Gas Plants Management
                </h1>
                <p className="text-lg text-muted-foreground">
                  Manage your industrial gas plant operations and data
                </p>
              </div>
              <Button
                onClick={() => setIsSettingsOpen(true)}
                variant="outline"
                size="icon"
                className="ml-4"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Control Panel */}
          <Card className="mb-8 card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Database className="w-6 h-6 text-primary" />
                <span>Database Control</span>
              </CardTitle>
              <CardDescription className="text-base">
                Load data from database or manage entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleLoadData}
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                      Laden...
                    </>
                  ) : (
                    <>
                      <Database className="w-5 h-5 mr-3" />
                      Daten Laden
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleClearTable}
                  variant="outline"
                  disabled={isLoading || data.length === 0}
                  className="btn-secondary"
                >
                  <Trash2 className="w-5 h-5 mr-3" />
                  Tabelle Leeren
                </Button>
                {dataLoaded && (
                  <Button
                    onClick={handleAdd}
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    <Plus className="w-5 h-5 mr-3" />
                    Hinzufügen
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Data Display */}
          {data.length === 0 ? (
            <Card className="card-enhanced">
              <CardContent className="py-16">
                <div className="text-center">
                  <Database className="w-20 h-20 mx-auto text-primary/60 mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Keine Daten geladen
                  </h3>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Klicken Sie auf "Daten Laden", um mit der Verwaltung zu beginnen
                  </p>
                  <Button onClick={handleLoadData} className="btn-primary">
                    <Database className="w-5 h-5 mr-3" />
                    Daten Laden
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-enhanced">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Plant Data Table
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {data.length} entries found - Click on a cell for inline editing
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={data}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAdd={handleAdd}
                />
              </CardContent>
            </Card>
          )}

          {/* Data Modal */}
          <DataModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingData(undefined);
              setEditingIndex(undefined);
            }}
            onSave={handleSave}
            data={editingData}
            columns={getColumns()}
            isLoading={isLoading}
          />

          {/* Settings Modal */}
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onSave={handleSaveWebhooks}
            getWebhook={getWebhook}
            postWebhook={postWebhook}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;