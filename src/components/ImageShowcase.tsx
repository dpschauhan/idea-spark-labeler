
import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

const ImageShowcase: React.FC = () => {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
      alt: "Light bulb idea concept",
      caption: "Turn your bright ideas into reality"
    },
    {
      src: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
      alt: "Team brainstorming",
      caption: "Collaborate and organize your thoughts"
    },
    {
      src: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
      alt: "Organized notebook",
      caption: "Keep track of your best innovations"
    }
  ];

  return (
    <Carousel className="w-full max-w-4xl mx-auto my-8">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="border-0 shadow-none overflow-hidden">
                <CardContent className="flex aspect-video items-center justify-center p-0 relative rounded-lg overflow-hidden">
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-4">
                    <p className="text-lg font-semibold text-center text-foreground">
                      {image.caption}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex items-center justify-center mt-4">
        <CarouselPrevious className="relative static left-0 translate-y-0 mr-2" />
        <CarouselNext className="relative static right-0 translate-y-0 ml-2" />
      </div>
    </Carousel>
  );
};

export default ImageShowcase;
