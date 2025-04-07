
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsDown, Trash } from 'lucide-react';
import { Idea, useIdeas } from '@/context/IdeaContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface IdeaCardProps {
  idea: Idea;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const { setLabel, deleteIdea } = useIdeas();
  
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(idea.createdAt));

  return (
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
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 whitespace-pre-wrap">{idea.description}</p>
        {idea.category && (
          <Badge variant="secondary" className="mt-2">
            {idea.category}
          </Badge>
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
      </CardFooter>
    </Card>
  );
};

export default IdeaCard;
