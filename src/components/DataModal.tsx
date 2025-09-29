import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Database, RefreshCw } from "lucide-react";

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, any>) => void;
  data?: Record<string, any>;
  columns?: string[];
  isLoading?: boolean;
}

export const DataModal: React.FC<DataModalProps> = ({
  isOpen,
  onClose,
  onSave,
  data,
  columns = [],
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      // Initialize empty form with columns
      const emptyData: Record<string, any> = {};
      columns.forEach((col) => {
        emptyData[col] = "";
      });
      setFormData(emptyData);
    }
  }, [data, columns, isOpen]);

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  const renderField = (key: string, value: any) => {
    // Check if it's a long text field
    const isLongText = typeof value === "string" && value.length > 100;
    
    if (isLongText || key.toLowerCase().includes("description") || key.toLowerCase().includes("comment") || key.toLowerCase().includes("notes")) {
      return (
        <Textarea
          value={value || ""}
          onChange={(e) => handleInputChange(key, e.target.value)}
          placeholder={`${key.replace(/_/g, " ")} eingeben...`}
          className="min-h-[120px] input-enhanced resize-none"
        />
      );
    }

    return (
      <Input
        type={typeof value === "number" ? "number" : "text"}
        value={value || ""}
        onChange={(e) => {
          const newValue = typeof value === "number" ? 
            parseFloat(e.target.value) || 0 : 
            e.target.value;
          handleInputChange(key, newValue);
        }}
        placeholder={`${key.replace(/_/g, " ")} eingeben...`}
        className="input-enhanced"
      />
    );
  };

  const fieldsToRender = Object.keys(formData).length > 0 ? 
    Object.keys(formData) : 
    columns;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="modal-content max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl flex items-center gap-3">
            {data ? (
              <>
                <Edit className="w-6 h-6 text-primary" />
                Eintrag bearbeiten
              </>
            ) : (
              <>
                <Plus className="w-6 h-6 text-accent" />
                Neuen Eintrag hinzufügen
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fieldsToRender.map((key, index) => (
              <div 
                key={key} 
                className="space-y-3 animate-slide-up" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Label htmlFor={key} className="capitalize font-semibold text-foreground text-base">
                  {key.replace(/_/g, " ")}
                </Label>
                <div className="relative">
                  {renderField(key, formData[key])}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="btn-secondary"
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Speichern...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5 mr-2" />
                  Speichern
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};