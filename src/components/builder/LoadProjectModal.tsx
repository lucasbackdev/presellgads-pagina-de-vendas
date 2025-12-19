import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SavedProject } from "@/types/builder";
import { Trash2 } from "lucide-react";

interface LoadProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: SavedProject[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

export function LoadProjectModal({ open, onOpenChange, projects, onLoad, onDelete }: LoadProjectModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[60vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Carregar Projeto</DialogTitle>
        </DialogHeader>
        
        {projects.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nenhum projeto salvo</p>
        ) : (
          <div className="space-y-2 overflow-y-auto flex-1">
            {projects.map(project => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50"
              >
                <div className="cursor-pointer flex-1" onClick={() => onLoad(project.id)}>
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(project.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
