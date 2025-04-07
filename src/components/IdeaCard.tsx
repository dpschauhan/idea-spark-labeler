
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsDown, Trash, Share, Edit } from 'lucide-react';
import { Idea, useIdeas } from '@/context/IdeaContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IdeaCardProps {
  idea: Idea;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const { setLabel, deleteIdea, shareIdea, updateIdea } = useIdeas();
  const [shareEmail, setShareEmail] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedIdea, setEditedIdea] = useState({
    title: idea.title,
    description: idea.description,
    category: idea.category || ''
  });
  
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(idea.createdAt));

  const handleShare = () => {
    if (shareEmail) {
      shareIdea(idea.id, shareEmail);
      setShareEmail('');
      setShareDialogOpen(false);
    }
  };

  const handleSaveEdit = () => {
    updateIdea(idea.id, {
      title: editedIdea.title,
      description: editedIdea.description,
      category: editedIdea.category || undefined
    });
    setEditDialogOpen(false);
  };

  return (
    <>
      <Card className="idea-card animate-in">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{idea.title}</CardTitle>
            {idea.label && (
              <Badge variant={idea.label === 'best' ? 'default' : 'destructive'} className="ml-2">
                {idea.label === 'best' ? 'Best Idea' : 'Worst Idea'}
              </Badge>
            )}
          </div>
          <CardDescription className="flex items-center justify-between">
            <span>{formattedDate}</span>
            {idea.shared && (
              <Badge variant="outline" className="ml-2">
                Shared
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{idea.description}</p>
          {idea.category && (
            <Badge variant="secondary" className="mt-2">
              {idea.category}
            </Badge>
          )}
          {idea.collaborators && idea.collaborators.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">Shared with:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {idea.collaborators.map((email, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {email}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={idea.label === 'best' ? 'text-yellow-500' : 'text-gray-500'}
                    onClick={() => setLabel(idea.id, 'best')}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{idea.label === 'best' ? 'Remove best label' : 'Mark as best idea'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={idea.label === 'worst' ? 'text-red-500' : 'text-gray-500'}
                    onClick={() => setLabel(idea.id, 'worst')}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{idea.label === 'worst' ? 'Remove worst label' : 'Mark as worst idea'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-500 hover:text-blue-500"
                    onClick={() => setEditDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit idea</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-500 hover:text-green-500"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share idea</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => deleteIdea(idea.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete idea</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share This Idea</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Enter email address to collaborate with your teammate on this idea
            </p>
            <Input
              type="email"
              placeholder="colleague@example.com"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="mb-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleShare}>Share</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Idea</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={editedIdea.title}
                onChange={(e) => setEditedIdea({...editedIdea, title: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right text-sm font-medium">
                Category
              </label>
              <Select 
                value={editedIdea.category} 
                onValueChange={(value) => setEditedIdea({...editedIdea, category: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium pt-2">
                Description
              </label>
              <Textarea
                id="description"
                value={editedIdea.description}
                onChange={(e) => setEditedIdea({...editedIdea, description: e.target.value})}
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IdeaCard;
