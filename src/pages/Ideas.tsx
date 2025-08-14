
import React, { useState } from 'react';
import { useIdeas } from '@/context/IdeaContext';
import Navbar from '@/components/Navbar';
import IdeaCard from '@/components/IdeaCard';
import AddIdeaForm from '@/components/AddIdeaForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Star, ThumbsDown, Flame, Share, Palette } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ExportIdeas from '@/components/ExportIdeas';

const Ideas = () => {
  const { ideas } = useIdeas();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');
  const [viewFilter, setViewFilter] = useState<'all' | 'mine' | 'shared'>('all');
  const [colorTheme, setColorTheme] = useState('default');

  const colorThemes = {
    default: {
      background: 'bg-background',
      accent: 'from-primary to-primary-foreground',
      text: 'text-foreground'
    },
    ocean: {
      background: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
      accent: 'from-blue-500 to-cyan-500',
      text: 'text-blue-900 dark:text-blue-100'
    },
    sunset: {
      background: 'bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20',
      accent: 'from-orange-500 to-pink-500',
      text: 'text-orange-900 dark:text-orange-100'
    },
    forest: {
      background: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      accent: 'from-green-500 to-emerald-500',
      text: 'text-green-900 dark:text-green-100'
    },
    purple: {
      background: 'bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20',
      accent: 'from-purple-500 to-violet-500',
      text: 'text-purple-900 dark:text-purple-100'
    }
  };

  const currentTheme = colorThemes[colorTheme as keyof typeof colorThemes];
  
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
    
    const matchesView = viewFilter === 'all' || 
      (viewFilter === 'shared' && idea.shared) || 
      (viewFilter === 'mine' && !idea.shared);
    
    return matchesSearch && matchesCategory && matchesView;
  });

  const bestIdeas = filteredIdeas.filter(idea => idea.label === 'best');
  const worstIdeas = filteredIdeas.filter(idea => idea.label === 'worst');
  const unlabeledIdeas = filteredIdeas.filter(idea => !idea.label);
  const sharedIdeas = filteredIdeas.filter(idea => idea.shared);
  
  return (
    <div className={`min-h-screen flex flex-col ${currentTheme.background}`}>
      <Navbar />
      
      <main className="flex-1 container px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.accent} bg-clip-text text-transparent`}>
              Your Ideas
            </h1>
            <p className="text-muted-foreground">Manage and organize your creative thoughts</p>
          </div>
          
          <div className="w-full md:w-auto flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Palette className="h-4 w-4" />
                  Colors
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Choose Color Theme</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(colorThemes).map(([key, theme]) => (
                      <Button
                        key={key}
                        variant={colorTheme === key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setColorTheme(key)}
                        className="justify-start capitalize"
                      >
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.accent} mr-2`} />
                        {key}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <ExportIdeas />
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
          
          <div className="grid grid-cols-2 gap-2">
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
            
            <Select value={viewFilter} onValueChange={(val: 'all' | 'mine' | 'shared') => setViewFilter(val)}>
              <SelectTrigger>
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ideas</SelectItem>
                <SelectItem value="mine">My Ideas</SelectItem>
                <SelectItem value="shared">Shared Ideas</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            <TabsList className={`mb-4 bg-gradient-to-r ${currentTheme.accent} bg-opacity-10`}>
              <TabsTrigger value="all" className="data-[state=active]:bg-white/20">
                All
                <Badge variant="secondary" className="ml-2">{filteredIdeas.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="best" className="flex items-center gap-1 data-[state=active]:bg-white/20">
                <Star className="h-3.5 w-3.5 text-yellow-500" />
                Best
                <Badge variant="secondary" className="ml-2">{bestIdeas.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="worst" className="flex items-center gap-1 data-[state=active]:bg-white/20">
                <ThumbsDown className="h-3.5 w-3.5 text-red-500" />
                Worst
                <Badge variant="secondary" className="ml-2">{worstIdeas.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex items-center gap-1 data-[state=active]:bg-white/20">
                <Share className="h-3.5 w-3.5 text-blue-500" />
                Shared
                <Badge variant="secondary" className="ml-2">{sharedIdeas.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unlabeled" className="data-[state=active]:bg-white/20">
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
            
            <TabsContent value="shared" className="mt-0">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {sharedIdeas.map((idea) => (
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
