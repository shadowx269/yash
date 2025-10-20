import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

export const Breadcrumb = () => {
    const location = useLocation();

    const getBreadcrumbs = (): BreadcrumbItem[] => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const breadcrumbs: BreadcrumbItem[] = [
            { label: 'Home', href: '/' }
        ];

        if (pathSegments.length === 0) return breadcrumbs;

        pathSegments.forEach((segment, index) => {
            const href = '/' + pathSegments.slice(0, index + 1).join('/');
            const label = segment.charAt(0).toUpperCase() + segment.slice(1);

            if (index === pathSegments.length - 1) {
                breadcrumbs.push({ label });
            } else {
                breadcrumbs.push({ label, href });
            }
        });

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center">
                    {index === 0 && <Home className="h-4 w-4 mr-1" />}
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="hover:text-primary transition-colors duration-200 font-medium"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground font-semibold">{item.label}</span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/60" />
                    )}
                </div>
            ))}
        </nav>
    );
};
