import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { DataModal } from "@/components/DataModal";
import { useWebhooks } from "@/hooks/useWebhooks";
import { Database, RefreshCw, Trash2, Plus } from "lucide-react";

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
          <Card className="mb-8 card-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Database className="w-6 h-6 text-primary" />
                <span>Datenbank Steuerung</span>
              </CardTitle>
              <CardDescription className="text-base">
                Laden Sie Daten aus der Datenbank oder verwalten Sie Einträge
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
                  <Trash2 className="w-5 h-5 mr-3" />
                  Tabelle leeren
                </Button>
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
                    Klicken Sie auf "Daten laden", um mit der Datenverwaltung zu beginnen
                  </p>
                  <Button onClick={handleLoadData} className="btn-primary">
                    <Database className="w-5 h-5 mr-3" />
                    Daten laden
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
                      Datentabelle
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {data.length} Einträge gefunden - Klicken Sie auf eine Zelle zum Inline-Bearbeiten
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
        </div>
      </div>
    </div>
  );
};

export default Index;