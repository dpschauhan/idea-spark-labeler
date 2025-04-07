
import React from 'react';
import Navbar from '@/components/Navbar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      question: "What is IdeaSpark?",
      answer: "IdeaSpark is a web application designed to help you capture, organize, and evaluate your ideas. You can add detailed descriptions, categorize ideas, and label them as 'best' or 'worst' to track which ones are worth pursuing."
    },
    {
      question: "How do I add a new idea?",
      answer: "To add a new idea, navigate to the Ideas page and click the 'Add New Idea' button. Fill in the title, description, and optional category for your idea, then click 'Save Idea'."
    },
    {
      question: "Can I edit my ideas after adding them?",
      answer: "Currently, direct editing is not supported in this version. However, you can delete the idea and create a new one with the updated information. We plan to add editing functionality in future updates."
    },
    {
      question: "What does the 'best' and 'worst' labeling system do?",
      answer: "The labeling system helps you identify which ideas are promising and which ones might need reconsideration. Click the star icon to mark an idea as 'best' or the thumbs down icon to mark it as 'worst'. You can filter your ideas by these labels to focus on the ones with the most potential."
    },
    {
      question: "Is my data secure?",
      answer: "Your ideas are stored locally in your browser's storage. This means they stay on your device and aren't sent to any external servers. However, this also means that clearing your browser data will remove your saved ideas."
    },
    {
      question: "Can I export my ideas?",
      answer: "The current version doesn't support exporting ideas, but we're planning to add this feature in a future update, allowing you to export your ideas as CSV or JSON files."
    },
    {
      question: "How do I delete an idea?",
      answer: "To delete an idea, click the trash icon in the bottom-right corner of the idea card. Be careful, as this action cannot be undone."
    },
    {
      question: "Can I use IdeaSpark on mobile devices?",
      answer: "Yes! IdeaSpark is designed to be responsive and works well on mobile devices, tablets, and desktop computers."
    },
    {
      question: "How do I filter or search for specific ideas?",
      answer: "On the Ideas page, you can use the search bar to find ideas containing specific text in their title or description. You can also use the category filter to show only ideas from a particular category."
    },
    {
      question: "Will there be collaboration features in the future?",
      answer: "We're considering adding collaboration features in future versions, allowing teams to share and collaborate on ideas together. Stay tuned for updates!"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container px-4 py-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
            <p className="text-muted-foreground mt-2">
              Find answers to common questions about using IdeaSpark
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="text-center mt-8 p-6 border rounded-lg bg-secondary/30">
            <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
            <p className="text-muted-foreground mb-4">
              We're here to help! Here are some additional resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link to="/">Visit Home Page</Link>
              </Button>
              <Button asChild>
                <Link to="/ideas">Get Started</Link>
              </Button>
            </div>
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

export default FAQ;
