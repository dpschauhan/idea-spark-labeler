
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

export type Comment = {
  id: string;
  ideaId: string;
  author: string;
  content: string;
  createdAt: Date;
};

export type Notification = {
  id: string;
  message: string;
  type: 'share' | 'comment' | 'update';
  read: boolean;
  createdAt: Date;
};

export type IdeaTemplate = {
  id: string;
  name: string;
  description: string;
  defaultCategory?: string;
};

export type Idea = {
  id: string;
  title: string;
  description: string;
  category?: string;
  label?: 'best' | 'worst' | null;
  createdAt: Date;
  shared?: boolean;
  collaborators?: string[];
  lastUpdated?: Date;
  comments?: Comment[];
  isTemplate?: boolean;
  templateId?: string;
};

type IdeaContextType = {
  ideas: Idea[];
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt'>) => void;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  setLabel: (id: string, label: 'best' | 'worst' | null) => void;
  shareIdea: (id: string, email: string) => void;
  addComment: (ideaId: string, author: string, content: string) => void;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  templates: IdeaTemplate[];
  addTemplate: (template: Omit<IdeaTemplate, 'id'>) => void;
  deleteTemplate: (id: string) => void;
  categories: string[];
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  getAnalytics: () => {
    categoryCounts: Record<string, number>;
    bestIdeasCount: number;
    worstIdeasCount: number;
    sharedIdeasCount: number;
    totalIdeas: number;
    ideasPerMonth: Record<string, number>;
  };
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
          createdAt: new Date(idea.createdAt),
          lastUpdated: idea.lastUpdated ? new Date(idea.lastUpdated) : undefined,
          comments: idea.comments?.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
          })),
        }));
      } catch (e) {
        console.error('Failed to parse saved ideas', e);
        return [];
      }
    }
    return [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        return JSON.parse(savedNotifications).map((notification: any) => ({
          ...notification,
          createdAt: new Date(notification.createdAt),
        }));
      } catch (e) {
        console.error('Failed to parse saved notifications', e);
        return [];
      }
    }
    return [];
  });

  const [templates, setTemplates] = useState<IdeaTemplate[]>(() => {
    const savedTemplates = localStorage.getItem('templates');
    if (savedTemplates) {
      try {
        return JSON.parse(savedTemplates);
      } catch (e) {
        console.error('Failed to parse saved templates', e);
        return [];
      }
    }
    return [];
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      try {
        return JSON.parse(savedCategories);
      } catch (e) {
        console.error('Failed to parse saved categories', e);
        return [];
      }
    }
    // Extract categories from ideas as initial data
    return Array.from(
      new Set(ideas.map(idea => idea.category).filter(Boolean))
    ) as string[];
  });

  // Save ideas to localStorage when they change
  useEffect(() => {
    localStorage.setItem('ideas', JSON.stringify(ideas));
  }, [ideas]);

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Save templates to localStorage when they change
  useEffect(() => {
    localStorage.setItem('templates', JSON.stringify(templates));
  }, [templates]);

  // Save categories to localStorage when they change
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addIdea = (idea: Omit<Idea, 'id' | 'createdAt'>) => {
    const now = new Date();
    const newIdea: Idea = {
      ...idea,
      id: crypto.randomUUID(),
      createdAt: now,
      lastUpdated: now,
      comments: []
    };
    setIdeas([...ideas, newIdea]);
    toast.success("Idea added successfully!");
    
    // Add notification
    addNotification(`New idea created: ${idea.title}`, 'update');
  };

  const updateIdea = (id: string, updates: Partial<Idea>) => {
    const now = new Date();
    setIdeas(
      ideas.map((idea) => 
        idea.id === id 
          ? { ...idea, ...updates, lastUpdated: now } 
          : idea
      )
    );
    toast.success("Idea updated successfully!");
    
    // Add notification
    addNotification(`Idea "${ideas.find(i => i.id === id)?.title}" was updated`, 'update');
  };

  const deleteIdea = (id: string) => {
    const ideaToDelete = ideas.find(idea => idea.id === id);
    setIdeas(ideas.filter((idea) => idea.id !== id));
    toast.success("Idea deleted successfully!");
    
    // Add notification
    if (ideaToDelete) {
      addNotification(`Idea "${ideaToDelete.title}" was deleted`, 'update');
    }
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
    
    // Add notification
    const sharedIdea = ideas.find(i => i.id === id);
    if (sharedIdea) {
      addNotification(`You shared "${sharedIdea.title}" with ${email}`, 'share');
    }
  };

  const addComment = (ideaId: string, author: string, content: string) => {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      ideaId,
      author,
      content,
      createdAt: new Date()
    };
    
    setIdeas(
      ideas.map((idea) => 
        idea.id === ideaId 
          ? { 
              ...idea, 
              comments: [...(idea.comments || []), newComment] 
            } 
          : idea
      )
    );
    
    toast.success("Comment added!");
    
    // Add notification
    const commentedIdea = ideas.find(i => i.id === ideaId);
    if (commentedIdea) {
      addNotification(`New comment on "${commentedIdea.title}"`, 'comment');
    }
  };

  const addNotification = (message: string, type: 'share' | 'comment' | 'update') => {
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      message,
      type,
      read: false,
      createdAt: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addTemplate = (template: Omit<IdeaTemplate, 'id'>) => {
    const newTemplate: IdeaTemplate = {
      ...template,
      id: crypto.randomUUID(),
    };
    
    setTemplates([...templates, newTemplate]);
    toast.success("Template added successfully!");
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((template) => template.id !== id));
    toast.success("Template deleted successfully!");
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
      toast.success(`Category "${category}" added!`);
    } else {
      toast.error("Category already exists!");
    }
  };

  const deleteCategory = (category: string) => {
    setCategories(categories.filter((cat) => cat !== category));
    toast.success(`Category "${category}" deleted!`);
  };

  const getAnalytics = () => {
    const categoryCounts: Record<string, number> = {};
    let bestIdeasCount = 0;
    let worstIdeasCount = 0;
    let sharedIdeasCount = 0;
    const ideasPerMonth: Record<string, number> = {};
    
    ideas.forEach(idea => {
      // Count by category
      if (idea.category) {
        categoryCounts[idea.category] = (categoryCounts[idea.category] || 0) + 1;
      }
      
      // Count by label
      if (idea.label === 'best') bestIdeasCount++;
      if (idea.label === 'worst') worstIdeasCount++;
      
      // Count shared ideas
      if (idea.shared) sharedIdeasCount++;
      
      // Count ideas per month
      const month = idea.createdAt.toISOString().substring(0, 7); // Format: YYYY-MM
      ideasPerMonth[month] = (ideasPerMonth[month] || 0) + 1;
    });
    
    return {
      categoryCounts,
      bestIdeasCount,
      worstIdeasCount,
      sharedIdeasCount,
      totalIdeas: ideas.length,
      ideasPerMonth
    };
  };

  return (
    <IdeaContext.Provider value={{ 
      ideas, 
      addIdea, 
      updateIdea, 
      deleteIdea, 
      setLabel, 
      shareIdea,
      addComment,
      notifications,
      markNotificationAsRead,
      clearNotifications,
      templates,
      addTemplate,
      deleteTemplate,
      categories,
      addCategory,
      deleteCategory,
      getAnalytics
    }}>
      {children}
    </IdeaContext.Provider>
  );
};
