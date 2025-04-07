
import React, { useState } from 'react';
import { useIdeas } from '@/context/IdeaContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, X, Sparkles } from 'lucide-react';

const categories = [
  'Business', 
  'Technology', 
  'Health', 
  'Education', 
  'Entertainment', 
  'Art', 
  'Personal', 
  'Other'
];

const AddIdeaForm: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const { addIdea } = useIdeas();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    addIdea({
      title: title.trim(),
      description: description.trim(),
      category: category,
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory(undefined);
    setIsFormOpen(false);
  };

  if (!isFormOpen) {
    return (
      <Button 
        onClick={() => setIsFormOpen(true)} 
        className="w-full"
        variant="outline"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Idea
      </Button>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-30px] left-[-30px] w-[100px] h-[100px] bg-accent/10 rounded-full blur-xl pointer-events-none" />
      
      <form onSubmit={handleSubmit}>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CardTitle>New Idea</CardTitle>
              <Sparkles className="h-5 w-5 ml-2 text-yellow-500" />
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsFormOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Idea title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your idea..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Save Idea
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddIdeaForm;
