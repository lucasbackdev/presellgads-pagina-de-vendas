import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { templates } from "@/data/builderTemplates";
import { Template, PageConfig } from "@/types/builder";
import { useState } from "react";

interface TemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (config: PageConfig) => void;
}

const categories = [
  { id: 'presell', label: 'Pré-Venda' },
  { id: 'landing', label: 'Landing Page' },
  { id: 'homepage', label: 'Homepage' },
  { id: 'blog', label: 'Blog' },
];

export function TemplatesModal({ open, onOpenChange, onSelectTemplate }: TemplatesModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('presell');

  const filteredTemplates = templates.filter(t => t.category === selectedCategory);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Escolher Template</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 overflow-y-auto flex-1">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template.config)}
              className="border border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
            >
              <div className="text-4xl mb-3 text-center">{template.thumbnail}</div>
              <h3 className="font-medium text-sm text-center">{template.name}</h3>
              <p className="text-xs text-muted-foreground text-center capitalize mt-1">
                {template.complexity === 'minimal' ? 'Simples' : template.complexity === 'medium' ? 'Médio' : 'Completo'}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
