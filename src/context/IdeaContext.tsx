
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

export type Idea = {
  id: string;
  title: string;
  description: string;
  category?: string;
  label?: 'best' | 'worst' | null;
  createdAt: Date;
  shared?: boolean;
  collaborators?: string[];
};

type IdeaContextType = {
  ideas: Idea[];
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt'>) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  setLabel: (id: string, label: 'best' | 'worst' | null) => void;
  shareIdea: (id: string, email: string) => void;
};

const IdeaContext = createContext<IdeaContextType | undefined>(undefined);

export const useIdeas = () => {
  const context = useContext(IdeaContext);
  if (!context) {
    throw new Error('useIdeas must be used within an IdeaProvider');
  }
  return context;
};

export const IdeaProvider = ({ children }: { children: ReactNode }) => {
  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const savedIdeas = localStorage.getItem('ideas');
    if (savedIdeas) {
      try {
        // Convert string dates back to Date objects
        return JSON.parse(savedIdeas).map((idea: any) => ({
          ...idea,
          createdAt: new Date(idea.createdAt)
        }));
      } catch (e) {
        console.error('Failed to parse saved ideas', e);
        return [];
      }
    }
    return [];
  });

  // Save ideas to localStorage when they change
  useEffect(() => {
    localStorage.setItem('ideas', JSON.stringify(ideas));
  }, [ideas]);

  const addIdea = (idea: Omit<Idea, 'id' | 'createdAt'>) => {
    const newIdea: Idea = {
      ...idea,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setIdeas([...ideas, newIdea]);
    toast.success("Idea added successfully!");
  };

  const updateIdea = (id: string, updates: Partial<Idea>) => {
    setIdeas(
      ideas.map((idea) => (idea.id === id ? { ...idea, ...updates } : idea))
    );
    toast.success("Idea updated successfully!");
  };

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter((idea) => idea.id !== id));
    toast.success("Idea deleted successfully!");
  };

  const setLabel = (id: string, label: 'best' | 'worst' | null) => {
    setIdeas(
      ideas.map((idea) => 
        idea.id === id 
          ? { ...idea, label: idea.label === label ? null : label } 
          : idea
      )
    );
    if (label) {
      toast.success(`Idea marked as ${label}!`);
    } else {
      toast.info("Label removed from idea");
    }
  };

  const shareIdea = (id: string, email: string) => {
    setIdeas(
      ideas.map((idea) => 
        idea.id === id 
          ? { 
              ...idea, 
              shared: true, 
              collaborators: [...(idea.collaborators || []), email] 
            } 
          : idea
      )
    );
    toast.success(`Idea shared with ${email}!`);
  };

  return (
    <IdeaContext.Provider value={{ ideas, addIdea, updateIdea, deleteIdea, setLabel, shareIdea }}>
      {children}
    </IdeaContext.Provider>
  );
};
