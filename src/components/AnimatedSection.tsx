import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { PropsWithChildren } from 'react';

type AnimatedSectionProps = PropsWithChildren<{ className?: string; animation?: 'fadeInUp' | 'fadeIn' | 'scaleIn' }>

export const AnimatedSection = ({ children, className, animation = 'fadeInUp' }: AnimatedSectionProps) => {
    const { ref, inView } = useInView<HTMLDivElement>();
    return (
        <div ref={ref} className={cn('opacity-0 will-change-transform motion-safe:opacity-100', inView && `motion-safe:animate-${animation}`, className)}>
            {children}
        </div>
    );
};


