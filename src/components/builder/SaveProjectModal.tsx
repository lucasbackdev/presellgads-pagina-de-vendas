import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SaveProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
}

export function SaveProjectModal({ open, onOpenChange, onSave }: SaveProjectModalProps) {
  const [name, setName] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Salvar Projeto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Nome do projeto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!name.trim()}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
