import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="mt-16 border-t bg-card/70 backdrop-blur">
            <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Priya's Collection
                    </h3>
                    <p className="text-sm text-muted-foreground mt-3">
                        Premium ethnic fashion catalogue. Curated looks, elegant styles, enterprise-grade experience.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">Explore</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                        <li><Link to="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link></li>
                        <li><a href="#categories" className="hover:text-primary transition-colors">Categories</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">Company</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
                        <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
                        <li><a href="#privacy" className="hover:text-primary transition-colors">Privacy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">Stay Updated</h4>
                    <p className="text-sm text-muted-foreground">Follow the latest trends and collections.</p>
                    <div className="mt-3 text-xs text-muted-foreground">© {new Date().getFullYear()} Priya's Collection</div>
                </div>
            </div>
        </footer>
    );
};


