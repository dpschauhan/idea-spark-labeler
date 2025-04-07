
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb, Star, ThumbsDown } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                  Capture Your <span className="text-primary">Bright Ideas</span> and Never Lose Them Again
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  IdeaSpark helps you collect, organize, and evaluate your ideas. 
                  Label your best insights and learn from the not-so-great ones.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg">
                    <Link to="/ideas" className="gap-1">
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg">
                    <Link to="/faq">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="lg:pl-10">
                <div className="p-8 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border">
                  <div className="grid gap-6">
                    <div className="flex gap-4 items-start">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Lightbulb className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Capture Ideas</h3>
                        <p className="text-sm text-muted-foreground">
                          Record your ideas as they come, with detailed descriptions and categories.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="bg-yellow-500/10 p-3 rounded-lg">
                        <Star className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Mark Your Best</h3>
                        <p className="text-sm text-muted-foreground">
                          Highlight your most valuable ideas for easy reference and future development.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="bg-red-500/10 p-3 rounded-lg">
                        <ThumbsDown className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Learn From Mistakes</h3>
                        <p className="text-sm text-muted-foreground">
                          Identify less promising ideas to refine your creative process.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter">Why Use IdeaSpark?</h2>
              <p className="text-muted-foreground mt-2">
                Our simple platform helps you manage the entire idea lifecycle
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-2">Simple Organization</h3>
                <p className="text-muted-foreground">
                  Categorize and filter your ideas for better organization and retrieval.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-2">Idea Evaluation</h3>
                <p className="text-muted-foreground">
                  Use our labeling system to identify which ideas are worth pursuing.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-2">Easy Access</h3>
                <p className="text-muted-foreground">
                  Your ideas are saved locally so you can access them anytime, even offline.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Button asChild size="lg">
                <Link to="/ideas">Start Capturing Ideas</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <span className="font-semibold">IdeaSpark</span>
            </div>
            
            <div className="text-center sm:text-right text-sm text-muted-foreground">
              <p>© 2025 IdeaSpark. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
