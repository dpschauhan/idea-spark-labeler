
import React, { useState } from 'react';
import { useIdeas } from '@/context/IdeaContext';
import Navbar from '@/components/Navbar';
import { Plus, Trash2, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Templates = () => {
  const { templates, addTemplate, deleteTemplate, categories, addIdea } = useIdeas();
  const navigate = useNavigate();
  
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    defaultCategory: ''
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setNewTemplate((prev) => ({ ...prev, defaultCategory: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTemplate.name.trim()) {
      toast.error("Template name is required");
      return;
    }
    
    addTemplate({
      name: newTemplate.name.trim(),
      description: newTemplate.description.trim(),
      defaultCategory: newTemplate.defaultCategory || undefined
    });
    
    setNewTemplate({
      name: '',
      description: '',
      defaultCategory: ''
    });
  };

  const handleUseTemplate = (template: typeof templates[0]) => {
    // Create a new idea from the template
    addIdea({
      title: `${template.name} (from template)`,
      description: template.description,
      category: template.defaultCategory,
      templateId: template.id
    });
    
    toast.success("New idea created from template!");
    navigate('/ideas');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Idea Templates</h1>
          <p className="text-muted-foreground">Create reusable templates for your ideas</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Create Template</CardTitle>
              <CardDescription>Make a reusable template for similar ideas</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Template Name</label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Project Proposal"
                    value={newTemplate.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description Template</label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="## Goal
- What problem does this solve?

## Implementation
- Key steps
- Resources needed

## Expected Outcomes
- Success metrics"
                    rows={6}
                    value={newTemplate.description}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Default Category</label>
                  <Select 
                    value={newTemplate.defaultCategory} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Available Templates</h2>
            
            {templates.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12 text-muted-foreground">
                  <p>No templates created yet</p>
                  <p className="text-sm mt-1">Create your first template to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <CardTitle>{template.name}</CardTitle>
                      {template.defaultCategory && (
                        <CardDescription>Category: {template.defaultCategory}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="bg-secondary/30 p-3 rounded-md text-sm whitespace-pre-line max-h-40 overflow-auto">
                        {template.description || "No description provided"}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleUseTemplate(template)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
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

export default Templates;
