
import React, { useState } from 'react';
import { useIdeas } from '@/context/IdeaContext';
import Navbar from '@/components/Navbar';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Categories = () => {
  const { categories, addCategory, deleteCategory, ideas } = useIdeas();
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ original: string; edited: string } | null>(null);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() === '') {
      toast.error("Category name cannot be empty");
      return;
    }
    
    addCategory(newCategory.trim());
    setNewCategory('');
  };

  const handleDeleteCategory = (category: string) => {
    // Check if category is in use
    const ideasUsingCategory = ideas.filter(idea => idea.category === category).length;
    
    if (ideasUsingCategory > 0) {
      toast.error(`Cannot delete: ${ideasUsingCategory} ${ideasUsingCategory === 1 ? 'idea is' : 'ideas are'} using this category`);
      return;
    }
    
    deleteCategory(category);
  };

  const startEditing = (category: string) => {
    setEditingCategory({ original: category, edited: category });
  };

  const cancelEditing = () => {
    setEditingCategory(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingCategory) {
      setEditingCategory({ ...editingCategory, edited: e.target.value });
    }
  };

  const saveEdit = () => {
    if (!editingCategory || editingCategory.edited.trim() === '') {
      toast.error("Category name cannot be empty");
      return;
    }
    
    if (categories.includes(editingCategory.edited) && editingCategory.original !== editingCategory.edited) {
      toast.error("This category already exists");
      return;
    }
    
    deleteCategory(editingCategory.original);
    addCategory(editingCategory.edited);
    
    // Update ideas with the old category
    setEditingCategory(null);
  };

  // Count ideas per category
  const categoryCounts = categories.reduce<Record<string, number>>((acc, category) => {
    acc[category] = ideas.filter(idea => idea.category === category).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Manage Categories</h1>
          <p className="text-muted-foreground">Organize your ideas with categories</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Add Category</CardTitle>
              <CardDescription>Create a new category for your ideas</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
                <Input
                  placeholder="Category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>All Categories</CardTitle>
              <CardDescription>Manage your existing categories</CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No categories created yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div 
                      key={category}
                      className="flex items-center justify-between border p-3 rounded-md"
                    >
                      {editingCategory?.original === category ? (
                        <div className="flex items-center flex-1 gap-2">
                          <Input
                            value={editingCategory.edited}
                            onChange={handleEditChange}
                            className="flex-1"
                            autoFocus
                          />
                          <Button size="icon" variant="ghost" onClick={saveEdit}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={cancelEditing}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <span className="font-medium">{category}</span>
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({categoryCounts[category] || 0} {categoryCounts[category] === 1 ? 'idea' : 'ideas'})
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => startEditing(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleDeleteCategory(category)}
                              disabled={categoryCounts[category] > 0}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="border-t py-4">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          © 2025 IdeaSpark. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Categories;
