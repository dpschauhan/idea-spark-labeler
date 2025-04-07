
import React, { useState } from 'react';
import { useIdeas, Comment as CommentType } from '@/context/IdeaContext';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';

interface CommentSectionProps {
  ideaId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ ideaId }) => {
  const { ideas, addComment } = useIdeas();
  const [commentContent, setCommentContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const idea = ideas.find(i => i.id === ideaId);
  const comments = idea?.comments || [];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      return;
    }
    
    const name = authorName.trim() || 'Anonymous';
    
    addComment(ideaId, name, commentContent.trim());
    setCommentContent('');
  };
  
  if (!idea) {
    return null;
  }
  
  return (
    <div className="mt-4 border-t pt-4">
      <div 
        className="flex items-center gap-2 mb-4 cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <MessageSquare className="h-5 w-5" />
        <h3 className="font-medium">
          Comments ({comments.length})
        </h3>
      </div>
      
      {isExpanded && (
        <>
          <div className="space-y-4 mb-4">
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Your name (optional)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-background border rounded-md px-3 py-1.5 text-sm"
              />
            </div>
            <Textarea
              placeholder="Add a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!commentContent.trim()}>
                Post Comment
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

const Comment: React.FC<{ comment: CommentType }> = ({ comment }) => {
  const initials = comment.author
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return (
    <div className="flex gap-3">
      <Avatar>
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-baseline">
          <h4 className="font-medium">{comment.author}</h4>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentSection;
