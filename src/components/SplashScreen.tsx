import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowContent(true), 300);
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-accent transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
    >
      <div className="text-center space-y-6">
        {!showContent ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-80 mx-auto rounded-2xl" />
            <Skeleton className="h-6 w-48 mx-auto rounded-xl" />
            <div className="flex justify-center gap-2 mt-8">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
            </div>
          </div>
        ) : (
          <div className="animate-fadeInUp">
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary-foreground mb-4 bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text">
              Priya's Collection
            </h1>
            <p className="text-xl text-primary-foreground/90 font-body">Indian Ethnic Women's Wear</p>
            <div className="mt-8 flex justify-center">
              <div className="w-8 h-8 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
