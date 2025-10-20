export const PromoBanner = () => {
    return (
        <section className="mt-6 animate-fade-in">
            <div className="relative overflow-hidden rounded-3xl border-2 bg-gradient-to-r from-primary/15 via-accent/10 to-primary/15 p-6 md:p-10 shadow-xl">
                <div className="relative z-10">
                    <h3 className="text-2xl md:text-4xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Festive Edit: New Season Styles
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                        Discover the latest in ethnic couture — handpicked silhouettes, premium fabrics, and timeless craftsmanship.
                    </p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-64 h-64 md:w-96 md:h-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -left-10 -top-10 w-64 h-64 md:w-96 md:h-96 rounded-full bg-accent/10 blur-3xl" />
            </div>
        </section>
    );
};


