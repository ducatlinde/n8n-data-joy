import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { DataModal } from "@/components/DataModal";
import { useWebhooks } from "@/hooks/useWebhooks";
import { Database, RefreshCw, Trash2 } from "lucide-react";

const Index = () => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Record<string, any> | undefined>();
  const [editingIndex, setEditingIndex] = useState<number | undefined>();
  const { loadData, saveData, isLoading } = useWebhooks();

  const handleLoadData = async () => {
    const loadedData = await loadData();
    setData(loadedData);
  };

  const handleClearTable = () => {
    setData([]);
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
    const rowToDelete = data[index];
    const success = await saveData(rowToDelete, "delete", index);
    
    if (success) {
      const newData = data.filter((_, i) => i !== index);
      setData(newData);
    }
  };

  const handleSave = async (formData: Record<string, any>) => {
    const action = editingIndex !== undefined ? "update" : "create";
    const success = await saveData(formData, action, editingIndex);
    
    if (success) {
      if (editingIndex !== undefined) {
        // Update existing item
        const newData = [...data];
        newData[editingIndex] = formData;
        setData(newData);
      } else {
        // Add new item
        setData([...data, formData]);
      }
      setIsModalOpen(false);
      setEditingData(undefined);
      setEditingIndex(undefined);
    }
  };

  const getColumns = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Daten Management System
            </h1>
            <p className="text-lg text-muted-foreground">
              Verwalten Sie Ihre Datenbank über n8n Webhooks
            </p>
          </div>

          {/* Control Panel */}
          <Card className="mb-8 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Datenbank Steuerung</span>
              </CardTitle>
              <CardDescription>
                Laden Sie Daten aus der Datenbank oder setzen Sie die Tabelle zurück
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
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Laden...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      Daten laden
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleClearTable}
                  variant="outline"
                  disabled={isLoading || data.length === 0}
                  className="btn-secondary"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Tabelle leeren
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Display */}
          {data.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="py-12">
                <div className="text-center">
                  <Database className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Keine Daten geladen
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Klicken Sie auf "Daten laden", um mit der Datenverwaltung zu beginnen
                  </p>
                  <Button onClick={handleLoadData} className="btn-primary">
                    <Database className="w-4 h-4 mr-2" />
                    Jetzt Daten laden
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Datentabelle</CardTitle>
                <CardDescription>
                  {data.length} Einträge gefunden - Klicken Sie auf eine Zelle zum Bearbeiten
                </CardDescription>
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
        </div>
      </div>
    </div>
  );
};

export default Index;