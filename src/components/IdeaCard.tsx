
import React, { useState } from 'react';
import { useIdeas, type Idea } from '@/context/IdeaContext';
import { Star, ThumbsDown, Trash2, Edit, Share, Calendar, CheckCheck, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import CommentSection from '@/components/CommentSection';

interface IdeaCardProps {
  idea: Idea;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const { deleteIdea, setLabel, updateIdea, shareIdea, categories } = useIdeas();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedIdea, setEditedIdea] = useState<Idea>(idea);
  
  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shareEmail.trim() || !validateEmail(shareEmail)) {
      return;
    }
    
    shareIdea(idea.id, shareEmail.trim());
    setShareEmail('');
    setShareDialogOpen(false);
  };
  
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editedIdea.title.trim()) {
      return;
    }
    
    updateIdea(idea.id, {
      title: editedIdea.title.trim(),
      description: editedIdea.description.trim(),
      category: editedIdea.category,
    });
    
    setEditDialogOpen(false);
  };
  
  const commentsCount = idea.comments?.length || 0;
  
  return (
    <Card className={`${idea.label === 'best' ? 'border-yellow-300' : idea.label === 'worst' ? 'border-red-300' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{idea.title}</h3>
            {idea.category && (
              <Badge variant="outline" className="mt-1">
                {idea.category}
              </Badge>
            )}
          </div>
          <div className="flex space-x-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLabel(idea.id, 'best')}
              className={idea.label === 'best' ? 'text-yellow-500' : ''}
            >
              <Star className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLabel(idea.id, 'worst')}
              className={idea.label === 'worst' ? 'text-red-500' : ''}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-line">{idea.description}</p>
        
        <div className="flex items-center mt-3 space-x-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>Created {formatDistanceToNow(idea.createdAt, { addSuffix: true })}</span>
        </div>
        
        {idea.shared && (
          <div className="flex items-center mt-1 text-xs text-blue-500">
            <CheckCheck className="h-3.5 w-3.5 mr-1" />
            <span>
              Shared with {idea.collaborators?.length || 0} {idea.collaborators?.length === 1 ? 'person' : 'people'}
            </span>
          </div>
        )}
        
        {commentsCount > 0 && (
          <div className="flex items-center mt-1 text-xs text-green-500">
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            <span>
              {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditDialogOpen(true)}
          >
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteIdea(idea.id)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShareDialogOpen(true)}
        >
          <Share className="h-3.5 w-3.5 mr-1" />
          Share
        </Button>
      </CardFooter>
      
      <CommentSection ideaId={idea.id} />
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Idea</DialogTitle>
            <DialogDescription>
              Enter the email of the person you want to share "{idea.title}" with.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleShareSubmit}>
            <div className="space-y-4 py-4">
              <Input
                placeholder="colleague@example.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                type="email"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!shareEmail.trim() || !validateEmail(shareEmail)}>
                Share
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Idea</DialogTitle>
            <DialogDescription>
              Make changes to your idea below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  value={editedIdea.title}
                  onChange={(e) => setEditedIdea({ ...editedIdea, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  value={editedIdea.description}
                  onChange={(e) => setEditedIdea({ ...editedIdea, description: e.target.value })}
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Select 
                  value={editedIdea.category} 
                  onValueChange={(value) => setEditedIdea({ ...editedIdea, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No category</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!editedIdea.title.trim()}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default IdeaCard;
