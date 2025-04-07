
import React, { useState } from 'react';
import { useIdeas } from '@/context/IdeaContext';
import Navbar from '@/components/Navbar';
import IdeaCard from '@/components/IdeaCard';
import AddIdeaForm from '@/components/AddIdeaForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Star, ThumbsDown, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Ideas = () => {
  const { ideas } = useIdeas();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');
  
  // Get unique categories from ideas
  const categories = Array.from(
    new Set(ideas.map(idea => idea.category).filter(Boolean))
  );

  // Filter ideas based on active filters and search term
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch = !searchTerm.trim() || 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || 
      idea.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const bestIdeas = filteredIdeas.filter(idea => idea.label === 'best');
  const worstIdeas = filteredIdeas.filter(idea => idea.label === 'worst');
  const unlabeledIdeas = filteredIdeas.filter(idea => !idea.label);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Your Ideas</h1>
            <p className="text-muted-foreground">Manage and organize your creative thoughts</p>
          </div>
          
          <div className="w-full md:w-auto">
            <AddIdeaForm />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-1 md:col-span-2">
            <Input
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category as string}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {filteredIdeas.length === 0 ? (
          <div className="text-center py-12">
            <Flame className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold">No ideas found</h2>
            <p className="text-muted-foreground">
              {ideas.length === 0
                ? "You haven't added any ideas yet. Get started by adding your first idea!"
                : "No ideas match your current filters."}
            </p>
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                All
                <Badge variant="secondary" className="ml-2">{filteredIdeas.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="best" className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-yellow-500" />
                Best
                <Badge variant="secondary" className="ml-2">{bestIdeas.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="worst" className="flex items-center gap-1">
                <ThumbsDown className="h-3.5 w-3.5 text-red-500" />
                Worst
                <Badge variant="secondary" className="ml-2">{worstIdeas.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unlabeled">
                Unlabeled
                <Badge variant="secondary" className="ml-2">{unlabeledIdeas.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="best" className="mt-0">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {bestIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="worst" className="mt-0">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {worstIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="unlabeled" className="mt-0">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {unlabeledIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
      
      <footer className="border-t py-4">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          © 2025 IdeaSpark. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Ideas;
