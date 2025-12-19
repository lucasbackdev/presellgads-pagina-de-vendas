import { useState, useEffect } from 'react';
import { SavedProject, PageConfig } from '@/types/builder';
import { toast } from 'sonner';

const STORAGE_KEY = 'afility_saved_projects';

export function useBuilderStorage() {
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSavedProjects(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved projects:', e);
      }
    }
  }, []);

  const saveProject = (name: string, config: PageConfig): SavedProject => {
    const now = new Date().toISOString();
    const existingIndex = savedProjects.findIndex(p => p.name === name);
    
    let project: SavedProject;
    let newProjects: SavedProject[];

    if (existingIndex >= 0) {
      project = {
        ...savedProjects[existingIndex],
        updatedAt: now,
        config
      };
      newProjects = [...savedProjects];
      newProjects[existingIndex] = project;
    } else {
      project = {
        id: `project-${Date.now()}`,
        name,
        createdAt: now,
        updatedAt: now,
        config
      };
      newProjects = [...savedProjects, project];
    }

    setSavedProjects(newProjects);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    toast.success(`Projeto "${name}" salvo!`);
    
    return project;
  };

  const loadProject = (id: string): SavedProject | null => {
    const project = savedProjects.find(p => p.id === id);
    if (project) {
      toast.success(`Projeto "${project.name}" carregado!`);
      return project;
    }
    toast.error('Projeto não encontrado');
    return null;
  };

  const deleteProject = (id: string) => {
    const newProjects = savedProjects.filter(p => p.id !== id);
    setSavedProjects(newProjects);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    toast.success('Projeto removido');
  };

  return {
    savedProjects,
    saveProject,
    loadProject,
    deleteProject
  };
}
