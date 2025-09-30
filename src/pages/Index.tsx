import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { DataModal } from "@/components/DataModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database, RefreshCw, Trash2 } from "lucide-react";

const Index = () => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Record<string, any> | undefined>();
  const [editingIndex, setEditingIndex] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLoadData = async () => {
    setIsLoading(true);
    try {
      const { data: plants, error } = await supabase
        .from('industrial_gas_plants')
        .select('*')
        .order('plant_id');
      
      if (error) throw error;
      
      setData(plants || []);
      toast({
        title: "Success",
        description: `Loaded ${plants?.length || 0} plant records successfully`,
      });
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load data from database",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
    setIsLoading(true);
    try {
      const recordToDelete = data[index];
      const { error } = await supabase
        .from('industrial_gas_plants')
        .delete()
        .eq('id', recordToDelete.id);
      
      if (error) throw error;
      
      const newData = data.filter((_, i) => i !== index);
      setData(newData);
      
      toast({
        title: "Success",
        description: "Plant record deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting data:", error);
      toast({
        title: "Error",
        description: "Failed to delete plant record",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      if (editingIndex !== undefined) {
        // Update existing record
        const { error } = await supabase
          .from('industrial_gas_plants')
          .update({
            plant_id: formData.plant_id,
            plant_name: formData.plant_name,
            gas_type: formData.gas_type,
            daily_capacity_tons: parseFloat(formData.daily_capacity_tons),
            status: formData.status,
            last_maintenance: formData.last_maintenance,
            responsible_engineer: formData.responsible_engineer,
            contact_email: formData.contact_email,
          })
          .eq('id', editingData?.id);
        
        if (error) throw error;
        
        // Update local state
        const newData = [...data];
        newData[editingIndex] = { ...editingData, ...formData };
        setData(newData);
      } else {
        // Create new record
        const { data: newRecord, error } = await supabase
          .from('industrial_gas_plants')
          .insert({
            plant_id: formData.plant_id,
            plant_name: formData.plant_name,
            gas_type: formData.gas_type,
            daily_capacity_tons: parseFloat(formData.daily_capacity_tons),
            status: formData.status,
            last_maintenance: formData.last_maintenance,
            responsible_engineer: formData.responsible_engineer,
            contact_email: formData.contact_email,
          })
          .select()
          .single();
        
        if (error) throw error;
        
        setData([...data, newRecord]);
      }
      
      setIsModalOpen(false);
      setEditingData(undefined);
      setEditingIndex(undefined);
      
      toast({
        title: "Success",
        description: `Plant record ${editingIndex !== undefined ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Error",
        description: "Failed to save plant data",
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

  // Load data on component mount
  useEffect(() => {
    handleLoadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Industrial Gas Plants Management
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your industrial gas plant operations and data
            </p>
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
                      Loading...
                    </>
                  ) : (
                    <>
                      <Database className="w-5 h-5 mr-3" />
                      Load Data
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
                  Clear Table
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
                    No Data Loaded
                  </h3>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Click "Load Data" to start managing your industrial gas plant data
                  </p>
                  <Button onClick={handleLoadData} className="btn-primary">
                    <Database className="w-5 h-5 mr-3" />
                    Load Data
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
        </div>
      </div>
    </div>
  );
};

export default Index;