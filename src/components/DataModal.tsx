import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

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
    
    if (isLongText || key.toLowerCase().includes("description") || key.toLowerCase().includes("comment")) {
      return (
        <Textarea
          value={value || ""}
          onChange={(e) => handleInputChange(key, e.target.value)}
          placeholder={`${key} eingeben...`}
          className="min-h-[100px]"
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
        placeholder={`${key} eingeben...`}
      />
    );
  };

  const fieldsToRender = Object.keys(formData).length > 0 ? 
    Object.keys(formData) : 
    columns;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {data ? "Eintrag bearbeiten" : "Neuen Eintrag hinzufügen"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldsToRender.map((key) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="capitalize font-medium">
                  {key.replace(/_/g, " ")}
                </Label>
                {renderField(key, formData[key])}
              </div>
            ))}
          </div>

          <DialogFooter className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Speichern..." : "Speichern"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};