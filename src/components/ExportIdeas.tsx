
import React, { useState } from 'react';
import { Download, FileText, Files } from 'lucide-react';
import { useIdeas } from '@/context/IdeaContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ExportIdeas = () => {
  const { ideas } = useIdeas();
  const [isExporting, setIsExporting] = useState(false);

  const exportAsCsv = () => {
    setIsExporting(true);
    try {
      const headers = ['Title', 'Description', 'Category', 'Label', 'Created Date', 'Shared'];
      const csvRows = [
        headers.join(','),
        ...ideas.map(idea => {
          return [
            `"${idea.title.replace(/"/g, '""')}"`,
            `"${idea.description?.replace(/"/g, '""') || ''}"`,
            `"${idea.category || ''}"`,
            `"${idea.label || ''}"`,
            `"${idea.createdAt.toISOString()}"`,
            `"${idea.shared ? 'Yes' : 'No'}"`,
          ].join(',');
        })
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ideas_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Ideas exported as CSV!");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Failed to export ideas");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsText = () => {
    setIsExporting(true);
    try {
      let textContent = "# IDEAS EXPORT\n\n";
      
      ideas.forEach((idea, index) => {
        textContent += `## ${index + 1}. ${idea.title}\n\n`;
        textContent += `**Category:** ${idea.category || 'None'}\n`;
        textContent += `**Label:** ${idea.label || 'None'}\n`;
        textContent += `**Created:** ${idea.createdAt.toLocaleDateString()}\n`;
        textContent += `**Shared:** ${idea.shared ? 'Yes' : 'No'}\n\n`;
        textContent += `${idea.description || 'No description'}\n\n`;
        
        if (idea.comments?.length) {
          textContent += "### Comments\n\n";
          idea.comments.forEach((comment, commentIndex) => {
            textContent += `${commentIndex + 1}. **${comment.author}** (${comment.createdAt.toLocaleDateString()}):\n`;
            textContent += `   ${comment.content}\n\n`;
          });
        }
        
        textContent += "---\n\n";
      });

      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ideas_export_${new Date().toISOString().slice(0, 10)}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Ideas exported as text!");
    } catch (error) {
      console.error("Error exporting text:", error);
      toast.error("Failed to export ideas");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsCsv}>
          <Files className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsText}>
          <FileText className="h-4 w-4 mr-2" />
          Export as Text
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportIdeas;
